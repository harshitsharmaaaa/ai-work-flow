"use client"

import { useTransition } from "react"
import { Plus, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { generateSlug } from "@/features/workflows/lib/generate-slug"

type EmptyWorkflowsProps = {
  createWorkflow: (name: string) => Promise<void>
}

export function EmptyWorkflows({ createWorkflow }: EmptyWorkflowsProps) {
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    startTransition(() => createWorkflow(generateSlug()))
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Workflow />
          </EmptyMedia>
          <EmptyTitle>No workflow selected</EmptyTitle>
          <EmptyDescription>
            Get started by creating a new workflow.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={handleCreate} disabled={isPending}>
            <Plus />
            Create workflow
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
