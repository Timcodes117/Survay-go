"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPencilCog,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PencilRuler, Users2, X } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Assets",
      url: "/dashboard/assets",
      icon: IconFolder,
    },
    {
      title: "People",
      url: "/dashboard/people",
      icon: Users2,
    },
   
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

type SidebarModalKey = "assets" | "people"

function AssetsModalContent() {
  return (
    <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
      Assets modal content placeholder. Build your asset picker, folders, and uploads here.
    </div>
  )
}

function ContactsModalContent() {
  return (
    <div className="rounded-xl border bg-card p-5 text-sm text-muted-foreground">
      Contacts modal content placeholder. Build your team, roles, and invite workflow here.
    </div>
  )
}

const sidebarModalRegistry: Record<
  SidebarModalKey,
  {
    title: string
    description: string
    Content: React.ComponentType
  }
> = {
  assets: {
    title: "Assets",
    description: "Manage reusable files, media, and resources for your forms.",
    Content: AssetsModalContent,
  },
  people: {
    title: "Contacts",
    description: "Manage collaborators, contacts, and workspace access.",
    Content: ContactsModalContent,
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeModal, setActiveModal] = React.useState<SidebarModalKey | null>(null)
  const activeModalConfig = activeModal ? sidebarModalRegistry[activeModal] : null

  React.useEffect(() => {
    if (!activeModal) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveModal(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeModal])

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        className="border-0 group-data-[side=left]:border-0 group-data-[side=right]:border-0"
        style={{
          ["--sidebar" as any]: "transparent",
          ["--sidebar-border" as any]: "transparent",
        } as React.CSSProperties}
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-2.5 my-2"
              >
                <a href="#">
                  <span className="text-3xl  !font-[TurretRoad]">Survay Go</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
          <ScrollArea className="flex flex-1 h-[500px] pr-2 w-full overflow-x-hidden">
        <SidebarContent>
          <NavMain
            items={data.navMain}
            onItemSelect={(item) => {
              const key = item.title.toLowerCase()
              if (key === "assets") {
                setActiveModal("assets")
                return true
              }
              if (key === "people" || key === "contacts") {
                setActiveModal("people")
                return true
              }
              return false
            }}
          />
          <NavDocuments items={data.documents} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
          </ScrollArea>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {activeModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setActiveModal(null)}
          />
          <div className="relative flex h-[min(86vh,820px)] w-full max-w-5xl flex-col rounded-2xl border bg-background p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4 shrink-0">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {activeModalConfig?.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeModalConfig?.description}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setActiveModal(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-accent"
              >
                <X size={16} />
              </button>
            </div>
            <ScrollArea className="min-h-0 flex-1 pr-2">
              {activeModalConfig ? <activeModalConfig.Content /> : null}
            </ScrollArea>
          </div>
        </div>
      )}
    </>
  )
}
