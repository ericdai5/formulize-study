import {
  FormulaComponent,
  FormulizeProvider,
  InlineVariable,
  type FormulizeConfig,
} from "formulize-math";

/**
 * Formulize Condition - Formula Visualization Study
 *
 * Your task: Modify this configuration to create your own interactive formula visualization.
 *
 * The config below defines:
 * - formulas: LaTeX formulas with {variable} placeholders
 * - variables: Input sliders and computed values
 * - semantics: How to compute the results
 *
 * Edit the config to change:
 * - The formulas displayed
 * - Variable names, ranges, and defaults
 * - The computation logic
 */

// ============================================================================
// EDIT THIS CONFIG to create your visualization
// ============================================================================
const config: FormulizeConfig = {
  formulas: [
    {
      id: "kinetic-energy",
      latex: "KE = \\frac{1}{2} {m} {v}^2",
    },
    {
      id: "result",
      latex: "KE = {KE} \\text{ Joules}",
    },
  ],

  variables: {
    // Input variables - users can drag these to change values
    m: {
      role: "input",
      name: "Mass",
      default: 10,
      range: [1, 100],
      step: 1,
      precision: 0,
      latexDisplay: "value", // Show the number in the formula
    },
    v: {
      role: "input",
      name: "Velocity",
      default: 5,
      range: [0, 30],
      step: 0.5,
      precision: 1,
      latexDisplay: "value",
    },

    // Computed variables - calculated automatically
    KE: {
      role: "computed",
      name: "Kinetic Energy",
      precision: 1,
      latexDisplay: "value",
    },
  },

  // Computation function - defines how computed variables are calculated
  semantics: {
    engine: "manual",
    manual: (vars) => {
      // KE = (1/2) * m * v^2
      vars.KE = 0.5 * vars.m * vars.v * vars.v;
    },
  },

  // Display settings
  fontSize: 1.4,
};

// ============================================================================
// Main component - you can modify the layout but the config above is the key part
// ============================================================================
function App() {
  return (
    <FormulizeProvider config={config}>
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Kinetic Energy Calculator</h1>

        <p className="text-gray-600 mb-8">
          Drag the values in the formulas below to explore how mass and velocity
          affect kinetic energy. The formula updates in real-time!
        </p>

        {/* Main formula display */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Kinetic Energy Formula
          </h2>
          <FormulaComponent
            id="kinetic-energy"
            style={{ height: "200px", width: "100%" }}
          />
        </div>

        {/* Result display */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Result</h2>
          <FormulaComponent
            id="result"
            style={{ height: "150px", width: "100%" }}
          />
        </div>

        {/* Inline variables in text */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Current Values</h2>
          <p className="text-gray-700">
            With a mass of <InlineVariable id="m" display="value" /> kg moving at{" "}
            <InlineVariable id="v" display="value" /> m/s, the kinetic energy is{" "}
            <InlineVariable id="KE" display="value" /> Joules.
          </p>
        </div>

        {/* Instructions for participants */}
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">
            Your Task
          </h2>
          <p className="text-amber-900 mb-4">
            Modify the <code className="bg-amber-100 px-1 rounded">config</code>{" "}
            object at the top of <code className="bg-amber-100 px-1 rounded">App.tsx</code>{" "}
            to create your own formula visualization.
          </p>
          <ul className="list-disc list-inside text-amber-900 space-y-1">
            <li>Change the formulas (use LaTeX syntax)</li>
            <li>Add or modify variables</li>
            <li>Update the computation logic</li>
            <li>Adjust the layout below</li>
          </ul>
        </div>
      </div>
    </FormulizeProvider>
  );
}

export default App;
