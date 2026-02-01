'use client'

import { motion } from "framer-motion"
import { FileText, Sparkles, Target } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: Target,
    title: "Frame the decision",
    description:
      '"Should we enter the mid-market with a lighter compliance offering?"',
  },
  {
    number: 2,
    icon: Sparkles,
    title: "Get the analysis",
    description:
      "Evidence gathered. Options generated. Tradeoffs surfaced. Confidence scored.",
  },
  {
    number: 3,
    icon: FileText,
    title: "Export the brief",
    description:
      "A document you can share, defend, and revisit when someone asks why.",
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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900">
          Three steps. No templates.
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-lg text-zinc-600">
          Describe your decision. Get rigorous analysis. Export a defensible
          brief.
        </p>

        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <button
            type="button"
            className="text-orange-600 transition-colors hover:text-orange-700"
          >
            See a sample brief →
          </button>
        </div>
      </div>
    </section>
  )
}

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white p-8 text-center transition-all hover:border-gray-300 hover:shadow-lg"
      variants={item}
      whileHover={{ y: -4 }}
    >
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl font-bold text-white">
        {number}
      </div>
      <Icon className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
      <h3 className="mb-3 text-xl font-semibold text-zinc-900">{title}</h3>
      <p className="text-zinc-600">{description}</p>
    </motion.div>
  )
}
