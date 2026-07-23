import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { Room } from "@/features/workflows/components/Room"
import {auth} from "@clerk/nextjs/server";
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
  await liveblocks.getOrCreateRoom(id, {
    defaultAccesses: [],
    groupsAccesses: {
      [orgId]: ["room:write"],
    },
    organizationId: orgId,
  })
  return (
    <Room roomId={id}>
      <WorkflowShell  workflowId={id}/>
    </Room>
  )
}
