import { ChevronRight } from "lucide-react"

import { operatingLayers } from "./constants"

export function StoryPanel() {
  return (
    <section className="relative mx-auto grid w-full max-w-[118rem] gap-4 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
      {operatingLayers.map((item) => {
        const Icon = item.icon
        return (
          <article
            key={item.title}
            className="group rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.07] sm:p-6"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.04em] text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/52">{item.description}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/40 transition-colors group-hover:text-white/70">
              Inspect layer <ChevronRight className="size-3.5" aria-hidden="true" />
            </div>
          </article>
        )
      })}
    </section>
  )
}
