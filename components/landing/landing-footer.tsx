import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { landingFooterColumns, landingSite } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

type LandingFooterProps = {
  className?: string;
};

export function LandingFooter({ className }: LandingFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("  text-neutral-400", className)}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Link
              href="/"
              className="inline-flex outline-none ring-offset-2 ring-offset-[#0a0a0c] focus-visible:ring-2 focus-visible:ring-emerald-400/80"
              aria-label={`${landingSite.name} home`}
            >
              <Image
                src="/logo-white.svg"
                alt=""
                width={132}
                height={32}
                className="h-8 w-auto opacity-90"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500">
              {landingSite.tagline}
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12"
            aria-label="Footer"
          >
            {landingFooterColumns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-400 transition hover:text-neutral-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {year} {landingSite.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-4" aria-label="Social links">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-500 transition hover:text-neutral-200"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-500 transition hover:text-neutral-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
