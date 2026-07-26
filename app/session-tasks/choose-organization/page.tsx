import { TaskChooseOrganization } from "@clerk/nextjs"

export default function ChooseOrganizationPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <TaskChooseOrganization redirectUrlComplete="/" />
    </div>
  )
}
