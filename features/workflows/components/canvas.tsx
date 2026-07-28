"use client"

import { useTheme } from "next-themes"
import { useMemo } from "react"
import { useMounted } from "@/hooks/use-mounted"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ConnectionLineType,
  NodeTypes,
  Panel,
  type Edge,
} from "@xyflow/react"
import {AvatarStack} from "@liveblocks/react-ui"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import {StepNode} from "./step-node"
import type {StepNodeType} from "../../workflows/nodes/node-registry"
import { useLatestRunSteps } from "@/features/workflows/components/workflow-runs-provider"

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
  const { isLive } = useLatestRunSteps()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useLiveblocksFlow({
      nodes: { initial: initialNodes },
      edges: { initial: initialEdges },
    })

  const decoratedEdges = useMemo(
    () =>
      (edges ?? []).map((edge) => ({
        ...edge,
        animated: isLive || edge.animated,
        className: isLive ? "workflow-edge-running" : edge.className,
      })),
    [edges, isLive],
  )

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes ?? undefined}
      edges={decoratedEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode={!mounted || resolvedTheme !== "dark" ? "light" : "dark"}
      fitView
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionLineStyle={{ stroke: "var(--primary)" }}
      defaultEdgeOptions={{
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "var(--border)",
          strokeWidth: 2,
          filter: "drop-shadow(0 0 8px color-mix(in oklch, var(--primary), transparent 65%))",
        },
      }}
      style={
        {
          "--xy-background-color": "transparent",
          "--xy-edge-stroke-width": 2,
          "--xy-connectionline-stroke-width": 2,
          "--xy-controls-button-background-color": "var(--background)",
          "--xy-controls-button-background-color-hover": "var(--muted)",
          "--xy-controls-button-color": "var(--foreground)",
        } as React.CSSProperties
      }
      maxZoom={1}
    >
      <Background variant={BackgroundVariant.Dots} gap={36} size={1.2} color="var(--border)" />
      <Controls showInteractive={false} />
      <MiniMap pannable zoomable nodeColor={() => "color-mix(in oklch, var(--primary), transparent 42%)"} />
      <Cursors />
      <Panel position="top-left" className="pointer-events-none">
        <div className="workflow-soft-breathe pointer-events-auto rounded-full border border-border/80 bg-background/75 px-3 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={isLive ? "workflow-pulse size-2 rounded-full bg-emerald-500" : "size-2 rounded-full bg-muted-foreground/50"} />
            {isLive ? "Execution live" : "Canvas idle"}
          </div>
        </div>
      </Panel>
      <Panel position="top-right">
        <div className="rounded-full border border-border/80 bg-background/75 p-1.5 shadow-lg shadow-black/5 backdrop-blur-md">
          <AvatarStack />
        </div>
      </Panel>
    </ReactFlow>
  )
}
