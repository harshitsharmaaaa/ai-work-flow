import { PricingTable } from "@clerk/nextjs"

export default function PricingPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Upgrade your organization to Pro to unlock premium workflow features.
        </p>
      </div>
      <PricingTable for="organization" />
    </div>
  )
}
