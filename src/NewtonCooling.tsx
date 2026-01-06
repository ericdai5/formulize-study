import React, { useState, useEffect, useRef } from "react";
import {
  FormulaComponent,
  FormulizeProvider,
  InlineFormula,
  InlineVariable,
  VisualizationComponent,
  type FormulizeConfig,
  type IContext,
  register,
} from "formulize-math";

// Helper function to create a thermometer SVG with dynamic temperature display
const createThermometerSVG = (color: string) => {
  // The thermometer will be animated based on the actual value via CSS
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 80">
    <!-- Thermometer body -->
    <defs>
      <linearGradient id="tempGradient-${color.replace(
        "#",
        ""
      )}" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffeaa7;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.6" />
        <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.4" />
      </linearGradient>
    </defs>
    <!-- Glass tube background -->
    <rect x="11" y="8" width="10" height="50" rx="5" fill="#e8e8e8" stroke="#999" stroke-width="1"/>
    <!-- Mercury column (height will be styled via CSS) -->
    <rect class="mercury-column" x="13" y="10" width="6" height="46" rx="3" fill="url(#tempGradient-${color.replace(
      "#",
      ""
    )})"/>
    <!-- Bulb at bottom -->
    <circle cx="16" cy="65" r="9" fill="${color}" stroke="#999" stroke-width="1"/>
    <circle cx="14" cy="63" r="2" fill="rgba(255,255,255,0.5)"/>
    <!-- Glass reflection -->
    <rect x="12" y="8" width="3" height="50" rx="1.5" fill="url(#glassGradient)"/>
    <!-- Temperature scale marks -->
    <line x1="22" y1="12" x2="26" y2="12" stroke="#666" stroke-width="1"/>
    <line x1="22" y1="22" x2="25" y2="22" stroke="#666" stroke-width="0.5"/>
    <line x1="22" y1="32" x2="26" y2="32" stroke="#666" stroke-width="1"/>
    <line x1="22" y1="42" x2="25" y2="42" stroke="#666" stroke-width="0.5"/>
    <line x1="22" y1="52" x2="26" y2="52" stroke="#666" stroke-width="1"/>
  </svg>`;
};

// Stopwatch custom visualization component
interface StopwatchVisualizationProps {
  context: IContext;
}

const StopwatchVisualization: React.FC<StopwatchVisualizationProps> = ({
  context,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const contextRef = useRef(context);

  // Keep context ref updated
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  // Sync display time with context on mount
  useEffect(() => {
    const t = context.getVariable("t") || 0;
    setDisplayTime(t);
    accumulatedTimeRef.current = t;
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newTime = Math.min(accumulatedTimeRef.current + elapsed, 100);
        const roundedTime = Math.round(newTime * 10) / 10;
        setDisplayTime(roundedTime);
        contextRef.current.updateVariable("t", roundedTime);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    accumulatedTimeRef.current = displayTime;
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const handleStop = () => {
    accumulatedTimeRef.current = displayTime;
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    setDisplayTime(0);
    contextRef.current.updateVariable("t", 0);
  };

  // Calculate hand rotation (1 full rotation = 60 units)
  const secondHandRotation = (displayTime % 60) * 6; // 360/60 = 6 degrees per unit
  const minuteHandRotation = (displayTime / 60) * 6;

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-gray-600 font-mono text-xs uppercase tracking-widest">
        Elapsed Time
      </div>

      {/* Stopwatch SVG */}
      <svg
        width="160"
        height="180"
        viewBox="0 0 160 180"
        className="drop-shadow-lg"
      >
        {/* Top button */}
        <rect
          x="72"
          y="2"
          width="16"
          height="16"
          rx="3"
          fill="#444"
          stroke="#666"
          strokeWidth="1"
        />
        <rect x="75" y="5" width="10" height="6" rx="2" fill="#333" />

        {/* Ring attachment */}
        <circle
          cx="80"
          cy="8"
          r="6"
          fill="none"
          stroke="#888"
          strokeWidth="2"
        />

        {/* Watch body */}
        <defs>
          <radialGradient id="watchFace" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#fefefe" />
            <stop offset="100%" stopColor="#e0e0e0" />
          </radialGradient>
          <radialGradient id="watchBezel" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#b8960c" />
            <stop offset="100%" stopColor="#8b7355" />
          </radialGradient>
        </defs>

        {/* Outer bezel */}
        <circle
          cx="80"
          cy="100"
          r="68"
          fill="url(#watchBezel)"
          stroke="#5a4a2a"
          strokeWidth="2"
        />

        {/* Inner bezel */}
        <circle
          cx="80"
          cy="100"
          r="62"
          fill="#222"
          stroke="#444"
          strokeWidth="1"
        />

        {/* Watch face */}
        <circle
          cx="80"
          cy="100"
          r="56"
          fill="url(#watchFace)"
          stroke="#ccc"
          strokeWidth="1"
        />

        {/* Minute markers */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const isHour = i % 5 === 0;
          const innerR = isHour ? 46 : 50;
          const outerR = 54;
          return (
            <line
              key={i}
              x1={80 + Math.cos(angle) * innerR}
              y1={100 + Math.sin(angle) * innerR}
              x2={80 + Math.cos(angle) * outerR}
              y2={100 + Math.sin(angle) * outerR}
              stroke={isHour ? "#333" : "#888"}
              strokeWidth={isHour ? 2 : 1}
            />
          );
        })}

        {/* Numbers */}
        {[0, 10, 20, 30, 40, 50].map((num) => {
          const angle = (num * 6 - 90) * (Math.PI / 180);
          const r = 38;
          return (
            <text
              key={num}
              x={80 + Math.cos(angle) * r}
              y={100 + Math.sin(angle) * r + 4}
              textAnchor="middle"
              fill="#333"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {num}
            </text>
          );
        })}

        {/* Minute hand (longer, shows total minutes) */}
        <line
          x1="80"
          y1="100"
          x2={80 + Math.sin((minuteHandRotation * Math.PI) / 180) * 25}
          y2={100 - Math.cos((minuteHandRotation * Math.PI) / 180) * 25}
          stroke="#666"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Second hand (main hand) */}
        <line
          x1="80"
          y1="100"
          x2={80 + Math.sin((secondHandRotation * Math.PI) / 180) * 42}
          y2={100 - Math.cos((secondHandRotation * Math.PI) / 180) * 42}
          stroke="#c0392b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center cap */}
        <circle
          cx="80"
          cy="100"
          r="5"
          fill="#333"
          stroke="#555"
          strokeWidth="1"
        />
        <circle cx="80" cy="100" r="2" fill="#c0392b" />

        {/* Digital display */}
        <rect
          x="55"
          y="125"
          width="50"
          height="18"
          rx="3"
          fill="#1a1a2e"
          stroke="#333"
          strokeWidth="1"
        />
        <text
          x="80"
          y="138"
          textAnchor="middle"
          fill="#00ff88"
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {displayTime.toFixed(1)}
        </text>
      </svg>

      {/* Controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>
      </div>

      <div className="text-gray-500 text-xs text-center max-w-[180px]">
        Drag the time variable or use the stopwatch to explore cooling over time
      </div>
    </div>
  );
};

// Register the stopwatch component
try {
  register("StopwatchVisualization", StopwatchVisualization);
} catch (error) {
  console.warn("Failed to register StopwatchVisualization:", error);
}

// Main Newton's Law of Cooling configuration
const newtonCoolingConfig: FormulizeConfig = {
  formulas: [
    {
      id: "newton-cooling",
      latex: "T(t) = T_{env} + (T_0 - T_{env})e^{-kt}",
    },
  ],
  variables: {
    "T(t)": {
      role: "computed",
      name: "Current Temperature",
      units: "°C",
      precision: 1,
      svgContent: createThermometerSVG("#e74c3c"),
      svgMode: "replace",
      defaultCSS: `
        .mercury-column { 
          transform-origin: bottom;
          transform: scaleY(calc(0.1 + 0.9 * {value} / 100));
        }
      `,
    },
    T_0: {
      role: "input",
      default: 90,
      range: [50, 100],
      step: 1,
      name: "Initial Temperature",
      units: "°C",
      precision: 0,
      svgContent: createThermometerSVG("#e67e22"),
      svgMode: "replace",
      memberOf: "T(t)",
      defaultCSS: `
        .mercury-column { 
          transform-origin: bottom;
          transform: scaleY(calc(0.5 + 0.5 * ({value} - 50) / 50));
        }
      `,
    },
    T_env: {
      role: "input",
      default: 22,
      range: [0, 40],
      step: 1,
      name: "Environment Temperature",
      units: "°C",
      precision: 0,
      svgContent: createThermometerSVG("#3498db"),
      svgMode: "replace",
      defaultCSS: `
        .mercury-column { 
          transform-origin: bottom;
          transform: scaleY(calc(0.1 + 0.9 * {value} / 40));
        }
      `,
    },
    k: {
      role: "input",
      default: 0.05,
      range: [0.01, 0.2],
      step: 0.01,
      name: "Cooling Constant",
      units: "1/min",
      precision: 3,
      latexDisplay: "name",
    },
    t: {
      role: "input",
      default: 0,
      range: [0, 100],
      step: 0.1,
      name: "Time",
      units: "min",
      precision: 1,
      latexDisplay: "value",
      svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <!-- Stopwatch icon -->
        <circle cx="12" cy="13" r="9" fill="#2c3e50" stroke="#34495e" stroke-width="1.5"/>
        <circle cx="12" cy="13" r="7.5" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="0.5"/>
        <!-- Top button -->
        <rect x="10.5" y="1" width="3" height="4" rx="1" fill="#34495e"/>
        <!-- Hour markers -->
        <line x1="12" y1="6.5" x2="12" y2="8" stroke="#2c3e50" stroke-width="0.8"/>
        <line x1="12" y1="18" x2="12" y2="19.5" stroke="#2c3e50" stroke-width="0.8"/>
        <line x1="5.5" y1="13" x2="7" y2="13" stroke="#2c3e50" stroke-width="0.8"/>
        <line x1="17" y1="13" x2="18.5" y2="13" stroke="#2c3e50" stroke-width="0.8"/>
        <!-- Hands -->
        <line x1="12" y1="13" x2="12" y2="7.5" stroke="#e74c3c" stroke-width="1" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 12 13" to="360 12 13" dur="4s" repeatCount="indefinite"/>
        </line>
        <circle cx="12" cy="13" r="1" fill="#c0392b"/>
      </svg>`,
      svgMode: "replace",
    },
  },
  semantics: {
    engine: "manual",
    expressions: {
      "newton-cooling":
        "{T(t)} = {T_env} + ({T_0} - {T_env}) * exp(-{k} * {t})",
    },
    manual: function (vars) {
      const T_env = vars.T_env;
      const T_0 = vars.T_0;
      const k = vars.k;
      const t = vars.t;
      return T_env + (T_0 - T_env) * Math.exp(-k * t);
    },
  },
  visualizations: [
    {
      type: "plot2d" as const,
      xAxis: "t",
      xRange: [0, 100],
      xGrid: "show",
      yAxis: "T(t)",
      yRange: [0, 100],
      yGrid: "show",
      lines: [
        {
          color: "#e74c3c",
        },
      ],
    },
    {
      type: "custom" as const,
      id: "stopwatch",
      component: "StopwatchVisualization",
      variables: ["t"],
      update: {
        onVariableChange: true,
      },
    },
  ],
  fontSize: 1.4,
};

export const NewtonCoolingExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Newton's Law of Cooling
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore how an object's temperature approaches ambient temperature
            exponentially over time, and why cooling slows as it gets closer to
            room temperature.
          </p>
        </header>

        <FormulizeProvider config={newtonCoolingConfig}>
          <div className="space-y-8">
            {/* Main explanation card */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                The Cooling Equation
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  The temperature{" "}
                  <InlineVariable id="T(t)" display="withUnits" /> of a cooling
                  object follows the exponential decay formula{" "}
                  <InlineFormula id="newton-cooling" scale={0.9} />. Starting
                  from an initial temperature{" "}
                  <InlineVariable id="T_0" display="withUnits" />, the object
                  approaches the environment temperature{" "}
                  <InlineVariable id="T_env" display="withUnits" /> at a rate
                  determined by the cooling constant{" "}
                  <InlineVariable id="k" display="withUnits" />.
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  <strong className="text-gray-700">Key insight:</strong> The
                  rate of cooling is proportional to the temperature difference.
                  When the object is much hotter than its surroundings, it cools
                  quickly. As it approaches room temperature, cooling slows
                  dramatically—this is why your coffee stays lukewarm for so
                  long!
                </p>
              </div>
            </div>

            {/* Main visualization grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Formula component */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <FormulaComponent
                  id="newton-cooling"
                  style={{ height: "280px" }}
                />
              </div>
              {/* Stopwatch */}
              <div className="flex items-center justify-center">
                {newtonCoolingConfig.visualizations && (
                  <VisualizationComponent
                    type="custom"
                    config={newtonCoolingConfig.visualizations[1]}
                  />
                )}
              </div>
            </div>

            {/* Temperature vs Time Plot */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Temperature Over Time
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Watch how the temperature curve approaches the horizontal
                asymptote at <InlineVariable id="T_env" display="withUnits" />.
                The dashed blue line shows the environment temperature that the
                object will eventually reach.
              </p>
              {newtonCoolingConfig.visualizations &&
                newtonCoolingConfig.visualizations[0] && (
                  <VisualizationComponent
                    type="plot2d"
                    config={newtonCoolingConfig.visualizations[0]}
                    height={350}
                  />
                )}
            </div>

            {/* Parameter explanation cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                <div className="text-red-600 font-semibold mb-2 flex items-center gap-2">
                  🌡️ T(t)
                </div>
                <p className="text-gray-600 text-sm">
                  The current temperature of the object at time t. Watch it
                  decrease as time passes.
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
                <div className="text-orange-600 font-semibold mb-2 flex items-center gap-2">
                  🔥 T₀
                </div>
                <p className="text-gray-600 text-sm">
                  Initial temperature. Try setting this high (like fresh coffee
                  at 90°C) to see rapid early cooling.
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <div className="text-blue-600 font-semibold mb-2 flex items-center gap-2">
                  ❄️ T_env
                </div>
                <p className="text-gray-600 text-sm">
                  Environment (room) temperature. This is the asymptote—the
                  object can never cool below this.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
                <div className="text-purple-600 font-semibold mb-2 flex items-center gap-2">
                  ⚡ k
                </div>
                <p className="text-gray-600 text-sm">
                  Cooling constant. Higher values mean faster cooling (better
                  heat transfer, like metal vs. ceramic).
                </p>
              </div>
            </div>
          </div>
        </FormulizeProvider>
      </div>
    </div>
  );
};

export default NewtonCoolingExample;
