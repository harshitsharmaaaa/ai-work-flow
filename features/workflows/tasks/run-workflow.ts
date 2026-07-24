import {logger,task} from "@trigger.dev/sdk";
import toposort from "toposort";
import {getWorkflow} from "@/features/workflows/data";



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

        for (const id of order) {
            const node = byId.get(id);
            logger.log(`Running step ${node?.data.title}`);
            // TODO: run the node. instead of logging, send a message to the liveblocks room.
        }
        return {steps:order.length};
    }
})