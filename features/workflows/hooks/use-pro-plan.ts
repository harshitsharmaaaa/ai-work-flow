"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export function useProPlan() {
  const router = useRouter()
  const { has, isLoaded } = useAuth()

  const isPro = Boolean(isLoaded && has?.({ plan: "pro" }))

  const upgrade = useCallback(() => {
    router.push("/pricing")
  }, [router])

  return {
    isLoaded,
    isPro,
    upgrade,
  }
}
