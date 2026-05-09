"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  landingHero,
  landingSite,
  landingTrustedBrands,
} from "@/lib/content/landing";
import { cn } from "@/lib/utils";

type LandingHeroProps = {
  logoSrc: string;
  className?: string;
};

export function LandingHero({ logoSrc, className }: LandingHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28",
        className,
      )}
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          
          <br />
          <motion.h1
            id="hero-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-balance text-4xl font-normal tracking-tight text-foreground sm:text-5xl sm:leading-[1.08] lg:text-6xl"
          >
            {landingHero.headline}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            {landingHero.subhead}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-foreground px-6 text-background hover:bg-foreground/90"
            >
              <Link href={landingHero.primaryCta.href}>
                {landingHero.primaryCta.label}
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              size="lg"
              className="rounded-full gap-1"
            >
              <Link href={landingHero.secondaryCta.href}>
                {landingHero.secondaryCta.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-16 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          Trusted by teams who care about craft
        </motion.p>
        <ul
          className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
          aria-label="Illustrative customer names"
        >
          {landingTrustedBrands.map((b) => (
            <li
              key={b.name}
              className="text-sm font-medium text-muted-foreground/80"
            >
              {b.name}
            </li>
          ))}
        </ul> */}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 rounded-[28px] bg-[#f2f2f2] w-full p-4  sm:p-6 lg:p-12 pb-0! dark:bg-zinc-800/75"
          id="product"
        >
          <div className="relative mx-auto max-w-5xl">
            <div
              className="pointer-events-none absolute -left-4 top-1/4 z-10 hidden w-48 rounded-2xl border border-black/6 bg-white p-3 shadow-lg md:block lg:-left-8 dark:border-white/10 dark:bg-zinc-900"
              aria-hidden
            >
              <div className="h-2 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-2 w-4/5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
            <div
              className="pointer-events-none absolute -right-4 bottom-1/4 z-10 hidden w-44 rounded-2xl border border-black/6 bg-white p-3 shadow-lg md:block lg:-right-6 dark:border-white/10 dark:bg-zinc-900"
              aria-hidden
            >
              <div className="flex gap-2">
                <div className="size-8 rounded-lg bg-primary/15" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-2 w-2/3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl rounded-b-none! border border-black/6 bg-white shadow-md dark:border-white/10 dark:bg-zinc-950">
              <Image
                src="/dash3.png"
                alt="Dashboard preview showing the visual form editor canvas with fields and toolbar"
                width={1440}
                height={900}
                className="h-auto w-full object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
