"use client"

import { createContext, useContext, useMemo } from "react"
import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"
import type { RunStep, runworkflowTask } from "@/features/workflows/tasks/run-workflow"

type WorkflowRunsContextValue = {
  steps: RunStep[]
  isLive: boolean
}

const WorkflowRunsContext = createContext<WorkflowRunsContextValue>({
  steps: [],
  isLive: false,
})

export function WorkflowRunsProvider({
  workflowId,
  accessToken,
  children,
}: {
  workflowId: string
  accessToken: string
  children: React.ReactNode
}) {
  const { runs } = useRealtimeRunsWithTag<typeof runworkflowTask>(
    `workflow:${workflowId}`,
    { accessToken },
  )

  const value = useMemo(() => {
    const latest = runs ? runs[runs.length - 1] : undefined
    if (!latest) return { steps: [], isLive: false }

    const isLive =
      latest.status === "QUEUED" || latest.status === "EXECUTING"

    const steps: RunStep[] =
      (latest.output as RunStep[] | undefined) ??
      (latest.metadata?.steps as RunStep[] | undefined) ??
      []

    return { steps, isLive }
  }, [runs])

  return (
    <WorkflowRunsContext.Provider value={value}>
      {children}
    </WorkflowRunsContext.Provider>
  )
}

export function useLatestRunSteps(): WorkflowRunsContextValue {
  return useContext(WorkflowRunsContext)
}
