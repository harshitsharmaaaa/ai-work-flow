import Link from "next/link"
import { ArrowRight, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"

import { navItems } from "./constants"

export function LandingHeader() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.045] px-3 py-3 shadow-[0_20px_80px_-60px_rgba(125,211,252,0.7)] backdrop-blur-2xl sm:px-4">
      <Link
        href="/"
        aria-label="AI Workflow OS home"
        className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60"
      >
        <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-[0_0_40px_rgba(255,255,255,0.18)]">
          <Workflow className="size-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-[0.18em] text-white/82">AI WORKFLOW OS</div>
          <div className="hidden text-xs text-white/34 sm:block">Agent automation that stays observable</div>
        </div>
      </Link>

      <nav aria-label="Landing page navigation" className="hidden items-center gap-1 text-sm text-white/50 md:flex">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="rounded-full px-3 py-2 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/50"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="hidden border border-white/10 bg-white/[0.035] text-white hover:bg-white/[0.08] sm:inline-flex"
          render={<Link href="/sign-in" />}
        >
          Sign in
        </Button>
        <Button className="bg-white text-black hover:bg-white/90" render={<Link href="/dashboard" />}>
          Enter OS
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </header>
  )
}
