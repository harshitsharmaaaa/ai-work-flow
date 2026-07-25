import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { Room } from "@/features/workflows/components/Room"
import { WorkflowRunsProvider } from "@/features/workflows/components/workflow-runs-provider"
import {auth} from "@clerk/nextjs/server";
import {auth as triggerAuth} from "@trigger.dev/sdk";
import {notFound} from "next/navigation";
import {getWorkflow} from "@/features/workflows/data"
import { liveblocks } from "@/features/workflows/lib/liveblock";

export default async function Page(props: PageProps<"/workflows/[id]">) {
  const { id } = await props.params
  const {orgId} = await auth()
  if(!orgId){
    return notFound()
  }
  const workflows = await getWorkflow(orgId,id)
  if(!workflows){
    return notFound()
  }
  try {
    await liveblocks.getOrCreateRoom(id, {
      defaultAccesses: [],
      groupsAccesses: {
        [orgId]: ["room:write"],
      },
      organizationId: orgId,
    })
  } catch (error) {
    console.error("Failed to create Liveblocks room:", error)
  }

  const accessToken = await triggerAuth.createPublicToken({
    scopes: { read: { tags: [`workflow:${id}`] } },
    expirationTime: "1hr",
  })

  return (
    <Room roomId={id}>
      <WorkflowRunsProvider workflowId={id} accessToken={accessToken}>
        <WorkflowShell  workflowId={id}/>
      </WorkflowRunsProvider>
    </Room>
  )
}
