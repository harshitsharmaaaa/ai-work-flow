import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="relative mx-auto w-full max-w-[118rem] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
        <p className="text-sm text-white/38">AI Workflow OS — agent automation with observability built in.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-sm text-white/45">
          <Link href="/sign-in" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/50">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/50">
            Sign up
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/50">
            Pricing
          </Link>
        </nav>
      </div>
    </footer>
  )
}
