"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { ThemeToggleButtons } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { landingNavItems, landingSite } from "@/lib/content/landing";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

type LandingNavProps = {
  logoSrc: string;
  className?: string;
};

function ProductMegaMenu({ compact }: { compact?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const openNow = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const { panelImage } = landingNavItems.mega;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-0.5 px-2 font-medium text-muted-foreground hover:text-foreground",
            compact && "h-9",
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
          onPointerEnter={openNow}
          onPointerLeave={scheduleClose}
        >
          {landingNavItems.mega.label}
          <ChevronDown
            className={cn(
              "size-3.5 opacity-60 transition-transform duration-200",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="bottom"
        sideOffset={14}
        collisionPadding={16}
        className={cn(
          "w-[calc(100vw-2rem)] max-w-[52rem] border border-border/60 p-0 shadow-2xl shadow-black/10 sm:w-[min(52rem,calc(100vw-3rem))] dark:border-white/10 dark:shadow-black/40",
          "overflow-hidden rounded-2xl bg-popover",
        )}
        onPointerEnter={clearCloseTimer}
        onPointerLeave={scheduleClose}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex min-h-[min(22rem,70vh)] max-h-[min(32rem,85vh)] items-stretch">
          <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 sm:grid-cols-2 sm:gap-8 sm:p-8">
            {landingNavItems.mega.columns.map((column) => (
              <div key={column.heading}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {column.heading}
                </p>
                <ul className="space-y-1">
                  {column.links.map((item) => (
                    <li key={`${column.heading}-${item.href}-${item.label}`}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/80"
                      >
                        <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                          {item.label}
                        </span>
                        {item.description ? (
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="relative hidden w-[min(30%,14rem)] max-w-[15rem] shrink-0 self-stretch overflow-hidden rounded-l-2xl sm:block">
            <Image
              src={panelImage.src}
              alt={panelImage.alt}
              fill
              sizes="(max-width: 640px) 0px, 240px"
              className="object-cover object-left"
              priority={false}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function LandingNav({ logoSrc, className }: LandingNavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${landingSite.name} home`}
        >
          <Image
            src={logoSrc}
            alt=""
            width={132}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 justify-center md:block"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1">
            <li>
              <Link
                href={landingNavItems.about.href}
                className={cn(navLinkClass, "rounded-md px-3 py-2")}
              >
                {landingNavItems.about.label}
              </Link>
            </li>
            <li>
              <ProductMegaMenu />
            </li>
            <li>
              <Link
                href={landingNavItems.pricing.href}
                className={cn(navLinkClass, "rounded-md px-3 py-2")}
              >
                {landingNavItems.pricing.label}
              </Link>
            </li>
            <li>
              <Link
                href={landingNavItems.contact.href}
                className={cn(navLinkClass, "rounded-md px-3 py-2")}
              >
                {landingNavItems.contact.label}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggleButtons />
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-foreground px-4 text-background hover:bg-foreground/90 sm:px-5"
          >
            <Link href="/auth/signup">Get started</Link>
          </Button>
        </div>
      </div>

      <nav aria-label="Primary mobile" className="md:hidden">
        <ul className="mx-auto flex max-w-6xl snap-x snap-mandatory items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li className="shrink-0 snap-start">
            <Link
              href={landingNavItems.about.href}
              className={cn(navLinkClass, "block whitespace-nowrap px-3 py-2")}
            >
              {landingNavItems.about.label}
            </Link>
          </li>
          <li className="shrink-0 snap-start">
            <ProductMegaMenu compact />
          </li>
          <li className="shrink-0 snap-start">
            <Link
              href={landingNavItems.pricing.href}
              className={cn(navLinkClass, "block whitespace-nowrap px-3 py-2")}
            >
              {landingNavItems.pricing.label}
            </Link>
          </li>
          <li className="shrink-0 snap-start">
            <Link
              href={landingNavItems.contact.href}
              className={cn(navLinkClass, "block whitespace-nowrap px-3 py-2")}
            >
              {landingNavItems.contact.label}
            </Link>
          </li>
          <li className="shrink-0 snap-start sm:hidden">
            <Link
              href="/auth/login"
              className={cn(navLinkClass, "block whitespace-nowrap px-3 py-2")}
            >
              Log in
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
