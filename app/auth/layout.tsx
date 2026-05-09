import React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      {/* Left: brand panel — hidden on small screens so the form stays primary */}
      <aside className="relative hidden min-h-0 w-full overflow-hidden bg-[#0a0a0c] lg:flex lg:w-1/2 lg:min-h-dvh">
        {/* Globe / grid atmosphere */}
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 85% 65% at 50% 115%, rgba(34, 197, 94, 0.14), transparent 55%),
              radial-gradient(ellipse 70% 50% at 20% 40%, rgba(99, 102, 241, 0.06), transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0.5px, transparent 0.5px)
            `,
            backgroundSize: "100% 100%, 100% 100%, 28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-1/4 left-1/2 h-[85%] w-[85%] -translate-x-1/2 rounded-full border border-white/[0.07] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_55%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-1/4 left-1/2 h-[70%] w-[70%] -translate-x-1/2 rounded-full border border-dashed border-white/[0.06]"
          aria-hidden
        />

        <div className="relative z-10 flex h-full min-h-dvh flex-col px-10 py-8 lg:px-14 lg:py-10">
          <Link href="/" className="inline-flex w-fit shrink-0 items-center gap-2 outline-none ring-offset-2 ring-offset-[#0a0a0c] focus-visible:ring-2 focus-visible:ring-emerald-400/80">
            <img src="/logo-white.svg" alt="Survay Go" className="h-8 w-auto" width={120} height={32} />
          </Link>

          <div className="flex w-full max-w-lg flex-1 flex-col items-start justify-end pb-8 text-left lg:pb-10">
            <p className="text-sm font-medium tracking-wide text-white/75">Welcome to</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Survay Go Community
            </h1>
            <p className="mt-3 text-[15px] leading-snug text-white/65">
              Home to builders who ship smarter forms, surveys, and workflows—without the busywork.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Know more
            </Link>
          </div>
        </div>
      </aside>

      {/* Right: form area (page content unchanged) */}
      <main className="flex min-h-dvh flex-1 flex-col bg-white">
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
