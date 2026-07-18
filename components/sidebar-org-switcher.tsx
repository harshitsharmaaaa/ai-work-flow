"use client"

import { OrganizationSwitcher } from "@clerk/nextjs"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function SidebarOrgSwitcher() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <OrganizationSwitcher
      appearance={{
        elements: {
          rootBox: "w-full! max-w-full!",
          organizationSwitcherTrigger: cn(
            "w-full! max-w-full! justify-start! overflow-hidden! px-2!",
            collapsed && "size-8! justify-center! p-0!"
          ),
          organizationPreview: "min-w-0! gap-2!",
          organizationPreviewAvatarBox: "shrink-0",
          organizationPreviewTextContainer: cn(
            "min-w-0! truncate!",
            collapsed && "hidden!"
          ),
          organizationSwitcherTriggerIcon: cn(
            "ml-auto! shrink-0",
            collapsed && "hidden!"
          ),
        },
      }}
    />
  )
}
