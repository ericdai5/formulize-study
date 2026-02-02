import { useState, useEffect, useRef } from "react";

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

interface Step {
  descriptionLatex: string;
  values: [string, number | number[]][];
}

interface VariableState {
  xbar: number | null;
  n: number | null;
  i: number | null;
  xi: number | null;
  X: number[];
  sum: number | null;
}

const variableConfig: Record<
  string,
  { name: string; id: string; latex: string }
> = {
  xbar: { name: "Average", id: "var-xbar", latex: String.raw`\bar{X}` },
  n: { name: "Count", id: "var-n", latex: "n" },
  i: { name: "Index", id: "var-i", latex: "i" },
  xi: { name: "Value at i", id: "var-xi", latex: "X_i" },
  X: { name: "Data values", id: "var-X", latex: "X" },
  sum: { name: "Sum", id: "var-sum", latex: String.raw`\Sigma` },
};

const defaultData = [10, 20, 30, 40, 50];

function computeAverageSteps(xValues: number[]): {
  steps: Step[];
  stateHistory: VariableState[];
  average: number;
} {
  const steps: Step[] = [];
  const stateHistory: VariableState[] = [];
  const n = xValues.length;
  let sum = 0;
  const initialState: VariableState = {
    xbar: null,
    n: null,
    i: null,
    xi: null,
    X: xValues,
    sum: null,
  };
  steps.push({
    descriptionLatex: String.raw`\text{Get the count } n \text{ of values}`,
    values: [["n", n]],
  });
  stateHistory.push({ ...initialState, n });
  for (let i = 0; i < n; i++) {
    const xi = xValues[i];
    sum = sum + xi;
  }
  let average = sum / n;
  average = Math.round(average * 100) / 100;
  steps.push({
    descriptionLatex:
      String.raw`\text{Divide } \Sigma = ` +
      sum +
      String.raw` \text{ by } n = ` +
      n +
      String.raw` \text{ to get average.}`,
    values: [["xbar", average]],
  });
  stateHistory.push({ ...initialState, xbar: average });
  return { steps, stateHistory, average };
}

async function typesetMath(element?: HTMLElement | null) {
  if (!element) return;

  if (window.MathJax?.startup?.promise) {
    await window.MathJax.startup.promise;
  }

  if (window.MathJax?.typesetPromise) {
    const mathJaxElements = element.querySelectorAll(".MathJax");
    mathJaxElements.forEach((el) => el.remove());
    await window.MathJax.typesetPromise([element]);
  }
}

// Generate the LaTeX formula with cssId for each variable
// Set replaceWithValues to true to substitute values, false to always show LaTeX symbols
function generateAugmentedLatex(
  variables: VariableState,
  replaceWithValues: boolean = false,
): string {
  const xbarVal =
    replaceWithValues && variables.xbar !== null
      ? variables.xbar
      : String.raw`\bar{X}`;
  const nVal = replaceWithValues && variables.n !== null ? variables.n : "n";
  const xiVal =
    replaceWithValues && variables.xi !== null ? variables.xi : "X_i";

  return String.raw`\cssId{var-xbar}{${xbarVal}} = \frac{1}{\cssId{var-n-denom}{${nVal}}} \cssId{var-sum}{\sum}_{\cssId{var-i}{i}=1}^{\cssId{var-n-upper}{${nVal}}} \cssId{var-xi}{${xiVal}}`;
}

// Helper component to render LaTeX text
function LatexText({
  latex,
  className,
}: {
  latex: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const typeset = async () => {
      if (!ref.current) return;
      ref.current.innerHTML = `$${latex}$`;
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([ref.current]);
      }
    };
    typeset();
  }, [latex]);

  return <span ref={ref} className={className} />;
}

// Component to render a single LaTeX label
// Shows value in badge if available, otherwise shows LaTeX symbol; label below shows the name
function LatexLabel({
  latex,
  name,
  value,
}: {
  latex: string;
  name: string;
  value: number | null;
}) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const displayContent = value !== null ? String(value) : latex;

  useEffect(() => {
    const typeset = async () => {
      if (!labelRef.current) return;
      labelRef.current.innerHTML = `$${displayContent}$`;
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([labelRef.current]);
      }
    };
    typeset();
  }, [displayContent]);

  return (
    <>
      <span
        ref={labelRef}
        className="text-lg whitespace-nowrap font-semibold text-blue-600"
      />
      <LatexText
        latex={`\\text{${name}}`}
        className="text-base text-gray-500 mt-0.5"
      />
    </>
  );
}

// Component to render labels positioned relative to MathJax elements
function FormulaLabels({
  variables,
  activeVariables,
}: {
  variables: VariableState;
  activeVariables: string[];
}) {
  const [positions, setPositions] = useState<Record<string, DOMRect | null>>(
    {},
  );
  useEffect(() => {
    // Wait a bit for MathJax to finish rendering
    const timeout = setTimeout(() => {
      const newPositions: Record<string, DOMRect | null> = {};
      const ids = ["var-xbar", "var-n-denom", "var-xi", "var-i", "var-sum"];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          newPositions[id] = el.getBoundingClientRect();
        }
      });
      setPositions(newPositions);
    }, 100);

    return () => clearTimeout(timeout);
  }, [variables]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerRect(containerRef.current.getBoundingClientRect());
    }
  }, [positions]);

  const getRelativePosition = (id: string) => {
    const pos = positions[id];
    if (!pos || !containerRect) return null;
    return {
      left: pos.left - containerRect.left + pos.width / 2,
      top: pos.top - containerRect.top,
    };
  };

  const labels = [
    { id: "var-xbar", key: "xbar", offsetY: -45 },
    { id: "var-n-denom", key: "n", offsetY: 50 },
    { id: "var-xi", key: "xi", offsetY: -45 },
    { id: "var-i", key: "i", offsetY: 35 },
    { id: "var-sum", key: "sum", offsetY: -65 },
  ];
  // Filter labels to only show active variables
  const filteredLabels = labels.filter(({ key }) =>
    activeVariables.includes(key),
  );

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      {filteredLabels.map(({ id, key, offsetY }) => {
        const pos = getRelativePosition(id);
        if (!pos) return null;
        const config = variableConfig[key];
        const value = variables[key as keyof VariableState];
        return (
          <div
            key={id}
            className="absolute flex flex-col items-center transform -translate-x-1/2"
            style={{ left: pos.left, top: pos.top + offsetY }}
          >
            <LatexLabel
              latex={config.latex}
              name={config.name}
              value={typeof value === "number" ? value : null}
            />
          </div>
        );
      })}
    </div>
  );
}

// Map variable keys to their CSS IDs in the formula
const variableToIds: Record<string, string[]> = {
  xbar: ["var-xbar"],
  n: ["var-n-denom", "var-n-upper"],
  xi: ["var-xi"],
  i: ["var-i"],
  sum: ["var-sum"],
};

function AugmentedFormula({
  variables,
  descriptionLatex,
  activeVariables,
}: {
  variables: VariableState;
  descriptionLatex: string;
  activeVariables: string[];
}) {
  const formulaRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [labelsKey, setLabelsKey] = useState(0);
  const latex = generateAugmentedLatex(variables);

  // Generate CSS rules: reset all variables to default, then color active ones blue
  const allIds = Object.values(variableToIds).flat();
  const resetStyles = allIds
    .map((id) => `#${id} { color: inherit; }`)
    .join("\n");
  const activeIds = activeVariables.flatMap((key) => variableToIds[key] || []);
  const activeStyles = activeIds
    .map((id) => `#${id} { color: #2563eb !important; }`)
    .join("\n");
  const combinedStyles = `${resetStyles}\n${activeStyles}`;

  useEffect(() => {
    const doTypeset = async () => {
      if (!formulaRef.current) return;
      // Clear previous content and set new LaTeX
      formulaRef.current.innerHTML = `$$${latex}$$`;
      if (descriptionRef.current) {
        descriptionRef.current.innerHTML = `$${descriptionLatex}$`;
      }
      // Wait for MathJax to be ready
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([formulaRef.current]);
        if (descriptionRef.current) {
          await window.MathJax.typesetPromise([descriptionRef.current]);
        }
      }
      // Trigger labels re-render after MathJax is done
      setLabelsKey((k) => k + 1);
    };
    doTypeset();
  }, [latex, descriptionLatex]);

  return (
    <div className="relative pt-8 pb-8">
      {/* Dynamic styles for active variables */}
      <style>{combinedStyles}</style>
      {/* Description rendered with LaTeX */}
      <div
        ref={descriptionRef}
        className="flex justify-center text-xl mb-16 text-gray-700"
      />
      <FormulaLabels
        key={labelsKey}
        variables={variables}
        activeVariables={activeVariables}
      />
      <div
        ref={formulaRef}
        className="flex justify-center"
        style={{ fontSize: "2rem" }}
      />
    </div>
  );
}

function App() {
  const [dataValues] = useState<number[]>(defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stateHistory, setStateHistory] = useState<VariableState[]>([]);
  const stepsRef = useRef<HTMLDivElement>(null);
  const allStepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const result = computeAverageSteps(dataValues);
    setSteps(result.steps);
    setStateHistory(result.stateHistory);
    setCurrentStep(0);
  }, [dataValues]);

  useEffect(() => {
    typesetMath(stepsRef.current);
    typesetMath(allStepsRef.current);
  }, [currentStep, steps]);

  const currentStepData = steps[currentStep];
  const currentVariables = stateHistory[currentStep] || {
    xbar: null,
    n: null,
    i: null,
    xi: null,
    X: dataValues,
    sum: null,
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      {/* Augmented Formula Display */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 overflow-visible w-full max-w-4xl">
        <AugmentedFormula
          variables={currentVariables}
          descriptionLatex={currentStepData?.descriptionLatex || ""}
          activeVariables={currentStepData?.values.map(([name]) => name) || []}
        />
        {/* Controls */}
        <div className="flex gap-4 items-center justify-center mb-4">
          <button
            onClick={() => setCurrentStep(0)}
            disabled={currentStep === 0}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
            }
            disabled={currentStep >= steps.length - 1}
            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
          <span className="text-gray-600 ml-4">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
