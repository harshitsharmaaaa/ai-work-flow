import Link from "next/link"
import { ArrowRight, TerminalSquare } from "lucide-react"

import { Button } from "@/components/ui/button"

import { transcript } from "./constants"

export function AuditConsole() {
  return (
    <section className="relative mx-auto w-full max-w-[118rem] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.045] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/38">
            <TerminalSquare className="size-4" aria-hidden="true" /> Decision audit
          </div>
          <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.065em] text-white sm:text-5xl">
            When the agent pauses, the interface explains why.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/54 sm:text-base">
            Every automated action exposes context, risk, output, and the next safe control — so operators can approve
            with confidence instead of guessing.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["82%", "policy confidence"],
              ["1", "human gate"],
              ["4", "replay anchors"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                <div className="text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[32rem] p-4 sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(216,180,254,0.14),transparent_28%)]" />
          <div className="relative h-full rounded-[1.55rem] border border-white/10 bg-[#050817]/78 p-4 shadow-2xl shadow-black/30 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-sm font-semibold text-white">Customer reply workflow</div>
                <div className="text-xs text-white/38">Run timeline, model notes, and approval state</div>
              </div>
              <div className="rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-xs text-amber-100/80">
                Awaiting approval
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {transcript.map((item, index) => (
                <div key={`${item.speaker}-${item.text}`} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-medium uppercase tracking-[0.22em] text-white/36">{item.speaker}</div>
                    <div className="text-[11px] text-white/28">00:{(index * 7 + 12).toString().padStart(2, "0")}</div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/68">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border border-white/10 bg-black/24 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-white/34">Recommended action</div>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Approve the draft after confirming refund eligibility against invoice #INV-2048.
                </p>
              </div>
              <Button className="h-full min-h-14 bg-white text-black hover:bg-white/90" render={<Link href="/sign-up" />}>
                Build this flow
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
