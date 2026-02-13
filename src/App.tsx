import {
  Formula,
  FormulizeProvider,
  type FormulizeConfig,
} from "formulize-math";

const config: FormulizeConfig = {
  formulas: [
    {
      id: "kinetic",
      latex: "K = \\frac{1}{2}mv^2",
    },
  ],
  variables: {
    K: {
      name: "Kinetic Energy",
    },
    m: {
      input: "drag",
      default: 1,
      range: [0, 10],
      step: 1,
      name: "Mass",
    },
    v: {
      input: "drag",
      default: 2,
      range: [0, 100],
      step: 1,
      name: "Velocity",
    },
  },
  fontSize: 1.5,
  labelFontSize: 1,
  semantics: function ({ vars }) {
    vars.K = 0.5 * vars.m * Math.pow(vars.v, 2);
  },
};

function App() {
  return (
    <FormulizeProvider config={config}>
      <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
        <Formula id="kinetic" style={{ height: "300px", width: "700px" }} />
      </div>
    </FormulizeProvider>
  );
}

export default App;
