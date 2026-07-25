"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { LoaderCircle } from "lucide-react"

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

  const step = steps.find((s) => s.id === id)
  const isRunning = step?.status === "running" && isLive
  const isFailed = step?.status === "failed"

  // A trigger starts the flow and takes no input, so it has no target handle.
  const hasTarget = kind !== "trigger"

  // The start node has no fields to display.
  const hasDetails = type !== "start" && def.fields.length > 0

  return (
    <div
      className={cn(
        "min-w-50 max-w-80 rounded-(--radius) border-2 bg-card text-card-foreground",
        isRunning && "border-blue-500",
        isFailed && "border-destructive",
        !isRunning && !isFailed && "border-border",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-background"
      )}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ transform: "translate(-100%, -50%)" }}
          className="h-3.5! w-1.5! min-w-0! rounded-l-xs! rounded-r-none! border-0! bg-border!"
        />
      )}

      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md",
            isRunning && "bg-blue-500 text-white",
            !isRunning && def.accent
          )}
        >
          {isRunning ? <LoaderCircle className="size-4 animate-spin" /> : <Icon className="size-4" />}
        </div>
        <span className="text-sm font-semibold">{title}</span>
      </div>

      {hasDetails && (
        <div className="flex flex-col gap-1.5 border-t border-border px-3 py-2">
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
        className="h-3.5! w-1.5! min-w-0! rounded-l-none! rounded-r-xs! border-0! bg-border!"
      />
    </div>
  )
}

export const StepNode = memo(StepNodeComponent)
