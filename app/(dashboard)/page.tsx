import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createWorkflowAction } from "@/features/workflows/actions"
import { EmptyWorkflows } from "@/features/workflows/components/empty-workflows"

export default async function Page() {
  const { orgId } = await auth()

  if (!orgId) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create or select an organization
            </h1>
            <p className="text-sm text-muted-foreground">
              You need an organization before you can create workflows or view pricing.
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Open the organization chooser.</li>
              <li>Create a new organization or select an existing one.</li>
              <li>Come back here to create workflows and manage your plan.</li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/session-tasks/choose-organization"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                Create or choose organization
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <EmptyWorkflows createWorkflow={createWorkflowAction} />
}
