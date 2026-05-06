import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Brief UI highlight (e.g. sidebar row) that clears after `durationMs`.
 */
export function useTransientFlash(durationMs = 720) {
  const [targets, setTargets] = useState<{
    elementId?: string;
    pageId?: string;
  }>({});
  const timerRef = useRef<number | undefined>(undefined);

  const pulse = useCallback(
    (next: { elementId?: string; pageId?: string }) => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
      }
      setTargets(next);
      timerRef.current = window.setTimeout(() => {
        setTargets({});
        timerRef.current = undefined;
      }, durationMs);
    },
    [durationMs],
  );

  useEffect(
    () => () => {
      if (timerRef.current !== undefined) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return { targets, pulse };
}
