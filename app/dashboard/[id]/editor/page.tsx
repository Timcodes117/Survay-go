"use client";

import { AlertCircle, File, Fullscreen, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import EditableElementContainer from "@/components/editable/container";
import FloatingToolBar from "@/components/tools/toolbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/app";
import { useEditorZoom } from "@/hooks/use-editor-zoom";

export default function EditorPage() {
  const {
    zoom,
    setZoom,
    formPages,
    currentPageId,
    setCurrentPageId,
    cursorMode,
    selectedElementId,
    setSelectedElementId,
    canvasScrollTargetPageId,
    consumeCanvasScrollTarget,
    validationErrors,
    validationWarnings,
    clearValidationIssues,
  } = useApp();
  const {
    MIN_ZOOM,
    MAX_ZOOM,
    transformRef,
    scrollAreaRootRef,
    currentZoom,
    updateZoom,
    getClosestZoomValue,
    handleZoomChange,
    handleResetZoom,
    handlePanPointerDown,
    handlePanPointerMove,
    handlePanPointerUp,
  } = useEditorZoom({ zoom, setZoom });
  const pageRefs = useRef<Record<string, HTMLElement | null>>({});
  const visibilityRatiosRef = useRef<Record<string, number>>({});
  const canvasMeasureRef = useRef<HTMLDivElement>(null);
  const [canvasContentHeight, setCanvasContentHeight] = useState(0);

  useEffect(() => {
    const el = canvasMeasureRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const box = entry.borderBoxSize?.[0];
      const height = Math.ceil(
        box?.blockSize ?? entry.contentRect.height ?? el.offsetHeight,
      );
      setCanvasContentHeight((prev) => {
        if (prev === height) return prev;
        if (prev > 0 && Math.abs(prev - height) < 8) return prev;
        return height;
      });
    });

    observer.observe(el, { box: "border-box" });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!formPages?.length) return;

    const setupObserver = () => {
      const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.pageId;
            if (!id) continue;
            visibilityRatiosRef.current[id] = entry.intersectionRatio;
          }

          let bestId: string | null = null;
          let bestRatio = 0;
          for (const id of Object.keys(visibilityRatiosRef.current)) {
            const ratio = visibilityRatiosRef.current[id] ?? 0;
            if (ratio >= 0.6 && ratio >= bestRatio) {
              bestRatio = ratio;
              bestId = id;
            }
          }

          if (!bestId) {
            for (const id of Object.keys(visibilityRatiosRef.current)) {
              const ratio = visibilityRatiosRef.current[id] ?? 0;
              if (ratio >= bestRatio) {
                bestRatio = ratio;
                bestId = id;
              }
            }
          }

          if (bestId) {
            setCurrentPageId(bestId);
          }
        },
        { threshold: thresholds },
      );

      formPages.forEach((p) => {
        const el = document.querySelector(
          `[data-page-id="${p.id}"]`,
        ) as HTMLElement;
        if (el) observer.observe(el);
      });

      return observer;
    };

    let observer: IntersectionObserver | null = null;
    const timeoutId = setTimeout(() => {
      observer = setupObserver();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
      visibilityRatiosRef.current = {};
    };
  }, [formPages, setCurrentPageId]);

  useEffect(() => {
    if (!selectedElementId) return;
    const target = document.querySelector(
      `[data-element-id="${selectedElementId}"]`,
    ) as HTMLElement | null;
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedElementId]);

  useEffect(() => {
    if (!canvasScrollTargetPageId) return;
    const pageId = canvasScrollTargetPageId;
    const timeoutId = window.setTimeout(() => {
      const node = document.querySelector(
        `[data-page-id="${pageId}"]`,
      ) as HTMLElement | null;
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      consumeCanvasScrollTarget();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [canvasScrollTargetPageId, consumeCanvasScrollTarget]);

  const scaledMinHeightPx =
    canvasContentHeight > 0
      ? Math.ceil(canvasContentHeight * currentZoom) + 1
      : null;

  return (
    <>
      {(validationErrors.length > 0 || validationWarnings.length > 0) && (
        <div className="px-6 pt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Form validation issues detected</AlertTitle>
            <AlertDescription>
              <div className="space-y-1">
                {validationErrors.slice(0, 3).map((issue, index) => (
                  <p key={`error-${issue.code}-${index}`} className="text-xs">
                    Error: {issue.message}
                  </p>
                ))}
                {validationWarnings.slice(0, 3).map((issue, index) => (
                  <p key={`warning-${issue.code}-${index}`} className="text-xs">
                    Warning: {issue.message}
                  </p>
                ))}
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearValidationIssues}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <div
          ref={scrollAreaRootRef}
          className={`min-h-0 w-full flex-1 ${cursorMode === "pan" ? "cursor-grab active:cursor-grabbing" : ""}`}
          onClick={() => setSelectedElementId(null)}
          onPointerDown={handlePanPointerDown(cursorMode)}
          onPointerMove={handlePanPointerMove(cursorMode)}
          onPointerUp={handlePanPointerUp}
          onPointerCancel={handlePanPointerUp}
        >
          <ScrollArea className="w-full h-full">
            <TransformWrapper
              ref={transformRef}
              initialScale={currentZoom}
              initialPositionX={0}
              initialPositionY={0}
              minScale={MIN_ZOOM}
              maxScale={MAX_ZOOM}
              centerOnInit={false}
              alignmentAnimation={{ disabled: true }}
              wheel={{ disabled: true }}
              doubleClick={{ disabled: true }}
              panning={{ disabled: true }}
              onZoom={(ref) => {
                updateZoom(ref.state.scale);
              }}
              onInit={(ref) => {
                transformRef.current = ref;
                const s = ref.state.scale;
                ref.setTransform(0, 0, s);
                requestAnimationFrame(() => ref.setTransform(0, 0, s));
              }}
            >
              <TransformComponent
                wrapperClass="box-border flex size-full min-h-full justify-center"
                contentClass="box-border flex !flex-wrap-nowrap w-full max-w-full min-h-full shrink-0 flex-col items-center gap-20"
                contentStyle={{ transformOrigin: "50% 0%" }}
                wrapperStyle={{
                  width: "100%",
                  minWidth: "100%",
                  minHeight: scaledMinHeightPx
                    ? `max(100%, ${scaledMinHeightPx}px)`
                    : "100%",
                }}
              >
                <div
                  ref={canvasMeasureRef}
                  className="flex w-fit max-w-full min-h-full shrink-0 flex-col items-center gap-20"
                >
                  <div className="w-full h-[50px]" />
                  {formPages.map((page) => (
                    <div
                      key={page.id}
                      ref={(el) => {
                        pageRefs.current[page.id] = el;
                      }}
                      data-page-id={page.id}
                      className="relative mx-auto mb-10 w-[595px] max-w-[595px] min-h-[842px] scroll-mt-20 space-y-6 border-[0.5px] bg-background p-8 shadow-2xl"
                    >
                      <div className="px-3 py-1 bg-gray-400/20 absolute -top-8 left-0 rounded-md w-fit text-xs text-muted-foreground flex flex-row items-center gap-1">
                        <File className="size-3" />
                        <p className="text-muted-foreground truncate max-w-[400px]">
                          Page {page.order} of {formPages.length}
                          {currentPageId === page.id ? " (current)" : ""} •{" "}
                          {page.alias}
                        </p>
                      </div>
                      {page.elements.map((element) => (
                        <EditableElementContainer
                          key={element.id}
                          pageId={page.id}
                          element={element}
                        />
                      ))}
                      {page.elements.length === 0 && (
                        <div className="flex min-h-[680px] items-center justify-center rounded-lg border border-dashed border-border/70 text-sm text-muted-foreground">
                          Empty page. Add elements from the sidebar or toolbar.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>
          </ScrollArea>
        </div>
      </div>

      <FloatingToolBar />

      <div className="absolute top-5 right-10 w-fit !h-[35px] rounded-2xl shadow-md border-[0.5px] backdrop-blur-lg bg-white/10">
        <div className="flex items-center justify-between w-full h-full">
          <button
            type="button"
            onClick={handleResetZoom}
            className="flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:bg-white/10 transition-colors"
          >
            <Fullscreen size={18} />
          </button>
          <div className="h-4 w-px bg-sidebar-border" />
          <div className="flex items-center justify-center w-8 h-10 rounded-full text-foreground">
            <ZoomIn size={18} />
          </div>

          <Select
            value={getClosestZoomValue(currentZoom)}
            onValueChange={handleZoomChange}
          >
            <SelectTrigger className="w-[80px] !text-xs h-10 rounded-full !border-none !bg-transparent !shadow-none">
              <SelectValue placeholder="Zoom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
              <SelectItem value="200">200%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
