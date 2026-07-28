"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react"

import {
  nodeRegistry,
  type StepNodeType,
} from "../nodes/node-registry"
import { useLatestRunSteps } from "@/features/workflows/components/workflow-runs-provider"
import { cn } from "@/lib/utils"

function StepNodeComponent({ id, data, selected }: NodeProps<StepNodeType>) {
  const { type, kind, title, values } = data
  const def = nodeRegistry[type]
  const Icon = def.icon
  const { steps, isLive } = useLatestRunSteps()

  const step = steps.find((s) => s.nodeId === id)
  const isRunning = step?.status === "running" && isLive
  const isFailed = step?.status === "failed"
  const isComplete = step?.status === "done"

  // A trigger starts the flow and takes no input, so it has no target handle.
  const hasTarget = kind !== "trigger"

  // The start node has no fields to display.
  const hasDetails = type !== "start" && def.fields.length > 0

  return (
    <div
      className={cn(
        "group/step relative min-w-50 max-w-80 overflow-hidden rounded-(--radius) border-2 bg-card text-card-foreground shadow-[0_18px_40px_-30px_rgba(0,0,0,0.35)] transition-transform duration-300 will-change-transform",
        isRunning && "border-primary/70 shadow-[0_18px_50px_-28px_color-mix(in_oklch,var(--primary),transparent_35%)]",
        isFailed && "border-destructive/70 shadow-[0_18px_50px_-28px_color-mix(in_oklch,var(--destructive),transparent_35%)]",
        isComplete && "border-emerald-500/60",
        !isRunning && !isFailed && "border-border",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
        "hover:-translate-y-0.5"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
          isRunning && "workflow-border-sweep opacity-100 bg-[linear-gradient(90deg,transparent, color-mix(in_oklch,var(--primary),transparent_70%),transparent)]",
          isFailed && "opacity-100 bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--destructive),transparent_72%),transparent)]",
          isComplete && "opacity-100 bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--chart-2),transparent_72%),transparent)]",
        )}
      />
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ transform: "translate(-100%, -50%)" }}
          className={cn(
            "h-3.5! w-1.5! min-w-0! rounded-l-xs! rounded-r-none! border-0! bg-border! transition-colors",
            isRunning && "bg-primary!",
            isFailed && "bg-destructive!",
          )}
        />
      )}

      <div className="relative flex items-center gap-2.5 px-3 py-2.5">
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md transition-all duration-300",
            isRunning && "bg-blue-500 text-white",
            isFailed && "bg-destructive text-destructive-foreground",
            isComplete && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
            !isRunning && def.accent
          )}
        >
          {isRunning ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : isFailed ? (
            <XCircle className="size-4" />
          ) : isComplete ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <Icon className="size-4" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold">{title}</span>
          <span className="text-[11px] text-muted-foreground">
            {isRunning
              ? "Executing"
              : isFailed
                ? "Needs attention"
                : isComplete
                  ? "Completed"
                  : kind === "trigger"
                    ? "Workflow entry"
                    : "Ready"}
          </span>
        </div>
      </div>

      {hasDetails && (
        <div className="relative flex flex-col gap-1.5 border-t border-border/80 px-3 py-2">
          {def.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-0.5">
              <span className="text-[0.6875rem] font-medium text-muted-foreground">
                {field.label}
                {field.required && (
                  <span className="text-destructive">*</span>
                )}
              </span>
              <span className="truncate text-xs">
                {values[field.key] || (
                  <span className="text-muted-foreground/60">
                    {field.placeholder ?? "—"}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ transform: "translate(100%, -50%)" }}
        className={cn(
          "h-3.5! w-1.5! min-w-0! rounded-l-none! rounded-r-xs! border-0! bg-border! transition-colors",
          isRunning && "bg-primary!",
          isFailed && "bg-destructive!",
        )}
      />
    </div>
  )
}

export const StepNode = memo(StepNodeComponent)
