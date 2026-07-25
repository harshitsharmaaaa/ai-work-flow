"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"

type ReplayState = "loading" | "ready" | "error"

async function waitForPlaylist(sessionId: string, signal: AbortSignal) {
  while (!signal.aborted) {
    const response = await fetch(`/api/replays/${sessionId}`, {
      credentials: "include",
    })

    if (response.ok && response.headers.get("content-type")?.includes("mpegurl")) {
      return await response.text()
    }

    if (response.status !== 202) {
      const body = await response.text()
      throw new Error(body || "Replay request failed")
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  throw new Error("Replay request aborted")
}

export function SessionReplay({ sessionId }: { sessionId: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [state, setState] = useState<ReplayState>("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const video = videoRef.current
    let objectUrl: string | null = null

    async function loadReplay() {
      try {
        const playlist = await waitForPlaylist(sessionId, controller.signal)
        if (controller.signal.aborted || !video) return

        setState("ready")

        if (Hls.isSupported()) {
          const hls = new Hls()
          hlsRef.current = hls
          objectUrl = URL.createObjectURL(
            new Blob([playlist], { type: "application/vnd.apple.mpegurl" }),
          )
          hls.loadSource(objectUrl)
          hls.attachMedia(video)
          return
        }

        video.src = `/api/replays/${sessionId}`
      } catch (error) {
        if (controller.signal.aborted) return
        setState("error")
        setError(error instanceof Error ? error.message : "Replay unavailable")
      }
    }

    void loadReplay()

    return () => {
      controller.abort()
      hlsRef.current?.destroy()
      hlsRef.current = null
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [sessionId])

  if (state === "error") {
    return <p className="text-sm text-muted-foreground">{error}</p>
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Session Replay</div>
          <div className="text-xs text-muted-foreground">
            {state === "loading" ? "Preparing recording…" : sessionId}
          </div>
        </div>
      </div>
      <video
        ref={videoRef}
        controls
        muted
        autoPlay
        playsInline
        className="min-h-0 w-full flex-1 rounded-md border border-border bg-black"
      />
    </div>
  )
}
