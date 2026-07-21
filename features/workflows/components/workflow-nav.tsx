"use client"

import { useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()

  function isActive(id: string) {
    return pathname === `/workflows/${id}`
  }

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
                      render={
                        <Link href={`/workflows/${workflow.id}`} />
                      }
                      aria-current={isActive(workflow.id) ? "page" : undefined}
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
              <SidebarMenuButton
                tooltip={workflow.name}
                isActive={isActive(workflow.id)}
                render={<Link href={`/workflows/${workflow.id}`} />}
              >
                <span>{workflow.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
