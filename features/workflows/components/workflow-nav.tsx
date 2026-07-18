"use client"

import { Plus, Workflow } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

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

export function WorkflowNav() {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return (
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <SidebarMenuButton
                tooltip="Workflows"
                render={<PopoverTrigger />}
              >
                <Workflow />
              </SidebarMenuButton>
              <PopoverContent side="right" align="start">
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" className="justify-start">
                    <Plus />
                    New workflow
                  </Button>
                  {workflows.map((workflow) => (
                    <Button
                      key={workflow.id}
                      variant="ghost"
                      className="justify-start"
                    >
                      {workflow.title}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workflows.map((workflow) => (
            <SidebarMenuItem key={workflow.id}>
              <SidebarMenuButton tooltip={workflow.description}>
                <span>{workflow.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
