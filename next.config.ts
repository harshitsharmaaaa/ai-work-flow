import * as Sentry from "@sentry/nextjs"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
}

export default Sentry.withSentryConfig(nextConfig, {
  org: "enzo-ax",
  project: "ai-work-flow",
  silent: true,
})
