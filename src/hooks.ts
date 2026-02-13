/**
 * Custom Hooks for Formula Variables
 *
 * Study participants do NOT need to edit this file.
 */

import { useState, useCallback } from "react";

// ============================================
// LABEL RECTS HOOK
// Tracks label positions for connecting lines.
// Returns [labelRects, handleLabelPosition] tuple.
// ============================================

export function useLabelRects(): [
  Record<string, DOMRect | null>,
  (id: string, rect: DOMRect) => void,
] {
  const [labelRects, setLabelRects] = useState<Record<string, DOMRect | null>>(
    {},
  );

  const handleLabelPosition = useCallback((id: string, rect: DOMRect) => {
    setLabelRects((prev) => {
      // Only update if position actually changed
      const prevRect = prev[id];
      if (
        prevRect &&
        Math.abs(prevRect.left - rect.left) < 1 &&
        Math.abs(prevRect.top - rect.top) < 1
      ) {
        return prev;
      }
      return { ...prev, [id]: rect };
    });
  }, []);

  return [labelRects, handleLabelPosition];
}
