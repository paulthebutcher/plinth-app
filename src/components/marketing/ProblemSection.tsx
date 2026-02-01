'use client'

import { motion } from "framer-motion"
import { Grid3x3, Heart, Search, Users } from "lucide-react"

const problems = [
  {
    icon: Users,
    title: "Hire consultants",
    description: "$500k, 8 weeks, tell you what you already suspected",
  },
  {
    icon: Search,
    title: "DIY research",
    description: "Find evidence that confirms what you wanted to believe",
  },
  {
    icon: Heart,
    title: "Trust your gut",
    description: "Works until it doesn't — and you can't explain why",
  },
  {
    icon: Grid3x3,
    title: "Use a framework",
    description: "A 2x2 matrix doesn't do the research for you",
  },
]

export function ProblemSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-16 px-6 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-bold text-zinc-900">
            The way you make strategic decisions is broken.
          </h2>
          <p className="mb-4 text-lg text-zinc-600">
            You're expected to make calls that shape the next 18 months — with a
            half-day of research, three conflicting opinions, and a deadline.
          </p>
          <p className="text-lg text-zinc-600">
            Six months later, someone asks: <em>"Why did we do this again?"</em>
          </p>
        </div>
        <div className="space-y-4">
          {problems.map((problem) => (
            <ProblemCard key={problem.title} {...problem} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <motion.div
      className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-red-200 hover:bg-red-50/50"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="rounded-lg bg-gray-100 p-2">
        <Icon className="h-5 w-5 text-zinc-400" />
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </motion.div>
  )
}
