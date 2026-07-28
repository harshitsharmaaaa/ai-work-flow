"use client"

import { useEffect, useState } from "react"

import { workflowSteps } from "./constants"

export function useRunPhase(intervalMs = 2100) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPhase((value) => (value + 1) % workflowSteps.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [intervalMs])

  return phase
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reduced
}
