import React from "react";

import {
  FormulaComponent,
  FormulizeProvider,
  InlineVariable,
  InterpreterControl,
  VisualizationComponent,
  type FormulizeConfig,
  type IPlot2D,
  view,
} from "formulize-math";

// =============================================================================
// COMBINED GRADIENT DESCENT CONFIGURATION
// =============================================================================

// Combined Plot2D with both loss (parabola) and gradient (line) using multi-yAxis feature
const combinedPlotConfig: IPlot2D = {
  type: "plot2d",
  id: "loss-gradient-plot",
  title: "Loss & Gradient vs Weight",
  xAxis: "w_t",
  xRange: [-1, 4],
  yAxis: "L", // Primary y-axis (used as default)
  yRange: [-15, 25], // Extended to show both loss (0-25) and gradient (-15 to 15)
  xAxisPos: "center", // Center x-axis at y=0 so gradient line crosses it
  yAxisPos: "edge",
  xGrid: "show",
  yGrid: "show",
  width: 560,
  height: 400,
  lines: [
    {
      color: "#ef4444", // Red for loss (parabola)
      lineWidth: 2.5,
      name: "loss-function",
      yAxis: "L",
      showInLegend: true,
    },
    {
      color: "#f97316", // Orange for gradient (linear)
      lineWidth: 2.5,
      name: "gradient",
      yAxis: "\\nabla L",
      showInLegend: true,
    },
  ],
};

const gradientDescentConfig: FormulizeConfig = {
  formulas: [
    {
      id: "loss-function",
      latex: "L = (y - w_t \\cdot x)^2",
    },
    {
      id: "gradient",
      latex: "\\nabla L = -2x(y - w_t \\cdot x)",
    },
    {
      id: "update-rule",
      latex: "w_{t+1} = w_t - \\alpha \\cdot \\nabla L",
    },
  ],
  variables: {
    // Index variable t (iteration number)
    t: {
      role: "index",
      name: "Iteration",
      default: 0,
      precision: 0,
    },
    // t+1 index for the next weight
    "t+1": {
      role: "index",
      name: "Next Iteration",
      default: 1,
      precision: 0,
    },
    // Loss and Gradient (computed at current w_t)
    L: { role: "computed", name: "Loss", precision: 4 },
    "\\nabla L": { role: "computed", name: "Gradient", precision: 4 },
    // Current weight w_t (input, user can adjust starting point)
    w_t: {
      role: "input",
      default: 0.5,
      range: [-1, 4],
      step: 0.05,
      name: "Current Weight wₜ",
      precision: 3,
    },
    // Next weight w_{t+1} (computed)
    "w_{t+1}": {
      role: "computed",
      name: "Next Weight wₜ₊₁",
      precision: 4,
    },
    // Learning rate
    "\\alpha": {
      role: "input",
      default: 0.15,
      range: [0.01, 0.5],
      step: 0.01,
      name: "Learning Rate α",
      precision: 3,
    },
    // Data inputs
    x: {
      role: "input",
      default: 1.5,
      range: [0.5, 3],
      step: 0.1,
      name: "Input Feature x",
      precision: 2,
    },
    y: {
      role: "input",
      default: 3,
      range: [1, 5],
      step: 0.1,
      name: "Target Value y",
      precision: 2,
    },
  },
  semantics: {
    engine: "manual",
    mode: "step",
    variableLinkage: {
      w_t_plus_1: "w_{t+1}",
      nablaL: "\\nabla L",
      L: "L",
      t: "t",
    },
    // Expressions are used by Plot2D to evaluate curves
    expressions: {
      "loss-function": "{L} = ({y} - {w_t} * {x})^2",
      gradient: "{\\nabla L} = -2 * {x} * ({y} - {w_t} * {x})",
      "update-rule": "{w_{t+1}} = {w_t} - {\\alpha} * {\\nabla L}",
    },
    manual: function (vars) {
      var x = vars.x;
      var y = vars.y;
      var alpha = vars["\\alpha"];
      var w_t = vars.w_t;
      var numIterations = 4;
      view("Initial weight wₜ:", { value: w_t, formulaId: "loss-function" });
      view("Learning rate α:", { value: alpha, formulaId: "update-rule" });
      view("Target y:", { value: y, formulaId: "loss-function" });
      view("Feature x:", { value: x, formulaId: "loss-function" });
      // Run gradient descent iterations
      for (var t = 0; t < numIterations; t++) {
        view("Current wₜ:", { value: w_t, formulaId: "loss-function" });
        // Compute prediction
        var prediction = w_t * x;
        view("Prediction = wₜ·x:", {
          value: prediction,
          formulaId: "loss-function",
        });
        // Compute error
        var error = y - prediction;
        view("Error = y - prediction:", {
          value: error,
          formulaId: "loss-function",
        });
        // Compute loss
        var L = error * error;
        view("Loss L = error²:", { value: L, formulaId: "loss-function" });
        // Compute gradient
        var nablaL = -2 * x * error;
        view("Gradient $\\nabla L = -2x \\cdot Error$:", {
          value: nablaL,
          formulaId: "gradient",
        });
        // Compute step size
        var step = alpha * nablaL;
        view("Step = $\\alpha \\cdot \\nabla L$:", {
          value: step,
          formulaId: "update-rule",
        });
        // Update weight: w_{t+1} = w_t - step
        var w_t_plus_1 = w_t - step;
        view("wₜ₊₁ = wₜ - step:", {
          value: w_t_plus_1,
          formulaId: "update-rule",
        });
        // Move to next iteration
        w_t = w_t_plus_1;
      }
      // Summary
      view("Final weight after " + numIterations + " iterations:", {
        value: w_t,
      });
      return w_t;
    },
  },
  // Add visualizations to the config
  visualizations: [combinedPlotConfig],
  fontSize: 1.3,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GradientDescentExample: React.FC = () => {
  return (
    <FormulizeProvider config={gradientDescentConfig}>
      <div className="max-w-6xl mx-auto min-h-screen">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gradient Descent Step-by-Step
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Watch how <InlineVariable id="w_t" display="both" /> updates to{" "}
            <InlineVariable id="w_{t+1}" display="symbol" /> over 4 iterations
            as gradient descent minimizes the loss.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormulaComponent
              id="loss-function"
              style={{ height: "200px", flex: 1 }}
            />
            <FormulaComponent
              id="gradient"
              style={{ height: "200px", flex: 1 }}
            />
            <FormulaComponent
              id="update-rule"
              style={{ height: "200px", flex: 1 }}
            />
            <InterpreterControl
              environment={gradientDescentConfig}
              width="100%"
              defaultCollapsed={false}
            />
          </div>
          {/* Right: Combined Visualization */}
          <div className="space-y-4">
            {/* Combined Loss & Gradient Plot */}
            <VisualizationComponent
              type="plot2d"
              config={combinedPlotConfig}
              style={{ width: "100%", height: "500px" }}
            />
            {/* Legend */}
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <div className="flex items-center justify-around">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500" />
                  <span>Loss L (parabola)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-orange-500" />
                  <span>Gradient ∇L (line)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormulizeProvider>
  );
};

export default GradientDescentExample;
