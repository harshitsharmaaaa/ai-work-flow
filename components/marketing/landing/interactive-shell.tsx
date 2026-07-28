"use client"

import { useMemo, useState, type CSSProperties } from "react"

import { ExecutionCanvas } from "./execution-canvas"
import { usePrefersReducedMotion } from "./hooks"

export function InteractiveShell({ phase }: { phase: number }) {
  const reducedMotion = usePrefersReducedMotion()
  const [spotlight, setSpotlight] = useState({ x: 50, y: 35 })

  const style = useMemo(
    () =>
      ({
        "--spotlight-x": `${spotlight.x}%`,
        "--spotlight-y": `${spotlight.y}%`,
      }) as CSSProperties,
    [spotlight],
  )

  return (
    <section
      className="relative"
      style={style}
      onPointerMove={
        reducedMotion
          ? undefined
          : (event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              setSpotlight({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              })
            }
      }
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_var(--spotlight-x)_var(--spotlight-y),rgba(255,255,255,0.13),transparent_34%)]" />
      <ExecutionCanvas phase={phase} />
    </section>
  )
}
