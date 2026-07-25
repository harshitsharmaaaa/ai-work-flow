"use client"

import { useMemo } from "react"

import { useLatestRunSteps } from "@/features/workflows/components/workflow-runs-provider"
import { NodeIcon } from "@/features/workflows/components/node-icon"
import { SessionReplay } from "@/features/workflows/components/session-replay"
import { nodeRegistry, type NodeType } from "@/features/workflows/nodes/node-registry"
import { cn } from "@/lib/utils"
import type { ConsoleSelection } from "@/features/workflows/components/logs-panel"

function asText(value: unknown): string | null {
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return null
}

function firstLine(value: string) {
  return value.split("\n").find(Boolean)?.trim() ?? value.trim()
}

function summarizeOutput(nodeType: NodeType, output: unknown): string {
  const def = nodeRegistry[nodeType]

  if (output == null) {
    return `${def.label} did not produce any output.`
  }

  if (nodeType === "start") {
    return "The workflow started successfully."
  }

  if (nodeType === "open-url" && typeof output === "object" && output) {
    const data = output as { url?: unknown; title?: unknown }
    const url = asText(data.url)
    const title = asText(data.title)
    if (url && title) return `Opened the page "${title}".`
    if (url) return `Opened the page ${url}.`
    return "Opened a web page."
  }

  if (nodeType === "act" && typeof output === "object" && output) {
    const data = output as { success?: unknown; message?: unknown; url?: unknown }
    const message = asText(data.message)
    const url = asText(data.url)
    if (message && url) return `${firstLine(message)} The page is now open.`
    if (message) return firstLine(message)
    return "The action finished."
  }

  if (nodeType === "extract" && typeof output === "object" && output) {
    const data = output as { result?: unknown }
    const result = asText(data.result)
    if (result) {
      return result.length > 180
        ? `${result.slice(0, 177).trimEnd()}...`
        : result
    }
    return "It read the page and pulled out the important information."
  }

  if (nodeType === "observe" && typeof output === "object" && output) {
    const data = output as { matches?: unknown[] }
    const count = Array.isArray(data.matches) ? data.matches.length : 0
    return count === 0
      ? "It looked for the next thing to do, but didn't find a clear match."
      : `It found ${count} possible next step${count === 1 ? "" : "s"} on the page.`
  }

  if (nodeType === "agent" && typeof output === "object" && output) {
    const data = output as { message?: unknown; completed?: unknown }
    const message = asText(data.message)
    if (message) return firstLine(message)
    if (data.completed === true) return "The assistant finished its task."
    return "The assistant finished its task."
  }

  if (nodeType === "send-email" && typeof output === "object" && output) {
    const data = output as { id?: unknown }
    const id = asText(data.id)
    if (id) return `The email was sent successfully.`
    return "Sent the email successfully."
  }

  if (typeof output === "object" && output) {
    return `The ${def.label.toLowerCase()} node finished successfully.`
  }

  return asText(output) ?? "This step finished successfully."
}

function outputDetails(output: unknown) {
  if (output == null) {
    return "No output was produced."
  }

  if (typeof output === "string") {
    return output
  }

  return JSON.stringify(output, null, 2)
}

export function InspectorPanel({ selected }: { selected: ConsoleSelection }) {
  const { runs } = useLatestRunSteps()

  const selection = useMemo(() => {
    if (!selected || selected.kind !== "step") return undefined
    const run = runs.find((item) => item.id === selected.runId)
    return run?.steps.find((item) => item.nodeId === selected.nodeId)
  }, [runs, selected])

  const replayRun = useMemo(() => {
    if (!selected || selected.kind !== "replay") return undefined
    return runs.find((item) => item.id === selected.runId)
  }, [runs, selected])

  if (selected?.kind === "replay") {
    return (
      <div className="flex h-full min-h-0 flex-col border-l border-border bg-background p-3">
        {replayRun?.sessionId ? (
          <SessionReplay sessionId={replayRun.sessionId} />
        ) : (
          <p className="text-sm text-muted-foreground">Replay unavailable for this run.</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border px-3 py-2 text-sm font-semibold">Output</div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!selected ? (
          <p className="text-sm text-muted-foreground">Select a step to inspect its output.</p>
        ) : !selection ? (
          <p className="text-sm text-muted-foreground">Selected step is no longer available.</p>
        ) : selection.status === "failed" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <NodeIcon type={selection.nodeType} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{selection.title}</div>
                <div className="text-xs text-destructive">Failed</div>
              </div>
            </div>
            <pre className="whitespace-pre-wrap rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
              {selection.error ?? "Step failed without an error message."}
            </pre>
          </div>
        ) : selection.output == null ? (
          <p className="text-sm text-muted-foreground">This step produced no output.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <NodeIcon type={selection.nodeType} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{selection.title}</div>
                <div className={cn("text-xs text-muted-foreground")}>Completed</div>
              </div>
            </div>
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-sm leading-6">{summarizeOutput(selection.nodeType, selection.output)}</p>
            </div>
            <details className="rounded-md border border-border bg-background p-3">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                Technical details
              </summary>
              <pre className="mt-2 overflow-x-auto text-xs">
                {outputDetails(selection.output)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}
