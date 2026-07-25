"use client"

import { createContext, useContext, useMemo } from "react"
import { useRealtimeRunsWithTag } from "@trigger.dev/react-hooks"
import type { RunStep, runworkflowTask } from "@/features/workflows/tasks/run-workflow"

type WorkflowRun = {
  id: string
  status: string
  output?: RunStep[]
  steps: RunStep[]
}

type WorkflowRunsContextValue = {
  runs: WorkflowRun[]
  steps: RunStep[]
  isLive: boolean
}

const WorkflowRunsContext = createContext<WorkflowRunsContextValue>({
  runs: [],
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
    const mappedRuns: WorkflowRun[] =
      runs?.map((run) => {
        const steps =
          (run.output as RunStep[] | undefined) ??
          (run.metadata?.steps as RunStep[] | undefined) ??
          []

        return {
          id: run.id,
          status: run.status,
          output: run.output as RunStep[] | undefined,
          steps,
        }
      }) ?? []

    const latest = mappedRuns[mappedRuns.length - 1]
    const latestSteps = latest?.steps ?? []
    const isLive =
      latest?.status === "QUEUED" || latest?.status === "EXECUTING"

    return { runs: mappedRuns, steps: latestSteps, isLive }
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
