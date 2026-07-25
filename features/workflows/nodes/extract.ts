import type { Stagehand } from "@browserbasehq/stagehand"

export async function extractFromPage({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const result = await stagehand.extract(instruction)

  return {
    result: result.extraction,
  }
}
