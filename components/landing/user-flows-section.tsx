"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  landingSlabBaseClass,
  landingSlabFeatureHeightClass,
} from "@/components/landing/landing-slab";
import { landingFlowsSection } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

type UserFlowsSectionProps = {
  className?: string;
};

export function UserFlowsSection({ className }: UserFlowsSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn("bg-muted/35 py-20 sm:py-28", className)}
      aria-labelledby="flows-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            id="flows-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {landingFlowsSection.title}
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 text-muted-foreground sm:text-lg"
          >
            {landingFlowsSection.subtitle}
          </motion.p>
        </div>

        <div className="mt-14 grid items-stretch gap-x-10 gap-y-16 lg:grid-cols-2 lg:gap-y-12">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="flex h-full min-h-0 flex-col"
          >
            <div
              className={cn(
                landingSlabBaseClass,
                landingSlabFeatureHeightClass,
              )}
            >
              <div
                className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-black/6 bg-gradient-to-b from-orange-500/90 to-orange-600/95 p-4 shadow-lg dark:border-white/10"
                role="img"
                aria-label="Light-themed flow preview suggesting onboarding steps with a warm accent header"
              >
                <div className="rounded-xl bg-white/95 p-3 shadow-sm">
                  <div className="h-2 w-16 rounded-full bg-neutral-200" />
                  <div className="mt-4 h-24 rounded-lg bg-neutral-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded-full bg-neutral-200" />
                    <div className="h-2 w-4/5 rounded-full bg-neutral-200" />
                  </div>
                  <div className="mt-4 h-9 w-full rounded-md bg-orange-500/90" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center text-center sm:mt-10">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {landingFlowsSection.lightCard.title}
              </h3>
              <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
                {landingFlowsSection.lightCard.description}
              </p>
            </div>
          </motion.article>

          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex h-full min-h-0 flex-col"
          >
            <div
              className={cn(
                landingSlabBaseClass,
                landingSlabFeatureHeightClass,
              )}
            >
              <div
                className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-4 shadow-lg"
                role="img"
                aria-label="Dark-themed flow preview suggesting messaging threads and compact productivity chrome"
              >
                <div className="flex gap-2 border-b border-white/10 pb-3">
                  <div className="size-8 rounded-full bg-white/15" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-2 w-24 rounded-full bg-white/20" />
                    <div className="h-2 w-16 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="ml-6 rounded-lg rounded-tl-sm bg-white/10 p-2">
                    <div className="h-2 w-full rounded-full bg-white/15" />
                    <div className="mt-1.5 h-2 w-3/4 rounded-full bg-white/10" />
                  </div>
                  <div className="mr-6 rounded-lg rounded-tr-sm bg-indigo-500/40 p-2">
                    <div className="h-2 w-full rounded-full bg-white/25" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center text-center sm:mt-10">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {landingFlowsSection.darkCard.title}
              </h3>
              <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
                {landingFlowsSection.darkCard.description}
              </p>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
