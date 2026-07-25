"use client"

import { LoaderCircle } from "lucide-react"

import { nodeRegistry, type NodeType } from "@/features/workflows/nodes/node-registry"
import { cn } from "@/lib/utils"

export function NodeIcon({
  type,
  className,
  running,
}: {
  type?: NodeType | string | null
  className?: string
  running?: boolean
}) {
  const def = type ? nodeRegistry[type as NodeType] : undefined
  const Icon = def?.icon
  const accent = def?.accent ?? "bg-muted text-muted-foreground"

  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-md",
        accent,
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
