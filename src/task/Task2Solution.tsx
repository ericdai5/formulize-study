import {
  Formula,
  Provider,
  StepControl,
  latex,
  type Config,
} from "math-notation";

const config: Config = {
  formulas: [
    {
      id: "expected-value",
      latex: "E = \\sum_{x \\in X} x P(x)",
    },
  ],
  variables: {
    E: {
      default: 0,
      name: "Expected Value",
      precision: 2,
    },
    x: {
      name: "Net payoff",
    },
    X: {
      default: [10, -10, -10],
    },
    "P(x)": {
      default: [0.47, 0.47, 0.06],
      name: "Probability of payoff",
    },
  },
  stepping: true,
  semantics: function ({ vars, step }) {
    var xValues = vars.X;
    var pValues = vars["P(x)"];
    var expectedValue = 0;

    for (var i = 0; i < xValues.length; i++) {
      var xi = xValues[i];
      var probability = pValues[i];

      if (i === 0) {
        step({
          description: "Get a payoff x from X",
          labels: { x: xi, X: xValues },
        });
        step({
          description: "Get its probability P(x)",
          labels: { "P(x)": probability },
        });
      }

      var contribution = Math.round(xi * probability * 100) / 100;

      if (i === 0) {
        step({
          labels: {
            x: xi,
            "P(x)": probability,
            "x P(x)":
              "Weight payoff by probability: " +
              latex(contribution).precision(2),
          },
        });
      }

      expectedValue = Math.round((expectedValue + contribution) * 100) / 100;

      switch (i) {
        case 0:
          step({
            description: "Add first weighted term to E",
            labels: { E: expectedValue },
          });
          break;
        case 1:
          step({
            description: "Add next weighted term...",
            labels: { E: expectedValue },
          });
          break;
        case xValues.length - 1:
          step({
            description: "Finish accumulating the weighted sum",
            labels: { E: expectedValue },
          });
          break;
      }
    }

    vars.E = expectedValue;
  },
  fontSize: 1.5,
};

export default function Task2Solution() {
  return (
    <Provider config={config}>
      <Formula
        id="expected-value"
        style={{ height: "350px", width: "800px" }}
      />
      <div style={{ marginTop: "10px" }}>
        <StepControl />
      </div>
    </Provider>
  );
}
