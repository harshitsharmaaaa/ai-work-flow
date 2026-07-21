"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth as triggerAuth, tasks } from "@trigger.dev/sdk";
import { createWorkflow } from "./data";
import type { helloWorld } from "@/trigger/example";

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");

  const row = await createWorkflow(orgId, name);

  revalidatePath("/", "layout");
  redirect(`/workflows/${row.id}`);
}

export async function runWorkflowAction(workflowId: string) {
  const handle = await tasks.trigger<typeof helloWorld>("hello-world", {
    message: `Run workflow ${workflowId}`,
  });

  const publicAccessToken = await triggerAuth.createPublicToken({
    scopes: { read: { runs: [handle.id] } },
  });

  return {
    runId: handle.id,
    publicAccessToken: publicAccessToken,
  };
}
