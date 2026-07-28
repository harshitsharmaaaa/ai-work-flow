import { Badge } from "@/components/ui/badge"

import { integrations } from "./constants"

export function IntegrationMatrix() {
  return (
    <section className="relative mx-auto grid w-full max-w-[118rem] gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-8">
        <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-white/62">
          Built for real operations
        </Badge>
        <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.065em] text-white sm:text-5xl">
          One canvas for the whole stack.
        </h2>
        <p className="mt-5 max-w-lg text-sm leading-7 text-white/54 sm:text-base">
          Browser automation, durable background jobs, multiplayer editing, auth, Postgres, and email actions all show
          up where the run happens — not buried in separate admin panels.
        </p>
        <div className="mt-8 rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.045] p-4 text-sm leading-7 text-cyan-50/70">
          Connect a trigger, attach an agent, pause for approval, and replay the browser session — without leaving the
          workflow view.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {integrations.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.name}
              className="operating-float rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.08]"
              style={{ animationDelay: `${index * -0.55}s` }}
            >
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.08] text-white/78">
                <Icon className="size-4" />
              </div>
              <div className="mt-5 text-sm font-semibold tracking-[-0.02em] text-white">{item.name}</div>
              <div className="mt-1 text-xs text-white/38">{item.role}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
