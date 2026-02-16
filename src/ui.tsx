/**
 * UI Components for Formula Variables
 *
 * These components handle the interactive display of formula variables.
 * Study participants do NOT need to edit this file.
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
  type ReactNode,
} from "react";

// ============================================
// FORMULA CONTAINER CONTEXT
// Provides container ref to child components automatically.
// ============================================

interface FormulaContextValue {
  containerRef: React.RefObject<HTMLDivElement | null>;
  labelRects: Record<string, DOMRect | null>;
  reportLabelPosition: (id: string, rect: DOMRect) => void;
}

const FormulaContainerContext = createContext<FormulaContextValue | null>(null);

function useFormulaContext() {
  const context = useContext(FormulaContainerContext);
  if (!context) {
    throw new Error("Component must be used within a FormulaContainer");
  }
  return context;
}

export function FormulaContainer({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [labelRects, setLabelRects] = useState<Record<string, DOMRect | null>>(
    {},
  );

  const reportLabelPosition = useCallback((id: string, rect: DOMRect) => {
    setLabelRects((prev) => ({ ...prev, [id]: rect }));
  }, []);

  const contextValue = useMemo(
    () => ({ containerRef, labelRects, reportLabelPosition }),
    [labelRects, reportLabelPosition],
  );

  return (
    <FormulaContainerContext.Provider value={contextValue}>
      <div ref={containerRef} className={className} style={style}>
        {children}
      </div>
    </FormulaContainerContext.Provider>
  );
}

// ============================================
// MATHJAX FORMULA RENDERER
// ============================================

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup?: { promise: Promise<void> };
    };
  }
}

export function Formula({ latex }: { latex: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (!ref.current) return;
      ref.current.innerHTML = `$$${latex}$$`;
      await window.MathJax?.startup?.promise;
      await window.MathJax?.typesetPromise?.([ref.current]);
    };
    render();
  }, [latex]);

  return <div ref={ref} />;
}

// ============================================
// SHARED HOOKS
// ============================================

// Hook for drag-to-change interaction (per-pixel)
function useDrag(
  onDrag: ((delta: number) => void) | undefined,
  onHover: (hovered: boolean) => void,
) {
  const isDragging = useRef(false);
  const lastY = useRef(0);
  const onDragRef = useRef(onDrag);
  const onHoverRef = useRef(onHover);

  // Keep refs up to date
  onDragRef.current = onDrag;
  onHoverRef.current = onHover;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current || !onDragRef.current) return;
      const delta = lastY.current - e.clientY;
      lastY.current = e.clientY;
      if (delta !== 0) onDragRef.current(delta);
    };

    const handleUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        onHoverRef.current(false);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    if (!onDragRef.current) return;
    isDragging.current = true;
    lastY.current = e.clientY;
    e.preventDefault();
  };

  return { isDragging, startDrag };
}

// ============================================
// LABEL COMPONENT (Flow-based, not absolute)
// Displays a variable's current value in normal document flow.
// Reports its position via callback for connecting line drawing.
// ============================================

// ============================================
// LATEX LABEL COMPONENT
// Renders text as LaTeX, wrapping in \text{} by default
// Triggers math mode only if LaTeX commands are detected
// ============================================

function LatexLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = async () => {
      if (!ref.current) return;
      // If the text contains LaTeX commands (backslash), use it as-is
      // Otherwise, wrap it in \text{...}
      const latex = children.includes("\\") ? children : `\\text{${children}}`;
      ref.current.innerHTML = `\\(${latex}\\)`;
      await window.MathJax?.startup?.promise;
      await window.MathJax?.typesetPromise?.([ref.current]);
    };
    render();
  }, [children]);

  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }} />
  );
}

export function VariableLabel({
  elementId,
  value,
  name,
  isHovered,
  onHover,
  onChange,
  min,
  max,
  step = 0.1,
}: {
  elementId: string;
  value: number;
  name: string;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const labelRef = useRef<HTMLDivElement>(null);
  const { reportLabelPosition } = useFormulaContext();

  const handleDrag = onChange
    ? (delta: number) => {
        const direction = delta > 0 ? 1 : -1;
        let newValue = value + direction * step;
        if (min !== undefined) newValue = Math.max(min, newValue);
        if (max !== undefined) newValue = Math.min(max, newValue);
        onChange(newValue);
      }
    : undefined;

  const { isDragging, startDrag } = useDrag(handleDrag, onHover);

  // Report position when value changes (after paint)
  useEffect(() => {
    if (!labelRef.current) return;
    const frame = requestAnimationFrame(() => {
      if (labelRef.current) {
        reportLabelPosition(
          elementId,
          labelRef.current.getBoundingClientRect(),
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [elementId, reportLabelPosition, value]);

  return (
    <div
      ref={labelRef}
      className="flex flex-col items-center"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => {
        if (!isDragging.current) onHover(false);
      }}
    >
      <div className="px-2 py-0.5 rounded-md bg-white flex items-center">
        <span
          className={isHovered ? "text-blue-600" : "text-black"}
          style={{
            fontFamily: "KaTeX_Main, serif",
            fontSize: "1.1rem",
            lineHeight: 1,
            display: "inline-block",
            transition: "transform 0.2s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            cursor: onChange ? "ns-resize" : "default",
            userSelect: "none",
          }}
          onMouseDown={startDrag}
        >
          {value.toFixed(1)}
        </span>
      </div>
      <div className="text-xs" style={{ color: "black" }}>
        <LatexLabel>{name}</LatexLabel>
      </div>
    </div>
  );
}

// ============================================
// CONNECTING LINES OVERLAY
// Draws SVG bezier curves connecting formula variables to their labels.
// ============================================

export function ConnectingLines() {
  const { containerRef, labelRects } = useFormulaContext();
  const [paths, setPaths] = useState<string[]>([]);

  const updatePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newPaths: string[] = [];

    for (const [elementId, labelRect] of Object.entries(labelRects)) {
      if (!labelRect) continue;

      const el = document.getElementById(elementId);
      if (!el) continue;

      const elRect = el.getBoundingClientRect();

      // Start point: bottom center of formula variable
      const startX = elRect.left - containerRect.left + elRect.width / 2;
      const startY = elRect.bottom - containerRect.top;

      // End point: top center of label
      const endX = labelRect.left - containerRect.left + labelRect.width / 2;
      const endY = labelRect.top - containerRect.top;

      // Bezier curve
      const midY = (startY + endY) / 2;
      newPaths.push(
        `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`,
      );
    }

    setPaths(newPaths);
  }, [labelRects, containerRef]);

  // Update when labelRects change
  // Use requestAnimationFrame to retry after MathJax renders
  useEffect(() => {
    updatePaths();
    const frame = requestAnimationFrame(updatePaths);
    return () => cancelAnimationFrame(frame);
  }, [labelRects, updatePaths]);

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {paths.map((path, i) => (
        <path key={i} d={path} fill="none" stroke="#cbd5e1" strokeWidth={1} />
      ))}
    </svg>
  );
}

// ============================================
// HIT AREA OVERLAY
// Invisible div positioned over each formula variable to
// provide a hover target and drag-to-change interaction.
// ============================================

const HIT_AREA_PADDING = 0;

export function VariableHitArea({
  elementId,
  isHovered,
  onHover,
  value,
  onChange,
  min,
  max,
  step = 0.1,
}: {
  elementId: string;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const { containerRef } = useFormulaContext();
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const handleDrag =
    onChange && value !== undefined
      ? (delta: number) => {
          const direction = delta > 0 ? 1 : -1;
          let newValue = value + direction * step;
          if (min !== undefined) newValue = Math.max(min, newValue);
          if (max !== undefined) newValue = Math.min(max, newValue);
          onChange(newValue);
        }
      : undefined;

  const { isDragging, startDrag } = useDrag(handleDrag, onHover);

  // Position the overlay over the MathJax-rendered variable
  const updateRect = useCallback(() => {
    const el = document.getElementById(elementId);
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setRect({
      top: eRect.top - cRect.top - HIT_AREA_PADDING,
      left: eRect.left - cRect.left - HIT_AREA_PADDING,
      width: eRect.width + HIT_AREA_PADDING * 2,
      height: eRect.height + HIT_AREA_PADDING * 2,
    });
  }, [elementId, containerRef]);

  useEffect(() => {
    let cancelled = false;
    // MathJax renders asynchronously, so poll until element exists
    const checkForElement = () => {
      if (cancelled) return;
      const el = document.getElementById(elementId);
      if (el) {
        updateRect();
      } else {
        requestAnimationFrame(checkForElement);
      }
    };
    checkForElement();
    return () => {
      cancelled = true;
    };
  }, [updateRect, elementId]);

  // Apply hover color and scale to the element in the formula
  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.style.transition = "color 0.2s ease, transform 0.2s ease";
    el.style.color = isHovered ? "#2563eb" : "";
    el.style.transform = isHovered ? "scale(1.15)" : "scale(1)";
    el.style.transformOrigin = "center center";
    el.style.display = "inline-block";
  }, [elementId, isHovered]);

  if (!rect) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        cursor: onChange ? "ns-resize" : "default",
        zIndex: 10,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => {
        if (!isDragging.current) onHover(false);
      }}
      onMouseDown={startDrag}
    />
  );
}
