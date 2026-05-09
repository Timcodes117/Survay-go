"use client";

import { motion, useReducedMotion } from "framer-motion";

import { landingBentoSection } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

function bentoCellClass(index: number) {
  switch (index) {
    case 0:
      return "md:col-span-2 lg:col-span-4 lg:row-span-2";
    case 1:
    case 2:
      return "lg:col-span-2";
    default:
      return "lg:col-span-3";
  }
}

type BentoHighlightsSectionProps = {
  className?: string;
};

export function BentoHighlightsSection({
  className,
}: BentoHighlightsSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id={landingBentoSection.id}
      className={cn("py-20 sm:py-28", className)}
      aria-labelledby="bento-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            id="bento-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {landingBentoSection.title}
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 text-muted-foreground sm:text-lg"
          >
            {landingBentoSection.subtitle}
          </motion.p>
        </div>

        <ul className="mt-14 grid list-none grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:auto-rows-[minmax(11rem,1fr)] lg:grid-cols-6 lg:grid-rows-3 lg:gap-4">
          {landingBentoSection.items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={cn(
                "flex h-full min-h-[220px] flex-col justify-between rounded-[28px] bg-[#f2f2f2] p-6 sm:min-h-[240px] sm:p-8 dark:bg-zinc-800/75",
                "lg:min-h-0",
                bentoCellClass(i),
              )}
            >
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div
                className="mt-6 h-14 shrink-0 rounded-2xl border border-black/6 bg-white/80 dark:border-white/10 dark:bg-zinc-900/80"
                aria-hidden
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
