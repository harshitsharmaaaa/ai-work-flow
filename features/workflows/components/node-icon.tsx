"use client"

import { LoaderCircle } from "lucide-react"

import { nodeRegistry, type NodeType } from "@/features/workflows/nodes/node-registry"
import { cn } from "@/lib/utils"

export function NodeIcon({
  type,
  className,
  running,
  completed,
  failed,
}: {
  type?: NodeType | string | null
  className?: string
  running?: boolean
  completed?: boolean
  failed?: boolean
}) {
  const def = type ? nodeRegistry[type as NodeType] : undefined
  const Icon = def?.icon
  const accent = failed
    ? "bg-destructive/15 text-destructive"
    : completed
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : def?.accent ?? "bg-muted text-muted-foreground"

  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md transition-transform duration-300 group-hover/item:scale-[1.03]",
        accent,
        running && "workflow-pulse",
        className,
      )}
    >
      {running ? (
        <LoaderCircle className="size-3.5 animate-spin" />
      ) : Icon ? (
        <Icon className="size-3.5" />
      ) : (
        <span className="size-2 rounded-full bg-current" />
      )}
    </span>
  )
}
