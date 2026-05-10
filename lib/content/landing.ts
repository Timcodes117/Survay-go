/**
 * Marketing copy and structured content for the public landing page.
 * Replace placeholder testimonials when real quotes are available.
 */

export type LandingNavLink = {
  label: string;
  href: string;
};

/** Rich link for mega-menu panels */
export type LandingNavMegaLink = {
  label: string;
  href: string;
  description?: string;
};

export type LandingNavMegaColumn = {
  heading: string;
  links: LandingNavMegaLink[];
};

export type TrustedBrandMention = {
  /** Illustrative label only—swap for real logos when assets exist */
  name: string;
};

export type LandingFeature = {
  title: string;
  description: string;
  /** Optional underlined trailing link inside the description line */
  descriptionLink?: { label: string; href: string };
};

export type LandingTestimonial = {
  id: string;
  quote: string;
  name: string;
  handle: string;
  initials: string;
  /** True until replaced with real customer quotes */
  isPlaceholder: boolean;
};

export type LandingFooterColumn = {
  title: string;
  links: LandingNavLink[];
};

export const landingSite = {
  name: "Survay Go",
  tagline:
    "An AI-powered visual editor for surveys and forms—ship faster with less busywork.",
} as const;

/**
 * Top-level nav + mega-menu columns (see `LandingNav`).
 * `/docs`, `/about`, etc. are placeholders until those routes exist.
 */
export const landingNavItems = {
  mega: {
    label: "Product",
    /** Shown full-height on the right inside the mega panel */
    panelImage: {
      src: "/download.jpg",
      alt: "Tall preview of the Survay Go form builder dashboard and canvas",
    },
    columns: [
      {
        heading: "Product",
        links: [
          {
            label: "Overview",
            href: "#product",
            description: "See the builder and live preview on the homepage.",
          },
          {
            label: "Highlights",
            href: "#highlights",
            description: "AI, collaboration, and publishing in one place.",
          },
          {
            label: "Features",
            href: "#features",
            description: "Visual editor, fields, and how teams ship forms.",
          },
          {
            label: "Stories",
            href: "#testimonials",
            description: "What builders say about Survay Go.",
          },
        ],
      },
      {
        heading: "Resources",
        links: [
          {
            label: "Documentation",
            href: "/docs",
            description: "Guides, tutorials, and reference material.",
          },
          {
            label: "Changelog",
            href: "/changelog",
            description: "Product updates and release notes.",
          },
        ],
      },
    ] satisfies LandingNavMegaColumn[],
  },
  pricing: { label: "Pricing", href: "#cta" },
  /** Header bar order: About → Product (mega) → Pricing → Contact */
  about: { label: "About", href: "/about" },
  contact: { label: "Contact", href: "#cta" },
} as const;

export const landingTrustedBrands: TrustedBrandMention[] = [
  { name: "Atlas Research" },
  { name: "Harbor Health" },
  { name: "Northwind Labs" },
  { name: "Cedar Education" },
  { name: "Brightline Ops" },
  { name: "Signal Media" },
];

export const landingHero = {
  headline: "Build surveys your team actually wants to fill out.",
  subhead:
    "Design, publish, and iterate on dynamic forms with a visual builder and AI assistance—without bouncing between tools.",
  primaryCta: { label: "Start building", href: "/dashboard/new" },
  secondaryCta: { label: "See how it works", href: "#product" },
} as const;

export const landingPatternsSection = {
  title: "Find design patterns in seconds.",
  subtitle:
    "Browse polished field layouts and screen patterns you can drop into your next survey.",
} as const;

export const landingFlowsSection = {
  title: "Explore entire user journeys with flows.",
  subtitle:
    "Map onboarding, feedback, and operational flows from first touch to completion.",
  lightCard: {
    title: "Onboarding & intake",
    description: "Warm welcome steps, progressive disclosure, and clear CTAs.",
  },
  darkCard: {
    title: "Ops & messaging",
    description:
      "Status updates, approvals, and threaded follow-ups in one place.",
  },
} as const;

export type LandingBentoItem = {
  title: string;
  description: string;
};

export const landingBentoSection = {
  id: "highlights" as const,
  title: "Everything you need to ship forms faster.",
  subtitle:
    "From first sketch to live survey—Survay Go keeps layout, copy, and publishing in one calm workspace.",
  items: [
    {
      title: "AI that writes with you",
      description:
        "Draft field labels, help text, and validation messages in your brand voice, then tweak on the canvas.",
    },
    {
      title: "Live preview",
      description:
        "See exactly how respondents experience your form—desktop and mobile—without leaving the editor.",
    },
    {
      title: "Team-ready",
      description:
        "Share drafts, gather feedback, and lock versions when you are ready to publish.",
    },
    {
      title: "One link to collect",
      description:
        "Publish a secure link or embed; responses land in your dashboard for export and review.",
    },
    {
      title: "Reusable patterns",
      description:
        "Save groups of fields and screens you use often—onboarding, NPS, intake—and drop them into new forms.",
    },
  ] satisfies LandingBentoItem[],
} as const;

export const landingFeaturesSection = {
  title: "From inspiration to creation.",
  items: [
    {
      title: "Visual builder",
      description:
        "Drag, group, and reorder fields on a canvas that stays clear at any zoom, then export or publish in one click.",
      descriptionLink: { label: "Open the editor", href: "/dashboard/new" },
    },
    {
      title: "AI-assisted copy",
      description:
        "Generate labels, hints, and validation messages tuned to your audience—like a quick-save menu for every field.",
    },
    {
      title: "Share & measure",
      description:
        "Publish links, collect responses, and leave context on drafts so your team never loses the why behind a question.",
    },
  ] satisfies LandingFeature[],
} as const;

export const landingTestimonialsSection = {
  title: "What our users are saying.",
  subtitle: "Placeholder quotes until we wire up a real testimonials source.",
} as const;

export const landingTestimonials: LandingTestimonial[] = [
  {
    id: "1",
    quote:
      "We replaced three tools with Survay Go. Designers own the layout; ops owns the data.",
    name: "Alex Rivera",
    handle: "@alex_ops",
    initials: "AR",
    isPlaceholder: true,
  },
  {
    id: "2",
    quote:
      "The builder feels like a product design tool, not a spreadsheet with extra steps.",
    name: "Jordan Lee",
    handle: "@jordan_cx",
    initials: "JL",
    isPlaceholder: true,
  },
  {
    id: "3",
    quote:
      "Shipping a new intake flow used to take two sprints. Now we ship in days.",
    name: "Sam Okonkwo",
    handle: "@sam_pm",
    initials: "SO",
    isPlaceholder: true,
  },
  {
    id: "4",
    quote:
      "AI suggestions for field labels cut review time in half for our compliance forms.",
    name: "Morgan Chen",
    handle: "@morgan_legal",
    initials: "MC",
    isPlaceholder: true,
  },
];

export const landingFinalCta = {
  title: "Never run out of inspiration again.",
  subtitle: "Join teams shipping smarter forms and surveys every day.",
  cta: { label: "Get started", href: "/auth/signup" },
} as const;

export const landingFooterColumns: LandingFooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#product" },
      { label: "Highlights", href: "#highlights" },
      { label: "Features", href: "#features" },
      { label: "Stories", href: "#testimonials" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "Dashboard", href: "/dashboard/recents" },
      { label: "Sign in", href: "/auth/login" },
      { label: "Create account", href: "/auth/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "#cta" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];
