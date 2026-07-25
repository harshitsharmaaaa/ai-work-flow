import type { Stagehand } from "@browserbasehq/stagehand"

export async function actOnPage({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const page = stagehand.context.pages()[0]
  const result = await stagehand.act(instruction)

  return {
    success: result.success,
    message: result.message,
    url: page.url(),
  }
}
