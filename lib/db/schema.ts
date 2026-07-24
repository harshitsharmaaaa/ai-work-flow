import { pgTable, text, timestamp ,uuid,jsonb} from 'drizzle-orm/pg-core';
import type {Edge} from "@xyflow/react";
import type {StepNodeType} from "../../features/workflows/nodes/node-registry";


export type WorkFlowGraph = {nodes: StepNodeType[], edges: Edge[]};

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey(),
  orgId: text('org_id').notNull(),
  name: text('name').notNull(),
  graph: jsonb('graph').$type<WorkFlowGraph>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
