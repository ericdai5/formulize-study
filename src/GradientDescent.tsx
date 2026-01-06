import {
  FormulaComponent,
  FormulizeProvider,
  InlineFormula,
  InlineVariable,
  InterpreterControl,
  type FormulizeConfig,
  view,
} from "formulize-math";

// Configuration for the loss function
const lossConfig: FormulizeConfig = {
  formulas: [
    {
      id: "loss-function",
      latex: "L(w) = (y - w \\cdot x)^2",
    },
  ],
  variables: {
    "L(w)": {
      role: "computed",
      name: "Loss",
      precision: 4,
    },
    w: {
      role: "input",
      default: 0.5,
      range: [-2, 4],
      step: 0.1,
      name: "Weight",
      precision: 4,
    },
    x: {
      role: "input",
      default: 1.5,
      range: [0.1, 3],
      step: 0.1,
      name: "Input Feature",
      precision: 2,
    },
    y: {
      role: "input",
      default: 3,
      range: [0, 5],
      step: 0.1,
      name: "Target Value",
      precision: 2,
    },
  },
  semantics: {
    engine: "manual",
    mode: "step",
    manual: function (vars) {
      var x = vars.x;
      var y = vars.y;
      var w = vars.w;
      view("Get input feature x:", x, "x");
      view("Get target value y:", y, "y");
      view("Get weight w:", w, "w");
      var prediction = w * x;
      view("Compute prediction w·x:", prediction, "w \\cdot x");
      var error = y - prediction;
      view("Compute error (y - w·x):", error, "y - w \\cdot x");
      var loss = error * error;
      view("Square the error to get loss:", loss, "(y - w \\cdot x)^2");
      view("Final loss L(w):", loss, "L(w)");
      return loss;
    },
  },
  fontSize: 1.4,
};

// Configuration for the gradient
const gradientConfig: FormulizeConfig = {
  formulas: [
    {
      id: "gradient",
      latex: "\\nabla L = -2x(y - w \\cdot x)",
    },
  ],
  variables: {
    "\\nabla L": {
      role: "computed",
      name: "Gradient",
      precision: 4,
    },
    w: {
      role: "input",
      default: 0.5,
      range: [-2, 4],
      step: 0.1,
      name: "Weight",
      precision: 4,
    },
    x: {
      role: "input",
      default: 1.5,
      range: [0.1, 3],
      step: 0.1,
      name: "Input Feature",
      precision: 2,
    },
    y: {
      role: "input",
      default: 3,
      range: [0, 5],
      step: 0.1,
      name: "Target Value",
      precision: 2,
    },
  },
  semantics: {
    engine: "manual",
    mode: "step",
    manual: function (vars) {
      var x = vars.x;
      var y = vars.y;
      var w = vars.w;
      view("Get input feature x:", x, "x");
      view("Get target value y:", y, "y");
      view("Get weight w:", w, "w");
      var prediction = w * x;
      view("Compute prediction w·x:", prediction, "w \\cdot x");
      var error = y - prediction;
      view("Compute error (y - w·x):", error, "y - w \\cdot x");
      var gradient = -2 * x * error;
      view("Compute gradient -2x(y - w·x):", gradient, "-2x(y - w \\cdot x)");
      view("Final gradient ∇L:", gradient, "\\nabla L");
      return gradient;
    },
  },
  fontSize: 1.4,
};

// Configuration for the update rule with step-through execution
const updateRuleConfig: FormulizeConfig = {
  formulas: [
    {
      id: "update-rule",
      latex: "w_{t+1} = w_t - \\alpha \\cdot \\nabla L",
    },
  ],
  variables: {
    w_t: {
      role: "input",
      default: 0.1,
      range: [-2, 4],
      step: 0.1,
      name: "Initial Weight",
      precision: 4,
    },
    "w_{t+1}": {
      role: "computed",
      name: "Next Weight",
      precision: 4,
    },
    "\\nabla L": {
      role: "computed",
      name: "Gradient",
      precision: 4,
    },
    "\\alpha": {
      role: "input",
      default: 0.1,
      range: [0.01, 0.5],
      step: 0.01,
      name: "Learning Rate",
      precision: 3,
    },
    x: {
      role: "input",
      default: 1.5,
      range: [0.1, 3],
      step: 0.1,
      name: "Input Feature",
      precision: 2,
    },
    y: {
      role: "input",
      default: 3,
      range: [0, 5],
      step: 0.1,
      name: "Target Value",
      precision: 2,
    },
    t: {
      role: "index",
      default: 0,
      name: "Step",
      precision: 0,
    },
  },
  semantics: {
    engine: "manual",
    mode: "step",
    manual: function (vars) {
      var x = vars.x;
      var y = vars.y;
      var alpha = vars["\\alpha"];
      var w = vars.w_t;

      view("Get current weight w_t:", w, "w_t");
      view("Get learning rate α:", alpha, "\\alpha");
      view("Get input feature x:", x);
      view("Get target value y:", y);

      // Compute prediction and error
      var prediction = w * x;
      view("Compute prediction w·x:", prediction);
      var error = y - prediction;
      view("Compute error (y - w·x):", error);

      // Compute gradient: ∇L = -2x(y - w·x)
      var gradient = -2 * x * error;
      view("Compute gradient ∇L = -2x(y - w·x):", gradient, "\\nabla L");

      // Compute α·∇L term
      var stepSize = alpha * gradient;
      view("Compute step size α·∇L:", stepSize, "\\alpha \\cdot \\nabla L");

      // Compute new weight: w_{t+1} = w_t - α·∇L
      var wNew = w - stepSize;
      view(
        "Compute new weight w_t - α·∇L:",
        wNew,
        "w_t - \\alpha \\cdot \\nabla L"
      );
      view("Final result w_{t+1}:", wNew, "w_{t+1}");

      return wNew;
    },
  },
  fontSize: 1.4,
};

// Section component for each formula with its explanation
const FormulaSection: React.FC<{
  config: FormulizeConfig;
  title: string;
  description: React.ReactNode;
  formulaId: string;
  showInterpreter?: boolean;
}> = ({ config, title, description, formulaId, showInterpreter = false }) => {
  return (
    <FormulizeProvider config={config}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="prose max-w-none text-gray-600 mb-4">{description}</div>
        <FormulaComponent id={formulaId} style={{ height: "350px" }} />
        {showInterpreter && (
          <div className="mt-4">
            <InterpreterControl
              environment={config}
              width="100%"
              defaultCollapsed={false}
            />
          </div>
        )}
      </div>
    </FormulizeProvider>
  );
};

// Main component
export const GradientDescentExample: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gradient Descent Step-by-Step
        </h1>
        <p className="text-gray-600 text-lg">
          Understand how gradient descent finds minima by exploring the
          relationship between the mathematical update rule and the actual path
          taken on a loss surface.
        </p>
      </header>

      {/* Loss Function Section */}
      <FormulaSection
        config={lossConfig}
        title="1. The Loss Function"
        formulaId="loss-function"
        description={
          <p>
            The <strong>loss function</strong> measures how far our prediction
            is from the target. Given an input feature{" "}
            <InlineVariable id="x" display="both" /> and a target value{" "}
            <InlineVariable id="y" display="both" />, we compute the squared
            error between the prediction{" "}
            <InlineFormula id="loss-function" scale={0.85} /> and the actual
            target. The weight <InlineVariable id="w" display="both" /> controls
            our prediction, and our goal is to find the value of{" "}
            <InlineVariable id="w" display="symbol" /> that minimizes this loss.
          </p>
        }
      />

      {/* Gradient Section */}
      <FormulaSection
        config={gradientConfig}
        title="2. The Gradient"
        formulaId="gradient"
        description={
          <p>
            The <strong>gradient</strong>{" "}
            <InlineVariable id="\\nabla L" display="symbol" /> tells us the
            direction and magnitude of steepest ascent on the loss surface. By
            taking the derivative of the loss function with respect to the
            weight <InlineVariable id="w" display="symbol" />, we get{" "}
            <InlineFormula id="gradient" scale={0.85} />. When the gradient is
            positive, increasing <InlineVariable id="w" display="symbol" />{" "}
            increases loss; when negative, increasing{" "}
            <InlineVariable id="w" display="symbol" /> decreases loss.
          </p>
        }
      />

      {/* Update Rule Section with Step-Through */}
      <FormulaSection
        config={updateRuleConfig}
        title="3. The Update Rule"
        formulaId="update-rule"
        showInterpreter={true}
        description={
          <p>
            The <strong>update rule</strong> is the heart of gradient descent.
            We update the weight by moving in the opposite direction of the
            gradient, scaled by the learning rate{" "}
            <InlineVariable id="\\alpha" display="both" />. A larger learning
            rate means bigger steps (faster but potentially unstable), while a
            smaller learning rate means smaller steps (slower but more stable).
            Starting from initial weight{" "}
            <InlineVariable id="w_t" display="both" />, watch how the
            optimization converges to the optimal weight{" "}
            <InlineVariable id="w_{t+1}" display="symbol" />.
          </p>
        }
      />
    </div>
  );
};

export default GradientDescentExample;
