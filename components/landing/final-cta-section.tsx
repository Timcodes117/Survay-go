"use client";

import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandNetflix,
  IconBrandOpenai,
  IconBrandSlack,
  IconBrandSpotify,
  IconBrandStripe,
  IconBrandTabler,
  IconBrandTidal,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingFinalCta } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

const cloudIcons = [
  IconBrandSpotify,
  IconBrandNetflix,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandGithub,
  IconBrandTwitch,
  IconBrandTidal,
  IconBrandOpenai,
  IconBrandDiscord,
  IconBrandLinkedin,
  IconBrandTabler,
  IconBrandSpotify,
  IconBrandStripe,
  IconBrandSlack,
  IconBrandYoutube,
] as const;

type FinalCtaSectionProps = {
  className?: string;
};

export function FinalCtaSection({ className }: FinalCtaSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn("py-20 sm:py-28", className)}
      aria-labelledby="cta-heading"
      id="cta"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            id="cta-heading"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {landingFinalCta.title}
          </motion.h2>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-4 text-muted-foreground sm:text-lg"
          >
            {landingFinalCta.subtitle}
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-8"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-foreground px-8 text-background hover:bg-foreground/90"
            >
              <Link href={landingFinalCta.cta.href}>
                {landingFinalCta.cta.label}
              </Link>
            </Button>
          </motion.div>
        </div>

        <div
          className="relative mt-16 overflow-hidden rounded-[28px] bg-[#f2f2f2] py-10 dark:bg-zinc-800/75"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 px-6 opacity-60 grayscale sm:gap-x-12">
            {cloudIcons.map((Icon, idx) => (
              <motion.div
                key={`${Icon.displayName ?? "icon"}-${idx}`}
                initial={false}
                animate={
                  reduceMotion
                    ? {}
                    : {
                        y: [0, -4, 0],
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: (idx % 5) * 0.2,
                }}
              >
                <Icon
                  className="size-9 text-foreground sm:size-10"
                  stroke={1.1}
                />
              </motion.div>
            ))}
          </div>
          <p className="sr-only">
            Decorative grid of brand icons suggesting an ecosystem of tools—no
            endorsement implied.
          </p>
        </div>
      </div>
    </section>
  );
}
