"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { FolderKanban } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const workflows = [
  {
    id: "1",
    title: "Email Automation",
    description: "Automated email sequences",
  },
  {
    id: "2",
    title: "Data Pipeline",
    description: "ETL data processing",
  },
  {
    id: "3",
    title: "Customer Onboarding",
    description: "New user workflows",
  },
  {
    id: "4",
    title: "Report Generation",
    description: "Weekly report automation",
  },
  {
    id: "5",
    title: "Social Media Scheduler",
    description: "Cross-platform posting",
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workflows</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workflows.map((workflow) => (
                <SidebarMenuItem key={workflow.id}>
                  <SidebarMenuButton tooltip={workflow.description}>
                    <FolderKanban />
                    <span>{workflow.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
