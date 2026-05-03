"use client";

import { IconCoins } from "@tabler/icons-react";
import {
  ChevronsUpDown,
  Cog,
  CoinsIcon,
  Edit2,
  Redo2,
  Share,
  Undo2,
  Users,
} from "lucide-react";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import ChatPanel from "@/components/chat/panel";
import PropertiesPanel from "@/components/inspector/properties-panel";
import { ThemeToggle, ThemeToggleButtons } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppProvider, useApp } from "@/contexts/app";

function RightRail() {
  const { rightPanelTab } = useApp();

  return (
    <div className="flex min-h-0 w-[350px] min-w-[350px] border-l overflow-hidden">
      <div className="min-h-0 h-full w-full overflow-hidden">
        {rightPanelTab === "properties" ? <PropertiesPanel /> : <ChatPanel />}
      </div>
    </div>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { undo, redo, canUndo, canRedo } = useApp();

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppProvider>
        <AppSidebar />
        <SidebarInset className="flex h-full min-h-0 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-sidebar-border" />
              <h1 className="text-lg font-semibold flex items-center gap-3">
                Dashboard <span>/</span>{" "}
                <p className=" text-sm font-medium "> untitled</p>
              </h1>
            </div>

            <div className="flex items-center gap-2 px-4">
              <div className="flex items-center gap-2 px-4">
                <Button
                  variant={"ghost"}
                  className="rounded-full min-h-4"
                  onClick={undo}
                  disabled={!canUndo}
                  aria-label="Undo"
                >
                  <Undo2 size={14} />
                </Button>

                <Button
                  variant={"ghost"}
                  className="rounded-full min-h-4"
                  onClick={redo}
                  disabled={!canRedo}
                  aria-label="Redo"
                >
                  <Redo2 size={14} />
                </Button>
              </div>
              <div className="h-4 w-px bg-sidebar-border" />

              <div className="flex items-center gap-2 px-4">
                <IconCoins size={20} />
                <p className="text-sm">AI Credits: 10</p>
              </div>
              <Button
                variant={"default"}
                className="rounded-full min-h-4 !text-white "
              >
                Publish <ChevronsUpDown size={14} />{" "}
              </Button>
              <div className="h-4 w-px bg-sidebar-border" />

              <ThemeToggleButtons />
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-row w-full !p-0 overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto pt-0">
              {children}
            </div>
            <RightRail />
          </div>
        </SidebarInset>
      </AppProvider>
    </SidebarProvider>
  );
}

export default DashboardLayout;
