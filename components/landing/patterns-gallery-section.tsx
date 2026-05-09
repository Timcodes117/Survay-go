"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  landingSlabBaseClass,
  landingSlabPatternHeightClass,
} from "@/components/landing/landing-slab";
import { landingPatternsSection } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

const phoneShellClass =
  "relative aspect-[9/19] w-[130px] shrink-0 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-md sm:w-[150px] lg:w-[168px] dark:border-white/10 dark:bg-zinc-900";

function PlaceholderMobileUi({
  variant,
}: {
  variant: "a" | "b" | "c" | "d" | "e" | "f";
}) {
  const bars =
    variant === "a"
      ? "space-y-2"
      : variant === "b"
        ? "space-y-3"
        : variant === "c"
          ? "space-y-2"
          : variant === "d"
            ? "space-y-2"
            : variant === "e"
              ? "space-y-2"
              : "space-y-2";

  return (
    <div className={cn("flex h-full flex-col p-3 pt-6", bars)}>
      <div className="mx-auto h-1 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div
        className={cn(
          "mt-3 h-16 rounded-lg",
          variant === "b" ? "bg-primary/20" : "bg-zinc-100 dark:bg-zinc-800",
        )}
      />
      <div className="mt-3 space-y-2">
        <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-2 w-5/6 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-2 w-2/3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      </div>
      {variant !== "f" && (
        <div className="mt-auto flex gap-2 pb-1">
          <div className="h-8 flex-1 rounded-md bg-zinc-200/80 dark:bg-zinc-700/80" />
          <div className="h-8 w-8 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}
      {variant === "f" && (
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {(["f-a1", "f-a2", "f-a3", "f-a4", "f-a5", "f-a6"] as const).map(
            (id) => (
              <div
                key={id}
                className="aspect-square rounded-md bg-zinc-100 dark:bg-zinc-800"
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

const altByVariant: Record<string, string> = {
  a: "Placeholder mobile UI block suggesting a profile or account header layout",
  b: "Placeholder mobile UI block suggesting a bold hero or travel booking header",
  c: "Placeholder mobile UI block suggesting a search results list layout",
  d: "Placeholder mobile UI block suggesting a media or player control layout",
  e: "Placeholder mobile UI block suggesting a checkout or payments summary layout",
  f: "Placeholder mobile UI block suggesting a grid gallery or asset picker layout",
};

type PatternsGallerySectionProps = {
  className?: string;
};

export function PatternsGallerySection({
  className,
}: PatternsGallerySectionProps) {
  const reduceMotion = useReducedMotion();
  const variants = ["a", "b", "c", "d", "e", "f"] as const;

  return (
    <section
      className={cn("py-20 sm:py-28", className)}
      aria-labelledby="patterns-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            id="patterns-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {landingPatternsSection.title}
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 text-muted-foreground sm:text-lg"
          >
            {landingPatternsSection.subtitle}
          </motion.p>
        </div>

        <motion.ul
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-14 flex list-none flex-row gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-5 [&::-webkit-scrollbar]:hidden"
          aria-label="Gallery of stylized mobile layout placeholders"
        >
          {variants.map((v) => (
            <motion.li
              key={v}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className={cn(
                landingSlabBaseClass,
                landingSlabPatternHeightClass,
                "w-[160px] shrink-0 px-4 py-10 sm:w-[180px] sm:px-5 sm:py-12 lg:w-[196px]",
              )}
            >
              <div className={phoneShellClass}>
                <span className="sr-only">{altByVariant[v]}</span>
                <PlaceholderMobileUi variant={v} />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
