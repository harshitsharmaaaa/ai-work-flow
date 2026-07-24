import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, workflows ,WorkFlowGraph} from "@/lib/db/schema";
import {validateGraph} from "./lib/validate-grpah";

export async function saveworkflowgraph({
  orgId,
  id,
  graph,
} : {
  orgId: string;
  id: string;
  graph: WorkFlowGraph;
}){
  const problems = validateGraph(graph);
  if(problems.length > 0){
    throw new Error(problems.join("\n"));
  }
  await db
    .update(workflows)
    .set({
      graph,
      updatedAt: new Date(),
    })
    .where(and(eq(workflows.id, id), eq(workflows.orgId, orgId)));
}



export function userList(id: string) {
   return (
    db
    .select()
    .from(users)
    .where(eq(users.id, id))
   ) 
}

export async function listWorkflows(orgId: string) {
  return await db
    .select()
    .from(workflows)
    .where(eq(workflows.orgId, orgId))
    .orderBy(desc(workflows.createdAt));
}

export async function createWorkflow(orgId: string, name: string) {
  const [row] = await db
    .insert(workflows)
    .values({
      id: crypto.randomUUID(),
      orgId,
      name,
    })
    .returning();
  return row;
}

export async function getWorkflow(orgId: string, id: string) {
  const [row] = await db
    .select()
    .from(workflows)
    .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)));
  return row;
}

export async function deleteWorkflow(orgId: string, id: string) {
  const [row] = await db
    .delete(workflows)
    .where(and(eq(workflows.orgId, orgId), eq(workflows.id, id)))
    .returning();
  return row;
}