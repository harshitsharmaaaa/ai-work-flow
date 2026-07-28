import * as Sentry from "@sentry/nextjs";
import { WorkflowShell } from "@/features/workflows/components/workflow-shell"
import { Room } from "@/features/workflows/components/Room"
import { WorkflowRunsProvider } from "@/features/workflows/components/workflow-runs-provider"
import {auth} from "@clerk/nextjs/server";
import {auth as triggerAuth} from "@trigger.dev/sdk";
import {notFound} from "next/navigation";
import {getWorkflow} from "@/features/workflows/data"
import { liveblocks } from "@/features/workflows/lib/liveblock";

type WorkflowPageProps = {
  params: Promise<{ id: string }>
}

export default async function Page(props: WorkflowPageProps) {
  const { id } = await props.params
  const {orgId} = await auth()
  if(!orgId){
    Sentry.logger.warn("Workflow page requested without an active organization", {
      workflowId: id,
    });
    return notFound()
  }
  const workflows = await getWorkflow(orgId,id)
  if(!workflows){
    Sentry.logger.warn("Workflow page requested for a missing workflow", {
      workflowId: id,
      orgId,
    });
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
    Sentry.logger.error("Failed to create Liveblocks room", {
      workflowId: id,
      orgId,
      error,
    });
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
