"use client"

import { useTheme } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  NodeTypes,
  Panel,
  type Edge,
} from "@xyflow/react"
import {AvatarStack} from "@Liveblocks/react-ui"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import {StepNode} from "./step-node"
import type {StepNodeType} from "../../workflows/nodes/node-registry"

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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow({
      nodes: { initial: initialNodes },
      edges: { initial: initialEdges },
    })

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes ?? undefined}
      edges={edges ?? undefined}
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
      <Cursors />
      <Panel position="top-right">
        <AvatarStack />
      </Panel>
    </ReactFlow>
  )
}
