import Link from "next/link"
import { PricingTable } from "@clerk/nextjs"

export default function PricingPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Upgrade your plan to Pro to unlock premium workflow features. If you do not
          have an organization yet, create or choose one first and then come back here.
        </p>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Need an organization first?</h2>
          <p className="text-sm text-muted-foreground">
            You can create or choose an organization, then return here to buy a plan.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/session-tasks/choose-organization"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Create or choose organization
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
      <PricingTable for="organization" />
    </div>
  )
}
