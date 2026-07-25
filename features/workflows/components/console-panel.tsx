"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { InspectorPanel } from "@/features/workflows/components/inspector-panel"
import { LogsPanel, type SelectedStepRef } from "@/features/workflows/components/logs-panel"

export function ConsolePanel() {
  const [selectedStep, setSelectedStep] = useState<SelectedStepRef>(null)

  return (
    <ResizablePanelGroup orientation="horizontal" className="size-full">
      <ResizablePanel defaultSize={65} minSize={40}>
        <LogsPanel selectedStep={selectedStep} onSelectStep={setSelectedStep} />
      </ResizablePanel>
      {selectedStep && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={35} minSize={25}>
            <InspectorPanel selectedStep={selectedStep} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
