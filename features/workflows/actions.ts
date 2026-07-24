"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth as triggerAuth, tasks ,runs} from "@trigger.dev/sdk";
import { createWorkflow, deleteWorkflow ,saveworkflowgraph} from "./data";
import { liveblocks } from "@/features/workflows/lib/liveblock";
import type { helloWorld } from "@/trigger/example";
import type {runworkflowTask} from "./tasks/run-workflow";
import { WorkFlowGraph } from "@/lib/db/schema";
export async function createWorkflowAction(name: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");

  const row = await createWorkflow(orgId, name);

  revalidatePath("/", "layout");
  redirect(`/workflows/${row.id}`);
}

export async function deleteWorkflowAction(workflowId: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");

  const deleted = await deleteWorkflow(orgId, workflowId);
  if (!deleted) throw new Error("Workflow not found");

  try {
    await liveblocks.deleteRoom(workflowId);
  } catch (error) {
    // Room may already be gone; the DB row is the source of truth.
    console.error("Failed to delete Liveblocks room:", error);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function runWorkflowAction({
  id,
  graph,
}:{
  id: string;
  graph: WorkFlowGraph;
}) {
  const {orgId} = await auth();
  if (!orgId) throw new Error("No active organization");

  await saveworkflowgraph({
    orgId,
    id,
    graph,
  });

  const handle = await tasks.trigger<typeof runworkflowTask>("run-workflow",
    {workFlowId:id,orgId},
    {tags:[`workflow:${id}`]}
  );

  return handle;
}

export async function cancelWorkflowAction(id: string) {
  const {orgId} = await auth();
  if (!orgId) throw new Error("No active organization");

  await runs.cancel(id);
}
