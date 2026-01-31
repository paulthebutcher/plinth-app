'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroDiagram } from "./HeroDiagram"

export function Hero() {
  return (
    <section className="min-h-screen pt-16 hero-bg">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight mb-6">
          Strategic rigor without the retainer.
        </h1>
        <p className="text-xl text-zinc-600 max-w-xl mx-auto mb-8">
          From question to defensible recommendation in 10 minutes.
        </p>
        <Button className="h-14 px-10 text-lg">
          Analyze Your First Decision
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="mt-4 text-sm text-zinc-500">No credit card required</p>

        <div className="mt-16 max-w-4xl mx-auto">
          <HeroDiagram />
        </div>

        <div className="mt-8 animate-bounce">
          <ArrowRight className="h-6 w-6 mx-auto text-zinc-400 rotate-90" />
        </div>
      </div>
    </section>
  )
}
