'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-zinc-900">
          Plinth
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <Link href="/login" className="text-zinc-600 hover:text-zinc-900">
            Login
          </Link>
          <Button variant="default" className="py-2 px-4 text-sm">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <button className="md:hidden">
          <span className="sr-only">Open menu</span>
          {/* Add mobile menu button icon */}
        </button>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-zinc-600 hover:text-zinc-900 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-200"
    >
      {children}
    </a>
  )
}
