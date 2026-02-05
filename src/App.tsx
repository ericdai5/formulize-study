import { useEffect, useRef } from "react";

// TypeScript declaration for MathJax (loaded via CDN in index.html)
declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      typeset: (elements?: HTMLElement[]) => void;
      startup?: {
        promise: Promise<void>;
      };
    };
  }
}

// Component that renders the kinetic energy formula using MathJax
// To make this dynamic, you can pass variables as props and include them in the latex string
// Example: const latex = String.raw`K = \frac{1}{2}(${m})(${v})^2 = ${K}`;
function KineticEnergyFormula() {
  const formulaRef = useRef<HTMLDivElement>(null);
  const latex = String.raw`K = \frac{1}{2}mv^2`;

  useEffect(() => {
    const doTypeset = async () => {
      if (!formulaRef.current) return;
      formulaRef.current.innerHTML = `$$${latex}$$`;
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([formulaRef.current]);
      }
    };
    doTypeset();
  }, [latex]);

  return (
    <div
      ref={formulaRef}
      className="flex justify-center"
      style={{ fontSize: "2rem" }}
    />
  );
}

function App() {
  // TODO: Add state variables for mass (m) and velocity (v)
  // TODO: Compute kinetic energy K = 0.5 * m * v^2
  // TODO: Add slider inputs and display values

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Kinetic Energy Formula</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6 w-full max-w-4xl">
        <KineticEnergyFormula />
      </div>

      {/* TODO: Add sliders and value displays here */}

      {/* TODO: Add 2D plot here (D3.js is available) */}
    </div>
  );
}

export default App;
