import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, workflows } from "@/lib/db/schema";

export function userList(id: string) {
   return (
    db
    .select()
    .from(users)
    .where(eq(users.id, id))
   ) 
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