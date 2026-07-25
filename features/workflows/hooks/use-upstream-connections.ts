import { useMemo } from "react"
import { getIncomers, useEdges, useNodes, type Node } from "@xyflow/react"
import { nodeRegistry, type NodeType, type StepNodeData } from "@/features/workflows/nodes/node-registry"

export type UpstreamOutput = {
  token: string
  label: string
  sourceType: NodeType
}

function collectUpstream(
  nodeId: string,
  allNodes: Node[],
  allEdges: ReturnType<typeof useEdges>,
  visited: Set<string> = new Set(),
): UpstreamOutput[] {
  const node = allNodes.find((n) => n.id === nodeId)
  if (!node) return []

  const incomers = getIncomers(node, allNodes, allEdges)
  const result: UpstreamOutput[] = []

  for (const incomer of incomers) {
    if (visited.has(incomer.id)) continue
    visited.add(incomer.id)

    const data = incomer.data as StepNodeData
    const def = nodeRegistry[data.type]
    if (def) {
      for (const output of def.outputs) {
        result.push({
          token: `{{ ${incomer.id}.${output.path} }}`,
          label: `${data.title} · ${output.label}`,
          sourceType: data.type,
        })
      }
    }

    result.push(...collectUpstream(incomer.id, allNodes, allEdges, visited))
  }

  return result
}

export function useUpstreamConnections(nodeId: string | null): UpstreamOutput[] {
  const nodes = useNodes()
  const edges = useEdges()

  return useMemo(() => {
    if (!nodeId) return []
    const visited = new Set<string>()
    return collectUpstream(nodeId, nodes, edges, visited)
  }, [nodeId, nodes, edges])
}
