"use client";

import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTabler,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const iconClass =
  "size-10 sm:size-12 text-foreground/25 dark:text-foreground/30";

const items = [
  { Icon: IconBrandSlack, x: "8%", y: "18%", delay: 0 },
  { Icon: IconBrandGithub, x: "22%", y: "62%", delay: 0.2 },
  { Icon: IconBrandTwitter, x: "38%", y: "28%", delay: 0.4 },
  { Icon: IconBrandStripe, x: "52%", y: "55%", delay: 0.1 },
  { Icon: IconBrandLinkedin, x: "68%", y: "20%", delay: 0.35 },
  { Icon: IconBrandDiscord, x: "78%", y: "48%", delay: 0.25 },
  { Icon: IconBrandYoutube, x: "88%", y: "72%", delay: 0.5 },
  { Icon: IconBrandTabler, x: "15%", y: "78%", delay: 0.15 },
] as const;

type FloatingBrandIconsProps = {
  className?: string;
};

export function FloatingBrandIcons({ className }: FloatingBrandIconsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        "relative min-h-[280px] py-20 sm:min-h-[340px] sm:py-28",
        className,
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {items.map(({ Icon, x, y, delay }) => (
          <motion.div
            key={`${x}-${y}`}
            className="absolute"
            style={{ left: x, top: y }}
            initial={false}
            animate={
              reduceMotion
                ? {}
                : {
                    y: [0, -10, 0],
                    rotate: [0, 2, 0],
                  }
            }
            transition={{
              duration: 5 + delay * 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay,
            }}
          >
            <Icon className={iconClass} stroke={1.25} aria-hidden />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
