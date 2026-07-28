import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative mx-auto w-full max-w-[118rem] px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[radial-gradient(circle_at_18%_20%,rgba(125,211,252,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] p-6 backdrop-blur-xl sm:p-8 lg:p-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/38">Ready when you are</div>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.07em] text-white sm:text-6xl">
              Ship your first agent workflow in minutes, not weeks.
            </h2>
          </div>
          <Button size="lg" className="h-12 rounded-xl bg-white px-5 text-black hover:bg-white/90" render={<Link href="/sign-up" />}>
            Enter the workflow OS
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
