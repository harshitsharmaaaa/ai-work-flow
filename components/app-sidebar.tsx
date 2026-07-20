import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarOrgSwitcher } from "@/components/sidebar-org-switcher"
import { listWorkflows } from "@/features/workflows/data"
import { createWorkflowAction } from "@/features/workflows/actions"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"

export async function AppSidebar() {
  const { orgId } = await auth()
  const workflows = orgId ? await listWorkflows(orgId) : []

  return (
    <Sidebar collapsible="icon" className="overflow-hidden">
      <SidebarHeader className="overflow-hidden">
        <SidebarOrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <WorkflowNav
          workflows={workflows}
          createWorkflow={createWorkflowAction}
        />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
