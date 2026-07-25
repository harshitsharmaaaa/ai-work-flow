import type {Stagehand} from "@browserbasehq/stagehand";
import type {ActionNodeType,NodeType} from "./node-registry";
import {openUrl} from "./open-url";

export type NodeContext = {
    value: Record<string, string>
    getStagehand: () => Promise<Stagehand>
}


export type NodeExecutor = (context: NodeContext) => Promise<unknown>

export const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {
    "open-url": async ({value, getStagehand}) => {
        const stagehand = await getStagehand();
        await openUrl({stagehand,url:value.url});
    }
} satisfies Record<ActionNodeType, NodeExecutor>