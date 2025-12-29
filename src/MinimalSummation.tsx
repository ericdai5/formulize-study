import React from "react";
import {
  FormulaComponent,
  FormulizeProvider,
  InterpreterControl,
  view,
  type FormulizeConfig,
} from "formulize-math";

const config: FormulizeConfig = {
  formulas: [
    {
      id: "summation-basic",
      latex: "E = \\sum_{x \\in X} x P(x)",
    },
  ],
  variables: {
    E: {
      role: "computed",
      precision: 2,
      default: 0,
      name: "Expected Value",
      latexDisplay: "name",
      labelDisplay: "value",
    },
    x: {
      role: "input",
      memberOf: "X",
      precision: 0,
      name: "x: member of X",
      latexDisplay: "name",
      labelDisplay: "value",
    },
    X: {
      role: "input",
      default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      precision: 0,
    },
    "P(x)": {
      role: "input",
      key: "x",
      default: [0.05, 0.08, 0.12, 0.15, 0.2, 0.18, 0.12, 0.06, 0.03, 0.01],
      precision: 2,
      name: "Probability of x",
      latexDisplay: "name",
      labelDisplay: "value",
    },
    c: {
      role: "computed",
      precision: 2,
      name: "Current Expected Value",
      latexDisplay: "name",
      labelDisplay: "value",
    },
  },
  semantics: {
    engine: "manual",
    mode: "step",
    manual: function (vars) {
      var xValues = vars.X;
      var pxValues = vars["P(x)"];
      var expectedValue = vars.E;
      for (var i = 0; i < xValues.length; i++) {
        var xi = xValues[i];
        var probability = pxValues[i];
        if (i === 0) {
          view("Get a value x from X:", xi);
          view("Get a value P(x) from P(x):", probability);
        }
        var currExpected = Math.round(xi * probability * 100) / 100;
        if (i === 0) {
          view("This evaluates to:", currExpected);
        }
        expectedValue = Math.round((expectedValue + currExpected) * 100) / 100;
        switch (i) {
          case 0:
            view("add up term into E:", expectedValue);
            break;
          case 1:
            view("add next term...", expectedValue);
            break;
          case xValues.length - 1:
            view("finish accumulating weighted sum:", expectedValue);
            break;
        }
      }
      return expectedValue;
    },
  },
  fontSize: 1.5,
};

const MinimalSummation: React.FC = () => {
  return (
    <FormulizeProvider config={config}>
      <div className="p-4 flex flex-col gap-4">
        <FormulaComponent
          id="summation-basic"
          style={{ height: "300px", width: "700px" }}
        />
        <InterpreterControl environment={config} width={700} />
      </div>
    </FormulizeProvider>
  );
};

export default MinimalSummation;
