"use client";

import type React from "react";
import Tabs from "@/components/form/tabs";

export default function FormWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col w-full overflow-hidden">
      <Tabs />
      {children}
    </div>
  );
}
