'use client'

import { Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-zinc-900 py-16 text-zinc-400">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          <div>
            <div className="mb-4 text-white">Plinth</div>
            <p className="text-sm">Make better decisions.</p>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white" href="#how-it-works">
                  How it Works
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="#pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/changelog">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white" href="/about">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/blog">
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="mailto:hello@myplinth.com"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-medium text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white" href="/privacy">
                  Privacy
                </a>
              </li>
              <li>
                <a className="hover:text-white" href="/terms">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 md:flex-row">
          <p className="text-sm">© 2026 Plinth. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-white" href="https://twitter.com/plinth">
              <Twitter className="h-5 w-5" />
            </a>
            <a
              className="hover:text-white"
              href="https://linkedin.com/company/plinth"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
