import {
  Bot,
  BrainCircuit,
  Database,
  Eye,
  Fingerprint,
  GitBranch,
  Globe,
  Mail,
  MousePointerClick,
  Play,
  Radar,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react"

export type WorkflowStep = {
  id: string
  label: string
  detail: string
  icon: LucideIcon
  x: number
  y: number
  accent: string
}

export type SignalCard = {
  label: string
  value: string
  delta: string
  tone: string
}

export type OperatingLayer = {
  title: string
  description: string
  icon: LucideIcon
}

export type Integration = {
  name: string
  role: string
  icon: LucideIcon
}

export type TranscriptLine = {
  speaker: string
  text: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: "trigger",
    label: "Watch source",
    detail: "New customer email",
    icon: Mail,
    x: 9,
    y: 51,
    accent: "from-sky-300 to-cyan-200",
  },
  {
    id: "observe",
    label: "Observe",
    detail: "Read context + replay",
    icon: Eye,
    x: 28,
    y: 24,
    accent: "from-cyan-200 to-blue-300",
  },
  {
    id: "agent",
    label: "Reason",
    detail: "Choose safest branch",
    icon: BrainCircuit,
    x: 51,
    y: 43,
    accent: "from-violet-200 to-fuchsia-300",
  },
  {
    id: "approval",
    label: "Approval",
    detail: "Pause if risk rises",
    icon: ShieldCheck,
    x: 70,
    y: 20,
    accent: "from-amber-200 to-orange-300",
  },
  {
    id: "dispatch",
    label: "Act + send",
    detail: "Update CRM, reply",
    icon: Zap,
    x: 84,
    y: 55,
    accent: "from-emerald-200 to-lime-300",
  },
]

export const signalCards: SignalCard[] = [
  { label: "Run health", value: "99.98%", delta: "+4.2", tone: "text-emerald-200" },
  { label: "Median step", value: "410 ms", delta: "live", tone: "text-cyan-200" },
  { label: "Tokens saved", value: "38%", delta: "context", tone: "text-violet-200" },
]

export const consoleEvents = [
  "Loaded org memory and recent run history",
  "Browser replay attached to execution timeline",
  "Agent selected escalation-safe branch",
  "Approval gate armed for policy variance",
  "Email draft prepared with source citations",
]

export const operatingLayers: OperatingLayer[] = [
  {
    title: "Intent becomes a graph",
    description:
      "Triggers, browser actions, agents, and email steps stay inspectable instead of disappearing into a black box.",
    icon: Workflow,
  },
  {
    title: "AI runs with guardrails",
    description:
      "The system streams state, confidence, retries, and human pauses while the workflow is still alive.",
    icon: Fingerprint,
  },
  {
    title: "Every outcome is replayable",
    description:
      "Browser sessions, tool output, and step logs remain attached to the run for debugging and trust.",
    icon: Radar,
  },
]

export const integrations: Integration[] = [
  { name: "Browserbase", role: "web control", icon: Globe },
  { name: "Trigger.dev", role: "durable runs", icon: Play },
  { name: "Liveblocks", role: "multiplayer canvas", icon: MousePointerClick },
  { name: "Clerk", role: "teams + auth", icon: ShieldCheck },
  { name: "Neon", role: "branching data", icon: Database },
  { name: "Resend", role: "email actions", icon: Mail },
  { name: "GitHub", role: "code events", icon: GitBranch },
  { name: "AI agents", role: "reasoning layer", icon: Bot },
]

export const transcript: TranscriptLine[] = [
  { speaker: "Trigger", text: "Run queued with idempotent payload." },
  { speaker: "Agent", text: "I found a refund request, but policy confidence is 82%." },
  { speaker: "Gate", text: "Human review required before sending customer email." },
  { speaker: "Operator", text: "Approved. Keep the explanation short and cite the invoice." },
]

export const navItems = ["Simulation", "Integrations", "Audit"] as const
