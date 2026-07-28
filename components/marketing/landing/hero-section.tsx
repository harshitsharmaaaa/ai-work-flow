import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { InteractiveShell } from "./interactive-shell"

export function HeroSection({ phase }: { phase: number }) {
  return (
    <div id="simulation" className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.84fr_1.16fr] lg:py-16 xl:gap-14">
      <div className="max-w-4xl">
        <div className="mb-7 flex flex-wrap gap-2">
          {["Live execution", "Browser agents", "Human gates"].map((item) => (
            <Badge key={item} variant="outline" className="border-white/10 bg-white/[0.04] px-3 py-1.5 text-white/62">
              {item}
            </Badge>
          ))}
        </div>

        <h1 className="text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.08em] text-white sm:text-6xl lg:text-[6.4rem] lg:leading-[0.88]">
          Don&apos;t explain AI workflows. Let people operate one.
        </h1>

        <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/56 sm:text-xl">
          A pre-auth command center for designing, running, replaying, and approving agentic automation across browser
          actions, durable tasks, realtime state, data, and email.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            className="h-12 rounded-xl bg-white px-5 text-black hover:bg-white/90"
            render={<Link href="/sign-up" />}
          >
            Start building
            <Sparkles className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white/10 bg-white/[0.04] px-5 text-white hover:bg-white/[0.08]"
            render={<Link href="/dashboard" />}
          >
            Open workspace
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
          {[
            ["5", "node types"],
            ["live", "run metadata"],
            ["replay", "browser proof"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
              <div className="text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <InteractiveShell phase={phase} />
    </div>
  )
}
