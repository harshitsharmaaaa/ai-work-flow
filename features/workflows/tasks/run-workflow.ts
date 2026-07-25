import {logger,metadata,task} from "@trigger.dev/sdk";
import type { DeserializedJson } from "@trigger.dev/core";
import toposort from "toposort";
import {getWorkflow} from "@/features/workflows/data";
import {Stagehand} from "@browserbasehq/stagehand"
import { nodeExecutors } from "@/features/workflows/nodes/node-executor";
import { interpolate } from "@/features/workflows/lib/interpolate";
import type { NodeType } from "@/features/workflows/nodes/node-registry";

export type RunStep = {
  nodeId: string
  nodeType: NodeType
  title: string
  status: "pending" | "running" | "done" | "failed"
  startedAt: number | null
  finishedAt: number | null
  durationMs: number | null
  output: DeserializedJson | null
  error: string | null
}

export type RunOutput = {
  sessionId: string | null
  steps: RunStep[]
}

function toDeserializedJson(value: unknown): DeserializedJson | null {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => toDeserializedJson(item))
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, item]) => [key, toDeserializedJson(item)],
    )
    return Object.fromEntries(entries)
  }

  return null
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

        const steps: RunStep[] = order.map((id) => {
            const node = byId.get(id);
            return {
              nodeId: id,
              nodeType: node?.data.type as NodeType,
              title: node?.data.title ?? id,
              status: "pending" as const,
              startedAt: null,
              finishedAt: null,
              durationMs: null,
              output: null,
              error: null,
            };
        });
        metadata.set("steps", steps);
        await metadata.flush();

        let stagehand: Stagehand | undefined;
        let replaySessionId: string | null = null;
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
            replaySessionId = stagehand.browserbaseSessionID ?? replaySessionId;
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

            const step = steps.find((s) => s.nodeId === id);
            if (step) {
              step.status = "running";
              step.startedAt = Date.now();
              step.finishedAt = null;
              step.durationMs = null;
              step.error = null;
              metadata.set("steps", steps);
              await metadata.flush();
            }

            const executor = nodeExecutors[node?.data.type!];
            if(!executor){
                if (step) {
                  step.status = "done";
                  step.finishedAt = Date.now();
                  step.durationMs = step.startedAt ? step.finishedAt - step.startedAt : null;
                  metadata.set("steps", steps);
                  await metadata.flush();
                }
                continue;
            }

            try {
              const result = await executor({value:interpolatedValues,getStagehand});
              outputs[id] = result;
              if (step) {
                step.status = "done";
                step.output = toDeserializedJson(result);
                step.finishedAt = Date.now();
                step.durationMs = step.startedAt ? step.finishedAt - step.startedAt : null;
                metadata.set("steps", steps);
                await metadata.flush();
              }
            } catch (error) {
              if (step) {
                step.status = "failed";
                step.error = error instanceof Error ? error.message : String(error);
                step.finishedAt = Date.now();
                step.durationMs = step.startedAt ? step.finishedAt - step.startedAt : null;
                metadata.set("steps", steps);
                await metadata.flush();
              }
              throw error;
            }
        }
        await stagehand?.close();
        return {
          sessionId: replaySessionId,
          steps,
        } satisfies RunOutput;
    }
})
