import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup?: { promise: Promise<void> };
    };
  }
}

// ============================================
// VARIABLE CONFIGURATION
// ============================================

const velocityConfig = {
  id: "var-v",
  name: "Velocity",
  unit: "m/s",
  min: 0.1,
  max: 10,
};

const kineticEnergyConfig = {
  id: "var-K",
  name: "Kinetic Energy",
  unit: "J",
};

// ============================================
// LABEL COMPONENT
// Displays a variable's current value below or above the formula.
// Hovering the label also highlights the formula variable.
// ============================================

function VariableLabel({
  value,
  unit,
  name,
  position,
  isHovered,
  onHover,
  onDrag,
  placement = "below",
}: {
  value: number;
  unit: string;
  name: string;
  position: { top: number; left: number };
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onDrag?: (delta: number) => void;
  placement?: "above" | "below";
}) {
  const isDragging = useRef(false);
  const lastY = useRef(0);

  // Global mousemove/mouseup for label drag
  useEffect(() => {
    if (!onDrag) return;
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = (lastY.current - e.clientY) * 0.05;
      lastY.current = e.clientY;
      onDrag(delta);
    };
    const handleUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        onHover(false);
      }
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [onDrag, onHover]);

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        top: position.top,
        left: position.left,
        transform: placement === "above" ? "translateX(-50%) translateY(-100%)" : "translateX(-50%)",
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => { if (!isDragging.current) onHover(false); }}
    >
      <div className="px-3 py-1 rounded-md border border-slate-300 bg-white">
        <span
          className={isHovered ? "text-blue-600" : "text-slate-700"}
          style={{
            fontFamily: "KaTeX_Main, serif",
            fontSize: "1.1rem",
            display: "inline-block",
            transition: "transform 0.2s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            cursor: onDrag ? "ns-resize" : "default",
            userSelect: "none",
          }}
          onMouseDown={(e) => {
            if (!onDrag) return;
            isDragging.current = true;
            lastY.current = e.clientY;
            e.preventDefault();
          }}
        >
          {value.toFixed(1)}
        </span>
        <span className="text-slate-500 ml-1" style={{ fontSize: "0.9rem" }}>{unit}</span>
      </div>
      <div className="text-xs text-slate-500 mt-1">{name}</div>
    </div>
  );
}

// ============================================
// HIT AREA OVERLAY
// Invisible div positioned over each formula variable to
// provide a hover target and drag-to-change interaction.
// ============================================

const HIT_AREA_PADDING = 12;

function VariableHitArea({
  elementId,
  containerRef,
  isInput,
  isHovered,
  onHover,
  onDrag,
  deps,
}: {
  elementId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isInput: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onDrag?: (delta: number) => void;
  deps: unknown[];
}) {
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  // Position the overlay over the MathJax-rendered variable
  useEffect(() => {
    const update = () => {
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
    };
    const timer = setTimeout(update, 150);
    return () => clearTimeout(timer);
  }, [elementId, containerRef, ...deps]);

  // Handle drag globally so the cursor can leave the hit area while dragging
  useEffect(() => {
    if (!isInput || !onDrag) return;
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = (lastY.current - e.clientY) * 0.05;
      lastY.current = e.clientY;
      onDrag(delta);
    };
    const handleUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        onHover(false);
      }
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isInput, onDrag, onHover]);

  // Apply hover color to the SVG element in the formula
  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.style.transition = "color 0.2s ease";
    el.style.color = isHovered && isInput ? "#2563eb" : "";
  }, [elementId, isHovered, isInput]);

  if (!rect) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        cursor: isInput ? "ns-resize" : "default",
        zIndex: 10,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => { if (!isDragging.current) onHover(false); }}
      onMouseDown={(e) => {
        if (!isInput || !onDrag) return;
        isDragging.current = true;
        lastY.current = e.clientY;
        e.preventDefault();
      }}
    />
  );
}

// ============================================
// LABEL POSITION HOOK
// Returns the position of a formula variable
// relative to its container, for placing labels.
// ============================================

function useLabelPosition(elementId: string, containerRef: React.RefObject<HTMLDivElement | null>, deps: unknown[], placement: "above" | "below" = "below") {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const el = document.getElementById(elementId);
      const container = containerRef.current;
      if (!el || !container) return;

      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      setPosition({
        top: placement === "above"
          ? elRect.top - containerRect.top - 20
          : elRect.bottom - containerRect.top + 12,
        left: elRect.left - containerRect.left + elRect.width / 2,
      });
    };

    const timer = setTimeout(updatePosition, 150);
    return () => clearTimeout(timer);
  }, [elementId, containerRef, placement, ...deps]);

  return position;
}

// ============================================
// MAIN APP
// ============================================

function App() {
  // Variable state
  const [v, setV] = useState(2);
  const [vHovered, setVHovered] = useState(false);

  const [kHovered, setKHovered] = useState(false);

  // Computed values
  const m = 1;
  const K = 0.5 * m * v * v;

  // Formula rendering
  const formulaRef = useRef<HTMLDivElement>(null);
  const latex = String.raw`\cssId{var-K}{K} = \frac{1}{2} m \cssId{var-v}{v}^2`;

  useEffect(() => {
    const render = async () => {
      if (!formulaRef.current) return;
      formulaRef.current.innerHTML = `$$${latex}$$`;
      await window.MathJax?.startup?.promise;
      await window.MathJax?.typesetPromise?.([formulaRef.current]);
    };
    render();
  }, [latex]);

  // Label positions
  const vPos = useLabelPosition(velocityConfig.id, formulaRef, [v]);
  const kPos = useLabelPosition(kineticEnergyConfig.id, formulaRef, [K]);

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Kinetic Energy Formula</h1>

      <div className="bg-white rounded-lg shadow p-6 w-full max-w-4xl">
        <div ref={formulaRef} className="relative flex justify-center" style={{ fontSize: "2rem", minHeight: "200px", paddingBottom: "70px" }}>

          {/* Hit areas for hover + drag interaction */}
          <VariableHitArea
            elementId={velocityConfig.id}
            containerRef={formulaRef}
            isInput={true}
            isHovered={vHovered}
            onHover={setVHovered}
            onDrag={(delta) => setV((prev) => Math.max(velocityConfig.min, Math.min(velocityConfig.max, prev + delta)))}
            deps={[v]}
          />

          <VariableHitArea
            elementId={kineticEnergyConfig.id}
            containerRef={formulaRef}
            isInput={false}
            isHovered={kHovered}
            onHover={setKHovered}
            deps={[K]}
          />

          {/* Variable labels */}
          {vPos && (
            <VariableLabel
              value={v}
              unit={velocityConfig.unit}
              name={velocityConfig.name}
              position={vPos}
              isHovered={vHovered}
              onHover={setVHovered}
              onDrag={(delta) => setV((prev) => Math.max(velocityConfig.min, Math.min(velocityConfig.max, prev + delta)))}
            />
          )}

          {kPos && (
            <VariableLabel
              value={K}
              unit={kineticEnergyConfig.unit}
              name={kineticEnergyConfig.name}
              position={kPos}
              isHovered={kHovered}
              onHover={setKHovered}
            />
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Drag <span className="text-blue-600 font-medium">v</span> in the formula to change velocity
      </p>
    </div>
  );
}

export default App;
