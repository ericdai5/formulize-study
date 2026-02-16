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
    m: {
      name: "Mass",
      input: "drag",
      default: 1,
      range: [0, 10],
      step: 1,
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
    vars.K = 0.5 * vars.m * Math.pow(vars.v, 2);
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
