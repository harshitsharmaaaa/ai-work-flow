import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { Room } from "@/features/workflows/components/Room"
export default async function Page(props: PageProps<"/workflows/[id]">) {
  const { id } = await props.params

  return (
    <Room roomId={id}>
      <WorkflowShell  workflowId={id}/>
    </Room>
  )
}
