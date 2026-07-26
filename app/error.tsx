"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong.</h2>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}

