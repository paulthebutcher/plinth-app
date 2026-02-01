'use client'

import { motion } from "framer-motion"

type StepProps = {
  text: string
  muted?: boolean
  highlight?: boolean
  good?: boolean
  bad?: boolean
}

type StepTone = Omit<StepProps, "text">

const stepClass = ({ muted, highlight, good, bad }: StepTone) => {
  if (good) return "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
  if (bad) return "border-red-500/50 bg-red-500/10 text-red-200"
  if (highlight) return "border-orange-500/40 bg-orange-500/10 text-orange-100"
  if (muted) return "border-zinc-700 bg-zinc-800 text-zinc-400"
  return "border-zinc-700 bg-zinc-800 text-zinc-300"
}

export function InsightSection() {
  return (
    <section className="bg-zinc-900 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-6 text-4xl font-bold text-white">
          The problem isn't your judgment.
          <br />
          <span className="text-orange-400">It's the process.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-zinc-400">
          Most decision tools start with "What are your options?" That's
          backwards.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-800 p-8 text-left">
            <p className="mb-4 text-sm uppercase tracking-wide text-zinc-500">
              Others
            </p>
            <h3 className="mb-6 text-xl font-semibold text-zinc-300">
              Options First
            </h3>
            <div className="space-y-4">
              <Step text="What do you think?" muted />
              <Arrow />
              <Step text="Find supporting evidence" muted />
              <Arrow />
              <Step text="Confirmation bias" bad />
            </div>
          </div>

          <div className="rounded-2xl border-2 border-orange-500/50 bg-zinc-800 p-8 text-left">
            <p className="mb-4 text-sm uppercase tracking-wide text-orange-400">
              Plinth
            </p>
            <h3 className="mb-6 text-xl font-semibold text-white">
              Evidence First
            </h3>
            <div className="space-y-4">
              <Step text="What does the data say?" highlight />
              <Arrow orange />
              <Step text="Generate grounded options" highlight />
              <Arrow orange />
              <Step text="Surprising insights" good />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Step({ text, ...rest }: StepProps) {
  return (
    <div
      className={[
        "rounded-xl border px-4 py-3 text-sm font-medium",
        stepClass(rest),
      ].join(" ")}
    >
      {text}
    </div>
  )
}

function Arrow({ orange }: { orange?: boolean }) {
  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0, width: 0 }}
      whileInView={{ opacity: 1, width: "100%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div
        className={[
          "h-px flex-1",
          orange ? "bg-orange-500/60" : "bg-zinc-600",
        ].join(" ")}
      />
      <div
        className={[
          "ml-2 text-xs",
          orange ? "text-orange-400" : "text-zinc-500",
        ].join(" ")}
      >
        →
      </div>
    </motion.div>
  )
}
