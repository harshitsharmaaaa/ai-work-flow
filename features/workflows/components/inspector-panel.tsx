"use client"

import { useMemo } from "react"

import { useLatestRunSteps } from "@/features/workflows/components/workflow-runs-provider"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import { cn } from "@/lib/utils"
import type { SelectedStepRef } from "@/features/workflows/components/logs-panel"

export function InspectorPanel({ selectedStep }: { selectedStep: SelectedStepRef }) {
  const { runs } = useLatestRunSteps()

  const step = useMemo(() => {
    if (!selectedStep) return undefined
    const run = runs.find((item) => item.id === selectedStep.runId)
    return run?.steps.find((item) => item.nodeId === selectedStep.nodeId)
  }, [runs, selectedStep])

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border px-3 py-2 text-sm font-semibold">Output</div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!selectedStep ? (
          <p className="text-sm text-muted-foreground">Select a step to inspect its output.</p>
        ) : !step ? (
          <p className="text-sm text-muted-foreground">Selected step is no longer available.</p>
        ) : step.status === "failed" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <NodeIcon type={step.nodeType} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-destructive">Failed</div>
              </div>
            </div>
            <pre className="whitespace-pre-wrap rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
              {step.error ?? "Step failed without an error message."}
            </pre>
          </div>
        ) : step.output == null ? (
          <p className="text-sm text-muted-foreground">This step produced no output.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <NodeIcon type={step.nodeType} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{step.title}</div>
                <div className={cn("text-xs text-muted-foreground")}>Completed</div>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 text-xs">
              {JSON.stringify(step.output, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
