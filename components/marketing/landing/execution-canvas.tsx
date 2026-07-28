"use client"

import { CheckCircle2, PauseCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { consoleEvents, signalCards, workflowSteps } from "./constants"

function RunNode({
  node,
  index,
  phase,
}: {
  node: (typeof workflowSteps)[number]
  index: number
  phase: number
}) {
  const Icon = node.icon
  const complete = index < phase
  const active = index === phase

  return (
    <div
      className="absolute z-10 w-[9.25rem] -translate-x-1/2 -translate-y-1/2 sm:w-[10.25rem]"
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border bg-white/[0.055] p-3 shadow-[0_22px_80px_-48px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-500 will-change-transform",
          active ? "-translate-y-1 border-white/35 bg-white/[0.10]" : "border-white/12",
          complete && "border-emerald-200/25",
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.14),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {active && <div className="operating-node-ring absolute inset-0 rounded-2xl" />}
        <div className="relative flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-xl bg-gradient-to-br text-slate-950 shadow-lg",
              node.accent,
            )}
          >
            {complete ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-[-0.02em] text-white">{node.label}</div>
            <div className="truncate text-[11px] text-white/45">{node.detail}</div>
          </div>
        </div>
        <div className="relative mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/35">
          <span>{active ? "Executing" : complete ? "Synced" : "Queued"}</span>
          <span
            className={cn(
              "size-1.5 rounded-full",
              active
                ? "bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,0.95)]"
                : complete
                  ? "bg-emerald-200"
                  : "bg-white/25",
            )}
          />
        </div>
      </div>
    </div>
  )
}

function MobileRunTimeline({ phase }: { phase: number }) {
  return (
    <div className="space-y-2 md:hidden" aria-label="Workflow execution timeline">
      {workflowSteps.map((node, index) => {
        const Icon = node.icon
        const complete = index < phase
        const active = index === phase

        return (
          <div
            key={node.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-500",
              active
                ? "border-cyan-400/25 bg-cyan-400/10"
                : complete
                  ? "border-emerald-200/20 bg-white/[0.04]"
                  : "border-white/10 bg-white/[0.03]",
            )}
          >
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-slate-950",
                node.accent,
              )}
            >
              {complete ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{node.label}</div>
              <div className="text-xs text-white/45">{node.detail}</div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              {active ? "Running" : complete ? "Done" : "Wait"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ExecutionCanvas({ phase }: { phase: number }) {
  return (
    <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[#050817]/86 shadow-[0_40px_160px_-70px_rgba(23,37,84,0.95)] backdrop-blur-2xl md:min-h-[38rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(125,211,252,0.16),transparent_32%),radial-gradient(circle_at_80%_28%,rgba(216,180,254,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_26%)]" />
      <div className="absolute inset-4 rounded-[1.55rem] border border-white/[0.075]" />
      <div className="operating-scan absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-200/12 to-transparent" />

      <div className="relative z-20 flex items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-cyan-100/55">
            <span className="operating-pulse size-2 rounded-full bg-cyan-200" />
            Live run
          </div>
          <h2 className="mt-3 max-w-sm text-2xl font-semibold tracking-[-0.055em] text-white sm:text-3xl">
            Watch the workflow move from trigger to action.
          </h2>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-white/60 sm:block">
          replay_session_8f4a
        </div>
      </div>

      <div className="relative z-10 px-5 pb-4 md:hidden">
        <MobileRunTimeline phase={phase} />
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="execution-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(125,211,252,0.05)" />
            <stop offset="45%" stopColor="rgba(216,180,254,0.55)" />
            <stop offset="100%" stopColor="rgba(110,231,183,0.08)" />
          </linearGradient>
        </defs>
        <path
          className="operating-dash"
          d="M 15 51 C 23 44, 21 25, 28 24 S 43 41, 51 43 S 61 20, 70 20 S 78 48, 84 55"
          fill="none"
          stroke="url(#execution-line)"
          strokeWidth="0.45"
          strokeLinecap="round"
        />
        <path
          d="M 15 51 C 23 44, 21 25, 28 24 S 43 41, 51 43 S 61 20, 70 20 S 78 48, 84 55"
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="0.12"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-x-4 bottom-[9.5rem] top-28 hidden md:block sm:bottom-32">
        {workflowSteps.map((node, index) => (
          <RunNode key={node.id} node={node} index={index} phase={phase} />
        ))}
      </div>

      <div className="relative z-20 grid gap-3 px-4 pb-4 sm:px-5 sm:pb-5 md:absolute md:inset-x-4 md:bottom-4 md:grid-cols-[0.95fr_1.05fr] md:px-0 md:pb-0">
        <div className="rounded-2xl border border-white/10 bg-black/24 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs uppercase tracking-[0.26em] text-white/38">Execution log</div>
            <PauseCircle className="size-4 text-white/35" aria-hidden="true" />
          </div>
          <div aria-live="polite" aria-atomic="false" className="mt-3 space-y-2">
            {consoleEvents.slice(0, phase + 1).map((event, index) => (
              <div key={event} className="flex items-start gap-2 text-xs leading-5 text-white/62">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    index === phase ? "bg-cyan-200" : "bg-white/30",
                  )}
                />
                <span>{event}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {signalCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/35">{card.label}</div>
              <div className={cn("mt-2 text-lg font-semibold tracking-[-0.04em] sm:text-2xl", card.tone)}>
                {card.value}
              </div>
              <div className="mt-1 text-[11px] text-white/35">{card.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
