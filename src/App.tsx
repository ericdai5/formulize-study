import {
  Formula,
  FormulizeProvider,
  StepControl,
  type FormulizeConfig,
} from "formulize-math";

const averageConfig: FormulizeConfig = {
  formulas: [
    {
      id: "average",
      latex: "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i",
    },
  ],
  variables: {
    "\\bar{x}": {},
    n: {
      default: 0,
      name: "Count",
    },
    i: {
      name: "Index",
    },
    x_i: {
      name: "Value at i",
    },
    x: {
      default: [10, 20, 30, 40, 50],
      name: "Data values",
    },
  },
  stepping: true,
  semantics: ({ vars, step }) => {
    const xValues = vars.x as number[];
    const n = xValues.length;
    let sum = 0;
    step({
      description: "Get the count $n$ of values",
      values: [["n", n]],
    });
    for (let i = 0; i < n; i++) {
      const xi = xValues[i];
      sum = sum + xi;
    }
    let average = sum / n;
    average = Math.round(average * 100) / 100;
    step({
      description:
        "Divide $\\sum = " + sum + "$ by $n = " + n + "$ to get average",
      values: [["\\bar{x}", average]],
    });
    vars["\\bar{x}"] = average;
  },
  fontSize: 1.5,
};

function App() {
  return (
    <FormulizeProvider config={averageConfig}>
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
        <Formula id="average" style={{ height: "300px", width: "700px" }} />
        <div className="w-[270px] mx-auto p-4">
          <StepControl className="w-[700px] mx-auto" />
        </div>
      </div>
    </FormulizeProvider>
  );
}

export default App;
