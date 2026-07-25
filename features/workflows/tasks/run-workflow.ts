import {logger,metadata,task} from "@trigger.dev/sdk";
import toposort from "toposort";
import {getWorkflow} from "@/features/workflows/data";
import {Stagehand} from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executor";
import { interpolate } from "@/features/workflows/lib/interpolate";

export type RunStep = {
  id: string
  status: "pending" | "running" | "done" | "failed"
}

export const runworkflowTask = task({
    id:"run-workflow",
    run:async({workFlowId,orgId}:{workFlowId:string,orgId:string})=>{
        const workflow =await getWorkflow(orgId,workFlowId);
        if(!workflow?.graph){
            throw new Error("Workflow not found");
        }

        const {nodes, edges} = workflow.graph;
        const byId = new Map(nodes.map((node) => [node.id, node]));
        const connected = new Set(edges.flatMap((edge) => [edge.source, edge.target]));

        const order = toposort
            .array(
                nodes.map((node) => node.id),
                edges.map((edge) => [edge.source, edge.target])
            )
            .filter((id) => connected.has(id));
        
        logger.log(`Running workflow ${workflow.name}`,{steps:order.length});

        const steps: RunStep[] = order.map((id) => ({ id, status: "pending" as const }));
        metadata.set("steps", steps);
        await metadata.flush();

        let stagehand: Stagehand | undefined;
        const getStagehand = async () => {
            if(!stagehand){
                stagehand = new Stagehand({
                    env:"BROWSERBASE",
                    apiKey:process.env.BROWSERBASE_API_KEY,
                    model:"google/gemini-2.5-flash",
                    disablePino:true,

                });
            }
            await stagehand.init();
            return stagehand;
        }

        const outputs: Record<string, unknown> = {};

        for (const id of order) {
            const node = byId.get(id);
            logger.log(`Running step ${node?.data.title}`);

            const rawValues = node?.data.values ?? {};
            const interpolatedValues: Record<string, string> = {};
            for (const [key, value] of Object.entries(rawValues)) {
                interpolatedValues[key] = interpolate(value, outputs);
            }

            const step = steps.find((s) => s.id === id);
            if (step) {
              step.status = "running";
              metadata.set("steps", steps);
              await metadata.flush();
            }

            const executor = nodeExecutors[node?.data.type!];
            if(executor){
                try {
                  const result = await executor({value:interpolatedValues,getStagehand});
                  outputs[id] = result;
                  if (step) {
                    step.status = "done";
                    metadata.set("steps", steps);
                  }
                } catch (error) {
                  if (step) {
                    step.status = "failed";
                    metadata.set("steps", steps);
                    await metadata.flush();
                  }
                  throw error;
                }
            }
        }
        await stagehand?.close();
        return steps;
    }
})