"use client"

import { useTransition } from "react"
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
import { generateSlug } from "@/features/workflows/lib/generate-slug"

type Workflow = {
  id: string
  name: string
}

type WorkflowNavProps = {
  workflows: Workflow[]
  createWorkflow: (name: string) => Promise<void>
}

export function WorkflowNav({ workflows, createWorkflow }: WorkflowNavProps) {
  const { state } = useSidebar()
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    startTransition(() => createWorkflow(generateSlug()))
  }

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
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleCreate}
                    disabled={isPending}
                  >
                    <Plus />
                    New workflow
                  </Button>
                  {workflows.map((workflow) => (
                    <Button
                      key={workflow.id}
                      variant="ghost"
                      className="justify-start"
                    >
                      {workflow.name}
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
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New workflow"
              onClick={handleCreate}
              disabled={isPending}
            >
              <Plus />
              <span>New workflow</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {workflows.map((workflow) => (
            <SidebarMenuItem key={workflow.id}>
              <SidebarMenuButton tooltip={workflow.name}>
                <span>{workflow.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
