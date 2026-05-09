"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  landingSlabBaseClass,
  landingSlabTestimonialHeightClass,
} from "@/components/landing/landing-slab";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  landingTestimonials,
  landingTestimonialsSection,
} from "@/lib/content/landing";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  className?: string;
};

export function TestimonialsSection({ className }: TestimonialsSectionProps) {
  const reduceMotion = useReducedMotion();
  const placeholders = landingTestimonials.filter((t) => t.isPlaceholder);

  return (
    <section
      className={cn("bg-muted/25 py-20 sm:py-28", className)}
      aria-labelledby="testimonials-heading"
      id="testimonials"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            id="testimonials-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {landingTestimonialsSection.title}
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 text-muted-foreground sm:text-lg"
          >
            {landingTestimonialsSection.subtitle}
          </motion.p>
        </div>

        {placeholders.length > 0 && (
          <p className="sr-only">
            The following quotes are placeholder content for layout only.
          </p>
        )}

        <ul className="mt-14 grid list-none grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {landingTestimonials.map((t, i) => (
            <motion.li
              key={t.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              className="flex h-full min-h-0 flex-col"
            >
              <article className="flex h-full flex-col">
                <div
                  className={cn(
                    landingSlabBaseClass,
                    landingSlabTestimonialHeightClass,
                  )}
                >
                  <div
                    className="flex w-full max-w-[260px] flex-col items-center gap-4"
                    aria-hidden
                  >
                    <Avatar className="size-16 border-2 border-white shadow-md dark:border-zinc-700">
                      <AvatarFallback className="text-base font-semibold">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2 px-2">
                      <div className="mx-auto h-2 w-full max-w-[200px] rounded-full bg-zinc-300/80 dark:bg-zinc-600/80" />
                      <div className="mx-auto h-2 w-4/5 max-w-[160px] rounded-full bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mx-auto h-2 w-3/5 max-w-[120px] rounded-full bg-zinc-200/80 dark:bg-zinc-700/80" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-1 flex-col items-center text-center sm:mt-10">
                  <footer className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
                    <cite className="not-italic text-lg font-bold text-foreground">
                      {t.name}
                    </cite>
                    <span className="text-sm text-muted-foreground">
                      {t.handle}
                    </span>
                    {t.isPlaceholder ? (
                      <span className="sr-only">Placeholder testimonial</span>
                    ) : null}
                  </footer>
                  <blockquote className="mt-3 max-w-[320px] flex-1 text-sm leading-relaxed text-muted-foreground">
                    <p>“{t.quote}”</p>
                  </blockquote>
                </div>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
