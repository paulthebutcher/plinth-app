'use client'

export function FounderNote() {
  return (
    <section className="bg-zinc-900 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="text-6xl text-orange-500/30">"</span>
        <blockquote className="mb-8 -mt-8 text-2xl font-medium text-white">
          I've sat in the rooms where these decisions get made — and watched
          smart people make bad calls because they didn't have time to do the
          work.
          <br />
          <br />
          Plinth is the tool I wished existed.
        </blockquote>
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white font-bold">
            P
          </div>
          <div className="text-left">
            <p className="font-medium text-white">Paul Butcher</p>
            <p className="text-sm text-zinc-500">Founder</p>
          </div>
        </div>
      </div>
    </section>
  )
}
