import { Browserbase } from "@browserbasehq/sdk"
import { auth } from "@clerk/nextjs/server"

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { orgId } = await auth()
  if (!orgId) {
    return Response.json({ error: "Organization access required" }, { status: 403 })
  }

  const { sessionId } = await params

  try {
    const meta = await bb.sessions.replays.retrieve(sessionId)
    const firstPage = meta.pages[0]

    if (!firstPage) {
      return Response.json({ status: "pending" }, { status: 202 })
    }

    const playlist = await bb.sessions.replays.retrievePage(sessionId, firstPage.pageId)
    return new Response(await playlist.text(), {
      headers: {
        "content-type": "application/vnd.apple.mpegurl",
        "cache-control": "no-store",
      },
    })
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error
      ? Number((error as { status?: number }).status)
      : 500

    if (status === 409 || status === 404) {
      return Response.json({ status: "pending" }, { status: 202 })
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Replay error" },
      { status: status >= 400 ? status : 500 },
    )
  }
}
