'use client'

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="min-h-screen hero-bg pt-16">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-6 py-24 text-center">
        <div className="w-full">
          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Strategic rigor without the retainer.
          </motion.h1>
          <motion.p
            className="mx-auto mb-8 max-w-xl text-xl text-zinc-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            From question to defensible recommendation in 10 minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button className="h-14 px-10 text-lg">
              Analyze Your First Decision
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          <p className="mt-4 text-sm text-zinc-500">No credit card required</p>
        </div>
      </div>
    </section>
  )
}
