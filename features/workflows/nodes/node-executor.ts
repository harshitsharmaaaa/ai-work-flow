import type {Stagehand} from "@browserbasehq/stagehand";
import type {ActionNodeType,NodeType} from "./node-registry";
import {openUrl} from "./open-url";
import {actOnPage} from "./act";
import {extractFromPage} from "./extract";
import {observePage} from "./observe";
import {runAgent} from "./agent";
import { sendEmail } from "./send-email";

export type NodeContext = {
    value: Record<string, string>
    getStagehand: () => Promise<Stagehand>
}


export type NodeExecutor = (context: NodeContext) => Promise<unknown>

export const nodeExecutors: Partial<Record<NodeType, NodeExecutor>> = {
    "open-url": async ({value, getStagehand}) => {
        const stagehand = await getStagehand();
        await openUrl({stagehand,url:value.url});
    },
    "act": async ({value, getStagehand}) => {
        const stagehand = await getStagehand();
        return actOnPage({stagehand, instruction: value.instruction});
    },
    "extract": async ({value, getStagehand}) => {
        const stagehand = await getStagehand();
        return extractFromPage({stagehand, instruction: value.instruction});
    },
    "observe": async ({value, getStagehand}) => {
        const stagehand = await getStagehand();
        return observePage({stagehand, instruction: value.instruction});
    },
    "agent": async ({value, getStagehand}) => {
        const stagehand = await getStagehand();
        return runAgent({stagehand, instruction: value.instruction});
    },
    "send-email": async ({value}) => {
        return sendEmail({to:value.to, subject:value.subject, body:value.body});
    }
} satisfies Record<ActionNodeType, NodeExecutor>
