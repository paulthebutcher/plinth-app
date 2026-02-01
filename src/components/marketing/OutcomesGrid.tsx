'use client'

import { motion } from "framer-motion"
import {
  BarChart3,
  Eye,
  FileText,
  Lightbulb,
  Scale,
  Search,
} from "lucide-react"

const outcomes = [
  {
    icon: Search,
    title: "Evidence from 50+ sources",
    description: "Stop wondering what you missed.",
  },
  {
    icon: Lightbulb,
    title: "Options you didn't think of",
    description: "Escape your own assumptions.",
  },
  {
    icon: BarChart3,
    title: "Transparent confidence scores",
    description: "Know how sure you should be — and why.",
  },
  {
    icon: Scale,
    title: "Explicit tradeoff acknowledgment",
    description: "Defend your reasoning months later.",
  },
  {
    icon: FileText,
    title: "A shareable brief",
    description: "Align stakeholders without a 40-slide deck.",
  },
  {
    icon: Eye,
    title: "Post-decision tracking",
    description: "Know when your assumptions change.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function OutcomesGrid() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900">
          Not features. Outcomes.
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-lg text-zinc-600">
          What you actually walk away with.
        </p>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {outcomes.map((outcome) => (
            <OutcomeCard key={outcome.title} {...outcome} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function OutcomeCard({
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
      className="rounded-xl bg-white p-6 transition-shadow hover:shadow-md"
      variants={item}
    >
      <Icon className="mb-4 h-6 w-6 text-orange-500" />
      <h3 className="mb-2 font-semibold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-600">{description}</p>
    </motion.div>
  )
}
