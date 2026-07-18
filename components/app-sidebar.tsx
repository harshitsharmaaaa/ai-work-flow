import { UserButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarOrgSwitcher } from "@/components/sidebar-org-switcher"
import { WorkflowNav } from "@/features/workflows/components/workflow-nav"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="overflow-hidden">
      <SidebarHeader className="overflow-hidden">
        <SidebarOrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <WorkflowNav />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
