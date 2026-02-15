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
    v: {
      input: "drag",
      default: 2,
      range: [0.1, 100],
      step: 1,
      name: "Velocity",
    },
  },
  semantics: function ({ vars }) {
    const m = 1;
    vars.K = 0.5 * m * Math.pow(vars.v, 2);
  },
  fontSize: 1.5,
  labelFontSize: 1.0,
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
