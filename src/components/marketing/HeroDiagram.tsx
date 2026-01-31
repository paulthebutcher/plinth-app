'use client'

import { Search, FileText, BarChart3, Globe, Users } from "lucide-react"

export function HeroDiagram() {
  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full max-w-4xl mx-auto"
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

      {/* Evidence nodes */}
      <EvidenceNode x={50} y={80} icon={Search} delay={0.2} />
      <EvidenceNode x={120} y={40} icon={FileText} delay={0.3} />
      <EvidenceNode x={50} y={200} icon={BarChart3} delay={0.4} />
      <EvidenceNode x={100} y={320} icon={Globe} delay={0.5} />
      <EvidenceNode x={750} y={60} icon={Users} delay={0.3} />
      <EvidenceNode x={700} y={160} icon={FileText} delay={0.4} />
      <EvidenceNode x={750} y={280} icon={Search} delay={0.5} />
      <EvidenceNode x={680} y={360} icon={BarChart3} delay={0.6} />

      {/* Central synthesis node */}
      <SynthesisNode />
    </svg>
  )
}

function EvidenceNode({ 
  x, 
  y, 
  icon: Icon, 
  delay 
}: { 
  x: number
  y: number
  icon: React.ElementType
  delay: number 
}) {
  return (
    <g>
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
        <Icon className="text-zinc-400" />
      </foreignObject>
    </g>
  )
}

function SynthesisNode() {
  return (
    <g>
      {/* Outer glow ring */}
      <circle
        cx={400}
        cy={180}
        r="80"
        fill="none"
        stroke="#F97316"
        strokeWidth="2"
        strokeOpacity="0.3"
      />

      {/* Main circle */}
      <circle
        cx={400}
        cy={180}
        r="60"
        fill="white"
        stroke="#F97316"
        strokeWidth="3"
      />

      {/* Inner icon */}
      <foreignObject x={384} y={164} width="32" height="32">
        <div className="text-orange-500">✨</div>
      </foreignObject>

      {/* "Analyzing" text */}
      <text
        x={400}
        y={260}
        textAnchor="middle"
        className="text-sm fill-zinc-500"
      >
        Analyzing...
      </text>
    </g>
  )
}
