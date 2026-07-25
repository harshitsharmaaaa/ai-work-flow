function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(/[.[\]]+/).filter(Boolean)
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

const PLACEHOLDER_RE = /\{\{\s*([^}\s]+(?:\.[^}\s]+)*)\s*\}\}/g

export function interpolate(
  text: string,
  nodeOutputs: Record<string, unknown>,
): string {
  return text.replace(PLACEHOLDER_RE, (_, raw) => {
    const value = getByPath(nodeOutputs, raw.trim())
    if (value == null) return ""
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  })
}
