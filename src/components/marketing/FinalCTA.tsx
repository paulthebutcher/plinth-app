'use client'

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-white to-orange-50 py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold text-zinc-900">
          Your next big decision is waiting.
        </h2>
        <p className="mb-8 text-xl text-zinc-600">
          Try Plinth free. No credit card. No sales call.
        </p>

        <motion.div
          animate={{
            boxShadow: [
              "0 16px 40px rgba(249, 115, 22, 0.15)",
              "0 20px 48px rgba(249, 115, 22, 0.3)",
              "0 16px 40px rgba(249, 115, 22, 0.15)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block rounded-md"
        >
          <Button className="h-14 px-10 text-lg shadow-orange-500/25">
            Analyze Your First Decision
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
