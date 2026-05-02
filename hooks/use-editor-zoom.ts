import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

const ZOOM_EPSILON = 0.001;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const ZOOM_PRESET_VALUES = [25, 50, 75, 100, 125, 150, 200];

interface UseEditorZoomParams {
  zoom: number;
  setZoom: (zoom: number) => void;
}

export function useEditorZoom({ zoom, setZoom }: UseEditorZoomParams) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const scrollAreaRootRef = useRef<HTMLDivElement | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const isDragPanningRef = useRef(false);
  const dragPanStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const zoomCommitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastCommittedZoomRef = useRef(zoom);
  const wheelZoomRafRef = useRef<number | null>(null);
  const pendingWheelDeltaRef = useRef(0);

  const getScrollViewport = useCallback(() => {
    return scrollAreaRootRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    ) as HTMLDivElement | null;
  }, []);

  const clampZoom = useCallback(
    (value: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)),
    [],
  );

  const commitZoomToStore = useCallback(
    (nextZoom: number, immediate = false) => {
      const commit = () => {
        if (Math.abs(lastCommittedZoomRef.current - nextZoom) <= ZOOM_EPSILON)
          return;
        lastCommittedZoomRef.current = nextZoom;
        setZoom(nextZoom);
      };

      if (immediate) {
        if (zoomCommitTimeoutRef.current) {
          clearTimeout(zoomCommitTimeoutRef.current);
          zoomCommitTimeoutRef.current = null;
        }
        commit();
        return;
      }

      if (zoomCommitTimeoutRef.current) {
        clearTimeout(zoomCommitTimeoutRef.current);
      }
      zoomCommitTimeoutRef.current = setTimeout(() => {
        commit();
        zoomCommitTimeoutRef.current = null;
      }, 90);
    },
    [setZoom],
  );

  const updateZoom = useCallback(
    (nextZoom: number, options?: { immediate?: boolean }) => {
      setCurrentZoom((prev) =>
        Math.abs(prev - nextZoom) <= ZOOM_EPSILON ? prev : nextZoom,
      );
      commitZoomToStore(nextZoom, options?.immediate ?? false);
    },
    [commitZoomToStore],
  );

  const applyZoom = useCallback(
    (
      nextZoom: number,
      options?: { immediate?: boolean; keepScrollPercent?: boolean },
    ) => {
      const keepScrollPercent = options?.keepScrollPercent ?? true;
      const viewport = getScrollViewport();

      let centerRatioX = 0.5;
      let centerRatioY = 0.5;

      if (keepScrollPercent && viewport) {
        const scrollWidth = Math.max(1, viewport.scrollWidth);
        const scrollHeight = Math.max(1, viewport.scrollHeight);
        centerRatioX =
          (viewport.scrollLeft + viewport.clientWidth / 2) / scrollWidth;
        centerRatioY =
          (viewport.scrollTop + viewport.clientHeight / 2) / scrollHeight;
      }

      if (transformRef.current) {
        transformRef.current.setTransform(0, 0, nextZoom);
      }
      updateZoom(nextZoom, { immediate: options?.immediate });

      if (keepScrollPercent && viewport) {
        const rx = centerRatioX;
        const ry = centerRatioY;
        const reapplyAnchor = () => {
          const maxLeft = Math.max(
            0,
            viewport.scrollWidth - viewport.clientWidth,
          );
          const maxTop = Math.max(
            0,
            viewport.scrollHeight - viewport.clientHeight,
          );
          const targetLeft =
            rx * viewport.scrollWidth - viewport.clientWidth / 2;
          const targetTop =
            ry * viewport.scrollHeight - viewport.clientHeight / 2;
          viewport.scrollLeft = Math.min(maxLeft, Math.max(0, targetLeft));
          viewport.scrollTop = Math.min(maxTop, Math.max(0, targetTop));
        };
        requestAnimationFrame(() => {
          reapplyAnchor();
          requestAnimationFrame(() => {
            reapplyAnchor();
            requestAnimationFrame(reapplyAnchor);
          });
        });
      }
    },
    [getScrollViewport, updateZoom],
  );

  const handlePanPointerDown =
    (cursorMode: "pan" | "select") =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (cursorMode !== "pan") return;
      const viewport = getScrollViewport();
      if (!viewport) return;

      isDragPanningRef.current = true;
      dragPanStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

  const handlePanPointerMove =
    (cursorMode: "pan" | "select") =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragPanningRef.current || cursorMode !== "pan") return;
      const viewport = getScrollViewport();
      if (!viewport) return;

      const deltaX = event.clientX - dragPanStartRef.current.x;
      const deltaY = event.clientY - dragPanStartRef.current.y;

      viewport.scrollLeft = dragPanStartRef.current.scrollLeft - deltaX;
      viewport.scrollTop = dragPanStartRef.current.scrollTop - deltaY;
    };

  const handlePanPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragPanningRef.current) return;
    isDragPanningRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const getClosestZoomValue = (value: number) => {
    const currentPercent = Math.round(value * 100);
    const closest = ZOOM_PRESET_VALUES.reduce((prev, curr) =>
      Math.abs(curr - currentPercent) < Math.abs(prev - currentPercent)
        ? curr
        : prev,
    );
    return closest.toString();
  };

  const handleZoomChange = (value: string) => {
    const newZoom = parseInt(value, 10) / 100;
    applyZoom(newZoom, { immediate: true, keepScrollPercent: true });
  };

  const handleResetZoom = () => {
    applyZoom(1, { immediate: true, keepScrollPercent: false });
    const viewport = getScrollViewport();
    if (!viewport) return;

    const centerViewport = () => {
      const maxLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      viewport.scrollLeft = maxLeft / 2;
      viewport.scrollTop = 0;
    };

    centerViewport();
    requestAnimationFrame(centerViewport);
    setTimeout(centerViewport, 0);
  };

  useEffect(() => {
    if (Math.abs(currentZoom - zoom) <= ZOOM_EPSILON) return;
    lastCommittedZoomRef.current = zoom;
    setCurrentZoom(zoom);
  }, [zoom, currentZoom]);

  useEffect(() => {
    return () => {
      if (zoomCommitTimeoutRef.current) {
        clearTimeout(zoomCommitTimeoutRef.current);
      }
      if (wheelZoomRafRef.current !== null) {
        cancelAnimationFrame(wheelZoomRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const viewport = getScrollViewport();
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();

      pendingWheelDeltaRef.current += event.deltaY;
      if (wheelZoomRafRef.current !== null) return;

      wheelZoomRafRef.current = requestAnimationFrame(() => {
        wheelZoomRafRef.current = null;
        const deltaY = pendingWheelDeltaRef.current;
        pendingWheelDeltaRef.current = 0;

        const currentScale = transformRef.current?.state?.scale ?? currentZoom;
        const zoomDelta = -deltaY * 0.0015;
        const nextZoom = clampZoom(currentScale + zoomDelta);
        if (Math.abs(nextZoom - currentScale) <= ZOOM_EPSILON) return;

        applyZoom(nextZoom);
      });
    };

    viewport.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
    return () => {
      viewport.removeEventListener("wheel", onWheel, true);
    };
  }, [applyZoom, clampZoom, currentZoom, getScrollViewport]);

  return {
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
  };
}
