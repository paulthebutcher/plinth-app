'use client'

import { motion, useReducedMotion } from "framer-motion"
import {
  BarChart3,
  Check,
  FileText,
  Globe,
  Search,
  Sparkles,
  Users,
} from "lucide-react"

type EvidenceNodeData = {
  id: string
  x: number
  y: number
  icon: React.ElementType
  delay: number
}

const center = { x: 400, y: 180 }

const evidenceNodes: EvidenceNodeData[] = [
  { id: "e1", x: 50, y: 80, icon: Search, delay: 0.2 },
  { id: "e2", x: 120, y: 40, icon: FileText, delay: 0.3 },
  { id: "e3", x: 50, y: 200, icon: BarChart3, delay: 0.4 },
  { id: "e4", x: 100, y: 320, icon: Globe, delay: 0.5 },
  { id: "e5", x: 750, y: 60, icon: Users, delay: 0.3 },
  { id: "e6", x: 700, y: 160, icon: FileText, delay: 0.4 },
  { id: "e7", x: 750, y: 280, icon: Search, delay: 0.5 },
  { id: "e8", x: 680, y: 360, icon: BarChart3, delay: 0.6 },
]

const mobileNodes: EvidenceNodeData[] = [
  { id: "m1", x: 120, y: 90, icon: Search, delay: 0.2 },
  { id: "m2", x: 80, y: 250, icon: BarChart3, delay: 0.3 },
  { id: "m3", x: 680, y: 140, icon: FileText, delay: 0.4 },
]

export function HeroDiagram() {
  const prefersReducedMotion = useReducedMotion()
  const reducedMotion = prefersReducedMotion ?? false

  return (
    <div className="w-full">
      <div className="hidden sm:block">
        <Diagram
          nodes={evidenceNodes}
          prefersReducedMotion={reducedMotion}
        />
      </div>
      <div className="sm:hidden">
        <Diagram
          nodes={mobileNodes}
          prefersReducedMotion={reducedMotion}
        />
      </div>
    </div>
  )
}

function Diagram({
  nodes,
  prefersReducedMotion,
}: {
  nodes: EvidenceNodeData[]
  prefersReducedMotion: boolean
}) {
  return (
    <svg
      viewBox="0 0 800 400"
      className="mx-auto w-full max-w-4xl"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background grid (subtle) */}
      <pattern
        id="grid"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-zinc-100"
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Connection paths */}
      {nodes.map((node, index) => (
        <ConnectionPath
          key={`path-${node.id}`}
          from={node}
          to={center}
          delay={0.6 + index * 0.05}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}

      {/* Evidence nodes */}
      {nodes.map((node) => (
        <EvidenceNode
          key={node.id}
          {...node}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}

      {/* Central synthesis node */}
      <SynthesisNode prefersReducedMotion={prefersReducedMotion} />

      {/* Recommendation output */}
      <RecommendationNode prefersReducedMotion={prefersReducedMotion} />
    </svg>
  )
}

function EvidenceNode({
  x,
  y,
  icon: Icon,
  delay,
  prefersReducedMotion,
}: {
  x: number
  y: number
  icon: React.ElementType
  delay: number
  prefersReducedMotion: boolean
}) {
  return (
    <motion.g
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: "easeOut",
      }}
    >
      {/* Outer glow */}
      <circle cx={x} cy={y} r="24" fill="#FFF7ED" />
      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r="20"
        fill="white"
        stroke="#E5E7EB"
        strokeWidth="2"
      />
      {/* Icon */}
      <foreignObject x={x - 10} y={y - 10} width="20" height="20">
        <Icon className="h-5 w-5 text-zinc-400" />
      </foreignObject>
    </motion.g>
  )
}

function ConnectionPath({
  from,
  to,
  delay,
  prefersReducedMotion,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
  delay: number
  prefersReducedMotion: boolean
}) {
  const midX = (from.x + to.x) / 2
  const path = `M ${from.x} ${from.y} Q ${midX} ${from.y} ${to.x} ${to.y}`

  return (
    <motion.path
      d={path}
      fill="none"
      stroke="#E5E7EB"
      strokeWidth="2"
      strokeDasharray="4 4"
      initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        delay: prefersReducedMotion ? 0 : delay,
        duration: prefersReducedMotion ? 0 : 0.8,
        ease: "easeInOut",
      }}
    />
  )
}

function SynthesisNode({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <motion.g
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: prefersReducedMotion ? 0 : 0.8,
        duration: prefersReducedMotion ? 0 : 0.5,
      }}
    >
      {/* Outer glow ring */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r="80"
        fill="none"
        stroke="#F97316"
        strokeWidth="2"
        strokeOpacity="0.3"
        animate={
          prefersReducedMotion ? { scale: 1 } : { scale: [0.95, 1.1, 0.95] }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 2, repeat: Infinity, repeatType: "reverse" }
        }
      />

      {/* Main circle */}
      <circle
        cx={center.x}
        cy={center.y}
        r="60"
        fill="white"
        stroke="#F97316"
        strokeWidth="3"
      />

      {/* Inner icon */}
      <motion.g
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: prefersReducedMotion ? 0 : 1.2,
          duration: prefersReducedMotion ? 0 : 0.4,
        }}
      >
        <foreignObject x={center.x - 16} y={center.y - 16} width="32" height="32">
          <Sparkles className="h-8 w-8 text-orange-500" />
        </foreignObject>
      </motion.g>

      <text
        x={center.x}
        y={260}
        textAnchor="middle"
        className="text-sm fill-zinc-500"
      >
        Analyzing...
      </text>
    </motion.g>
  )
}

function RecommendationNode({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean
}) {
  return (
    <motion.g
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : 1.5,
        duration: prefersReducedMotion ? 0 : 0.5,
      }}
    >
      <motion.line
        x1={center.x}
        y1={240}
        x2={center.x}
        y2={300}
        stroke="#10B981"
        strokeWidth="3"
        initial={prefersReducedMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: prefersReducedMotion ? 0 : 1.3,
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      />

      <rect
        x={300}
        y={310}
        width={200}
        height={70}
        rx="12"
        fill="white"
        stroke="#10B981"
        strokeWidth="2"
      />

      <circle cx={330} cy={345} r="14" fill="#10B981" />
      <foreignObject x={322} y={337} width="16" height="16">
        <Check className="h-4 w-4 text-white" />
      </foreignObject>

      <text x={355} y={340} className="text-sm font-medium fill-zinc-900">
        Recommendation
      </text>
      <text x={355} y={360} className="text-xs fill-zinc-500">
        72% confidence
      </text>
    </motion.g>
  )
}
