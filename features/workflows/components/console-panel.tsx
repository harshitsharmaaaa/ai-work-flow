"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { InspectorPanel } from "@/features/workflows/components/inspector-panel"
import { LogsPanel, type ConsoleSelection } from "@/features/workflows/components/logs-panel"

export function ConsolePanel() {
  const [selected, setSelected] = useState<ConsoleSelection>(null)

  return (
    <ResizablePanelGroup orientation="horizontal" className="size-full">
      <ResizablePanel defaultSize={65} minSize={40}>
        <LogsPanel selected={selected} onSelect={setSelected} />
      </ResizablePanel>
      {selected && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={35} minSize={25}>
            <InspectorPanel selected={selected} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
