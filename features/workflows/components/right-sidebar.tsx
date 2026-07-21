"use client"

import { useState } from "react"
import { PlayIcon } from "lucide-react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { Button } from "@/components/ui/button"
import { runWorkflowAction } from "@/features/workflows/actions"
import type { helloWorld } from "@/trigger/example"

type RunInfo = {
  runId: string
  publicAccessToken: string
}

export function RightSidebar({ workflowId }: { workflowId: string }) {
  const [runInfo, setRunInfo] = useState<RunInfo | null>(null)
  const [isPending, setIsPending] = useState(false)

  const { run, error } = useRealtimeRun<typeof helloWorld>(
    runInfo?.runId,
    { accessToken: runInfo?.publicAccessToken, enabled: !!runInfo }
  )

  async function handleRun() {
    setIsPending(true)
    try {
      const info = await runWorkflowAction(workflowId)
      setRunInfo(info)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto p-4">
      <Button onClick={handleRun} disabled={isPending} className="w-full">
        <PlayIcon />
        Run
      </Button>

      {error && (
        <p className="text-sm text-destructive">Error: {error.message}</p>
      )}

      {run && (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{run.status}</span>
          </div>
          {run.output && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Output</span>
              <pre className="overflow-auto rounded-md bg-muted p-2 text-xs">
                {JSON.stringify(run.output, null, 2)}
              </pre>
            </div>
          )}
          {run.error && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Error</span>
              <pre className="overflow-auto rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                {JSON.stringify(run.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
