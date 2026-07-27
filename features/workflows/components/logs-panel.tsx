"use client"

import prettyMs from "pretty-ms"

import { NodeIcon } from "@/features/workflows/components/node-icon"
import { useLatestRunSteps } from "@/features/workflows/components/workflow-runs-provider"
import { cn } from "@/lib/utils"
import type { RunStep } from "@/features/workflows/tasks/run-workflow"

export type ConsoleSelection =
  | { kind: "step"; runId: string; nodeId: string }
  | { kind: "replay"; runId: string }
  | null

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
        "group/item flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition-all duration-300 hover:-translate-y-0.5",
        selected ? "border-ring bg-accent/60 shadow-sm" : "border-transparent hover:bg-accent/40",
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
      {isRunning ? (
        <span className="workflow-pulse rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          Live
        </span>
      ) : isFailed ? (
        <span className="rounded-full border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
          Failed
        </span>
      ) : null}
    </button>
  )
}

export type SelectedStepRef = {
  runId: string
  nodeId: string
} | null

export function LogsPanel({
  selected,
  onSelect,
}: {
  selected: ConsoleSelection
  onSelect: (selection: ConsoleSelection) => void
}) {
  const { runs } = useLatestRunSteps()

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-t border-border bg-background">
      <div className="border-b border-border px-3 py-2 text-sm font-semibold">Execution Log</div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-4">
          {runs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">No executions yet. Run the workflow to watch steps stream in.</p>
            </div>
          ) : (
            runs.map((run) => (
              <div key={run.id} className="flex flex-col gap-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Run {run.id.slice(0, 8)}
                </div>
                <div className="flex flex-col gap-1.5">
                  {run.sessionId && (
                    <button
                      type="button"
                      onClick={() =>
                        onSelect(
                          selected?.kind === "replay" && selected.runId === run.id
                            ? null
                            : { kind: "replay", runId: run.id },
                        )
                      }
                      className={cn(
                        "group/item flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left transition-all duration-300 hover:-translate-y-0.5",
                        selected?.kind === "replay" && selected.runId === run.id
                          ? "border-ring bg-accent/60 shadow-sm"
                          : "border-transparent hover:bg-accent/40",
                      )}
                    >
                      <span className="workflow-pulse flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <span className="size-2 rounded-full bg-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium">Replay</div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {run.sessionId}
                        </div>
                      </div>
                    </button>
                  )}
                  {run.status === "EXECUTING" && (
                    <div className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] text-primary">
                      Execution is in progress and the timeline is updating live.
                    </div>
                  )}
                  {run.steps.map((step, index) => {
                    const stepKey = step.nodeId ?? `${run.id}:${step.nodeType}:${index}`
                    const isSelected =
                      selected?.kind === "step" &&
                      selected.runId === run.id &&
                      selected.nodeId === step.nodeId
                    return (
                      <StepRow
                        key={stepKey}
                        step={step}
                        selected={isSelected}
                        onClick={() =>
                          onSelect(
                            isSelected
                              ? null
                              : {
                                  kind: "step",
                                  runId: run.id,
                                  nodeId: step.nodeId,
                                },
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
