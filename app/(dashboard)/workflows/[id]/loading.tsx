import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <Spinner className="size-6" />
    </div>
  )
}
