ALTER TABLE "workflows" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "graph" jsonb;