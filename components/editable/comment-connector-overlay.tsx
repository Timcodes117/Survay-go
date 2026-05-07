"use client";

import type * as React from "react";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

export function CommentConnectorOverlay({
  anchorRef,
  panelRef,
  open,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  panelRef: React.RefObject<HTMLElement | null>;
  open: boolean;
}) {
  const [path, setPath] = useState("");

  useLayoutEffect(() => {
    if (!open || typeof document === "undefined") {
      setPath("");
      return;
    }

    let rafId = 0;
    let attempts = 0;

    const paint = (): boolean => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return false;
      const pr = anchor.getBoundingClientRect();
      const er = panel.getBoundingClientRect();
      /** Panel opens to the right of the pin; nudge start/end outward for a slightly longer dashed segment */
      const extendAlongLine = 16;
      const x1 = pr.right - extendAlongLine;
      const y1 = pr.top + pr.height / 2;
      const x2 = er.left + extendAlongLine;
      const y2 = er.top + Math.min(72, Math.max(28, er.height * 0.14));
      setPath(`M ${x1} ${y1} L ${x2} ${y2}`);
      return true;
    };

    const kick = () => {
      attempts++;
      if (paint() || attempts > 120) return;
      rafId = requestAnimationFrame(kick);
    };

    kick();

    const onMove = () => {
      paint();
    };

    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onMove)
        : null;
    const a = anchorRef.current;
    const p = panelRef.current;
    if (a) ro?.observe(a);
    if (p) ro?.observe(p);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
      ro?.disconnect();
    };
  }, [open, anchorRef, panelRef]);

  if (!open || !path || typeof document === "undefined") return null;

  return createPortal(
    <svg className="pointer-events-none fixed inset-0 z-[215]" aria-hidden>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeDasharray="5 6"
        vectorEffect="non-scaling-stroke"
        className="text-muted-foreground/85"
      />
    </svg>,
    document.body,
  );
}
