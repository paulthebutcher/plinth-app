import type { Metadata } from "next"

import { ComparisonTable } from "@/components/marketing/ComparisonTable"
import { FinalCTA } from "@/components/marketing/FinalCTA"
import { Footer } from "@/components/marketing/Footer"
import { FounderNote } from "@/components/marketing/FounderNote"
import { Hero } from "@/components/marketing/Hero"
import { HowItWorks } from "@/components/marketing/HowItWorks"
import { InsightSection } from "@/components/marketing/InsightSection"
import { OutcomesGrid } from "@/components/marketing/OutcomesGrid"
import { ProblemSection } from "@/components/marketing/ProblemSection"

export const metadata: Metadata = {
  title: "Plinth - Strategic rigor without the retainer",
  description: "From question to defensible recommendation in 10 minutes.",
  openGraph: {
    title: "Plinth - Strategic rigor without the retainer",
    description: "From question to defensible recommendation in 10 minutes.",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Plinth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plinth - Strategic rigor without the retainer",
    description: "From question to defensible recommendation in 10 minutes.",
    images: ["/og.svg"],
  },
}

export default function MarketingPage() {
  return (
    <main>
      <Hero />
      <section className="border-y border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-zinc-600">
            Built for product leaders, strategy teams, and executives who can't
            afford to guess.
          </p>
        </div>
      </section>
      <ProblemSection />
      <InsightSection />
      <HowItWorks />
      <OutcomesGrid />
      <ComparisonTable />
      <FounderNote />
      <FinalCTA />
      <Footer />
    </main>
  )
}
