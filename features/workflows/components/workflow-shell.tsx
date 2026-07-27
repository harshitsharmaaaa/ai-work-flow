import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Canvas } from "@/features/workflows/components/canvas"
import { ConsolePanel } from "@/features/workflows/components/console-panel"
import { RightSidebar } from "@/features/workflows/components/right-sidebar"

export function WorkflowShell({ workflowId }: { workflowId: string }) {
  return (
    <div className="relative size-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary),transparent_78%)_0%,transparent_34%),radial-gradient(circle_at_80%_15%,color-mix(in_oklch,var(--accent),transparent_80%)_0%,transparent_28%),linear-gradient(180deg,color-mix(in_oklch,var(--background),var(--foreground)_1%)_0%,var(--background)_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="workflow-aurora absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklch,var(--primary),transparent_78%)_0%,transparent_24%),radial-gradient(circle_at_80%_10%,color-mix(in_oklch,var(--chart-2),transparent_80%)_0%,transparent_20%),radial-gradient(circle_at_55%_90%,color-mix(in_oklch,var(--chart-3),transparent_85%)_0%,transparent_18%)] blur-3xl" />
        <div className="workflow-grid-drift absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--border),transparent_14%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border),transparent_14%)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>
      <ResizablePanelGroup orientation="horizontal" className="relative size-full">
        <ResizablePanel minSize="30rem" className="bg-background/50 backdrop-blur-sm">
          <ResizablePanelGroup orientation="vertical" className="size-full">
            <ResizablePanel minSize="18rem">
              <Canvas />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="8rem" minSize="6rem">
              <ConsolePanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="16rem" minSize="14rem" maxSize="36rem" className="bg-background/60 backdrop-blur-sm">
          <RightSidebar workflowId={workflowId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
