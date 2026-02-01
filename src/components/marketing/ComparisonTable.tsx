'use client'

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

type Row = {
  feature: string
  values: Array<React.ReactNode>
  highlight?: string
}

const rows: Row[] = [
  { feature: "Does the research", values: [true, false, false, true] },
  { feature: "Evidence before options", values: [true, false, false, true] },
  { feature: "Transparent reasoning", values: ["~", false, false, true] },
  { feature: "Defensible artifact", values: [true, false, false, true] },
  {
    feature: "Time to recommendation",
    values: ["8 weeks", "Days", "Hours", "10 min"],
    highlight: "10 min",
  },
  {
    feature: "Cost",
    values: ["$50k-500k", "Your time", "Free", "$$$"],
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function ComparisonTable() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900">
          Not a template. Not a chatbot. Not a 6-month engagement.
        </h2>
        <p className="mb-12 text-center text-lg text-zinc-600">
          See how Plinth compares.
        </p>

        <div className="overflow-x-auto">
          <motion.table
            className="w-full min-w-[720px]"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  "Feature",
                  "Consultants",
                  "DIY",
                  "Templates",
                  "Plinth",
                ].map((label, index) => (
                  <th
                    key={label}
                    className={[
                      "px-4 py-4 text-sm font-medium text-zinc-500",
                      index === 0 ? "text-left" : "text-center",
                      index === 4
                        ? "rounded-t-lg bg-orange-50 text-orange-600"
                        : "",
                    ].join(" ")}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <motion.tr
                  key={row.feature}
                  className="border-b border-gray-200"
                  variants={item}
                >
                  <td className="px-4 py-4 text-left text-sm font-medium text-zinc-700">
                    {row.feature}
                  </td>
                  {row.values.map((value, idx) => (
                    <td
                      key={`${row.feature}-${idx}`}
                      className={[
                        "px-4 py-4 text-center text-sm text-zinc-600",
                        idx === 3 ? "bg-orange-50/50 font-medium" : "",
                      ].join(" ")}
                    >
                      <Cell value={value} highlight={row.highlight} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>
    </section>
  )
}

function Cell({
  value,
  highlight,
}: {
  value: React.ReactNode
  highlight?: string
}) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-emerald-500" />
  }

  if (value === false) {
    return <X className="mx-auto h-4 w-4 text-red-400" />
  }

  if (typeof value === "string" && highlight && value === highlight) {
    return (
      <span className="font-medium text-orange-600">
        {value} <span className="text-orange-500">★</span>
      </span>
    )
  }

  if (value === "~") {
    return <span className="text-zinc-400">~</span>
  }

  return <span>{value}</span>
}
