"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createWorkflow } from "./data";

export async function createWorkflowAction(name: string) {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No active organization");

  const row = await createWorkflow(orgId, name);

  revalidatePath("/", "layout");
  redirect(`/workflows/${row.id}`);
}
