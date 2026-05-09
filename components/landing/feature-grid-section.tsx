"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  landingSlabBaseClass,
  landingSlabFeatureHeightClass,
} from "@/components/landing/landing-slab";
import { landingFeaturesSection } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

/** UI-style illustration centered inside the large gray panel (reference layout). */
function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div
        className="w-full max-w-[260px] rounded-2xl bg-zinc-900 px-4 py-4 shadow-xl"
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div className="h-2 w-20 rounded-full bg-white/15" />
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-900 shadow-sm">
            <span
              className="grid size-5 place-items-center rounded bg-gradient-to-br from-[#a259ff] via-[#f24e1e] to-[#ff7262] text-[10px] text-white"
              aria-hidden
            >
              ◆
            </span>
            Copy
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div
        className="w-full max-w-[240px] overflow-hidden rounded-2xl border border-black/6 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900"
        aria-hidden
      >
        <div className="border-b border-black/6 bg-zinc-50 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10 dark:bg-zinc-800/80">
          Quick save
        </div>
        <ul className="py-2 text-left text-sm text-foreground">
          <li className="px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
            Library
          </li>
          <li className="px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
            Create collection
          </li>
          <li className="px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
            Dark mode
          </li>
          <li className="px-4 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
            Launch screens
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[280px] space-y-4" aria-hidden>
      <div className="flex gap-3">
        <div className="size-10 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="flex-1 rounded-2xl rounded-tl-md border border-black/6 bg-white px-3 py-3 shadow-md dark:border-white/10 dark:bg-zinc-900">
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-3/5 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 pl-4 shadow-md dark:border-white/10 dark:bg-zinc-900">
        <div className="h-2 min-w-0 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        <div
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0b7cff] text-white shadow-sm"
          aria-hidden
        >
          <ArrowUpRight className="size-4" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}

type FeatureGridSectionProps = {
  className?: string;
};

export function FeatureGridSection({ className }: FeatureGridSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn("py-24 sm:py-32", className)}
      aria-labelledby="features-heading"
      id="features"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          id="features-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="text-center text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
        >
          {landingFeaturesSection.title}
        </motion.h2>

        <ul className="mt-16 grid list-none grid-cols-1 items-stretch gap-x-10 gap-y-20 md:grid-cols-2 md:gap-y-24 lg:mt-20 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
          {landingFeaturesSection.items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex h-full min-h-0 flex-col"
            >
              <div
                className={cn(
                  landingSlabBaseClass,
                  landingSlabFeatureHeightClass,
                )}
              >
                <FeatureVisual index={i} />
              </div>

              <div className="mt-8 flex flex-col items-center text-center sm:mt-10">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                  {item.descriptionLink ? (
                    <>
                      {" "}
                      <Link
                        href={item.descriptionLink.href}
                        className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition hover:decoration-foreground"
                      >
                        {item.descriptionLink.label}
                      </Link>
                    </>
                  ) : null}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
