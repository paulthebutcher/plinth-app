'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-zinc-900 hover:text-orange-500 transition-colors">
            Plinth
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#how-it-works">How it Works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              Login
            </Link>
            <Button 
              variant="default" 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              asChild
            >
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -mr-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Slide-out panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link 
                    href="/" 
                    className="font-bold text-xl text-zinc-900 hover:text-orange-500 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Plinth
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="space-y-6">
                  <MobileNavLink href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                    How it Works
                  </MobileNavLink>
                  <MobileNavLink href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </MobileNavLink>
                  <MobileNavLink href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </MobileNavLink>
                  <Button 
                    variant="default" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    asChild
                  >
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-zinc-600 hover:text-zinc-900 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all after:duration-200"
    >
      {children}
    </a>
  )
}

function MobileNavLink({ 
  href, 
  children,
  onClick
}: { 
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block text-lg text-zinc-600 hover:text-zinc-900 transition-colors"
    >
      {children}
    </a>
  )
}
