import { createWorkflowAction } from "@/features/workflows/actions"
import { EmptyWorkflows } from "@/features/workflows/components/empty-workflows"

export default function Page() {
  return <EmptyWorkflows createWorkflow={createWorkflowAction} />
}
