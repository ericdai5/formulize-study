import {
  Formula,
  FormulizeProvider,
  type FormulizeConfig,
} from "formulize-math";

const linearConfig: FormulizeConfig = {
  formulas: [
    {
      id: "linear-equation",
      latex: "y = mx + b",
    },
  ],
  variables: {
    y: {
      default: 0,
    },
    m: {
      input: "drag",
      default: 2,
      range: [-5, 5],
      step: 0.5,
      name: "Slope",
    },
    x: {
      input: "drag",
      default: 3,
      range: [-10, 10],
      step: 0.5,
    },
    b: {
      input: "drag",
      default: 1,
      range: [-10, 10],
      step: 0.5,
      name: "Y-Intercept",
    },
  },
  semantics: function ({ vars, data2d }) {
    vars.y = vars.m * vars.x + vars.b;
    data2d("linear", { x: vars.x, y: vars.y });
  },
};

function App() {
  return (
    <FormulizeProvider config={linearConfig}>
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
        <Formula
          id="linear-equation"
          style={{ height: "300px", width: "700px" }}
        />
      </div>
    </FormulizeProvider>
  );
}

export default App;
