import type { Stagehand } from "@browserbasehq/stagehand"

export async function observePage({
  stagehand,
  instruction,
}: {
  stagehand: Stagehand
  instruction: string
}) {
  const matches = await stagehand.observe(instruction)

  return {
    matches: matches.map((action) => ({
      selector: action.selector,
      description: action.description,
    })),
  }
}
