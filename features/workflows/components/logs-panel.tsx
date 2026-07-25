"use client"

import prettyMs from "pretty-ms"

import { NodeIcon } from "@/features/workflows/components/node-icon"
import { useLatestRunSteps } from "@/features/workflows/components/workflow-runs-provider"
import { cn } from "@/lib/utils"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"

function StepRow({
  step,
  selected,
  onClick,
}: {
  step: RunStep
  selected: boolean
  onClick: () => void
}) {
  const isRunning = step.status === "running"
  const isFailed = step.status === "failed"
  const isInactive = step.status === "pending"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition-colors",
        selected ? "border-ring bg-accent/50" : "border-transparent hover:bg-accent/40",
        isFailed && "border-destructive/30 bg-destructive/5",
        isInactive && "opacity-60",
      )}
    >
      <NodeIcon type={step.nodeType} running={isRunning} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">{step.title}</div>
        <div className="text-[11px] text-muted-foreground">
          {step.durationMs != null ? prettyMs(step.durationMs) : isRunning ? "Running…" : "Waiting"}
        </div>
      </div>
      {isFailed && <span className="text-[11px] font-medium text-destructive">Failed</span>}
    </button>
  )
}

export type SelectedStepRef = {
  runId: string
  nodeId: string
} | null

export function LogsPanel({
  selectedStep,
  onSelectStep,
}: {
  selectedStep: SelectedStepRef
  onSelectStep: (step: SelectedStepRef) => void
}) {
  const { runs } = useLatestRunSteps()

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-t border-border bg-background">
      <div className="border-b border-border px-3 py-2 text-sm font-semibold">Console</div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-4">
          {runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs yet.</p>
          ) : (
            runs.map((run) => (
              <div key={run.id} className="flex flex-col gap-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Run {run.id.slice(0, 8)}
                </div>
                <div className="flex flex-col gap-1.5">
                  {run.steps.map((step) => {
                    const isSelected =
                      selectedStep?.runId === run.id &&
                      selectedStep.nodeId === step.nodeId
                    return (
                      <StepRow
                        key={`${run.id}:${step.nodeId}`}
                        step={step}
                        selected={isSelected}
                        onClick={() =>
                          onSelectStep(
                            isSelected
                              ? null
                              : { runId: run.id, nodeId: step.nodeId },
                          )
                        }
                      />
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
