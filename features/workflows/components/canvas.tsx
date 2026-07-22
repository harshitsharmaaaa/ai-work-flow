"use client"

import { useCallback, useState } from "react"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  ConnectionLineType,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react"
import {StepNode} from "./step-node"
import type {StepNodeType} from "./node-registry"

const nodeTypes:NodeTypes={step:StepNode}

const initialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 0, y: 0 },
    data: { type: "start", kind: "trigger", title: "Start", values: {} },
  }
]
const initialEdges: Edge[] = []

export function Canvas() {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((snapshot) => applyNodeChanges(changes, snapshot)),
    []
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((snapshot) => applyEdgeChanges(changes, snapshot)),
    []
  )
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((snapshot) => addEdge(params, snapshot)),
    []
  )

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode={!mounted || resolvedTheme !== "dark" ? "light" : "dark"}
      fitView
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineStyle={{ stroke: "var(--border)" }}
      defaultEdgeOptions={{ 
        type: "smoothstep",
        style: { stroke: "var(--border)" },
      }}
      style={
        {
          "--xy-background-color": "var(-- background)",
          "--xy-edge-stroke-width": 2,
          "--xy-connectionline-stroke-width": 2,
        } as React.CSSProperties
      }
      maxZoom={1}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}
