import React from "react";
import {
  FormulaComponent,
  FormulizeProvider,
  InterpreterControl,
  type FormulizeConfig,
} from "formulize-math";

const config: FormulizeConfig = {
  formulas: [
    {
      id: "summation-basic",
      latex: "E = \\sum_{x \\in X} x \\cdot P(x)",
    },
  ],
  variables: {
    E: {
      role: "computed",
      precision: 2,
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
      default: [1, 2, 3, 4, 5, 6],
      precision: 0,
    },
    "P(x)": {
      role: "input",
      key: "x",
      default: [0.1, 0.15, 0.2, 0.25, 0.2, 0.1],
      precision: 2,
      name: "Probability of x",
      latexDisplay: "name",
      labelDisplay: "value",
    },
    c: {
      role: "computed",
      precision: 2,
      name: "Current Term",
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
      var expectedValue = 0;
      for (var i = 0; i < xValues.length; i++) {
        var xi = xValues[i];
        var probability = pxValues[i];
        var currExpected = xi * probability;
        // @view "x P(x)"->"The expected value for x should be:"->"currExpected"
        expectedValue += currExpected;
        // @view "E"->"Expected value E is updated"->"expectedValue"
      }
      return expectedValue;
    },
    variableLinkage: {
      xi: "x",
      probability: "P(x)",
      expectedValue: "E",
      currExpected: "c",
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
