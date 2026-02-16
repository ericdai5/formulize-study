import { Formula, Provider, type Config } from "math-notation";

const config: Config = {
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
      name: "Velocity",
      input: "drag",
      default: 2,
      range: [0, 100],
      step: 1,
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
    <div className="flex flex-col items-center h-screen">
      <Provider config={config}>
        <Formula id="kinetic" style={{ height: "300px", width: "400px" }} />
      </Provider>
    </div>
  );
}

export default App;
