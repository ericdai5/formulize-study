import { Formula, Provider, type Config } from "math-notation";

const config: Config = {
  formulas: [
    {
      id: "radioactive-decay",
      latex: "N(t) = N_0 \\cdot e^{-\\lambda t}",
    },
  ],
  variables: {
    "N(t)": {
      name: "Remaining atoms",
      precision: 0,
    },
    N_0: {
      input: "drag",
      default: 1000,
      range: [100, 5000],
      step: 100,
      name: "Initial number of atoms",
      precision: 0,
    },
    "\\lambda": {
      input: "drag",
      default: 0.000121,
      range: [0.00001, 0.001],
      step: 0.00001,
      name: "Decay constant (per year)",
      sigFigs: 3,
    },
    t: {
      input: "drag",
      default: 5730,
      range: [0, 20000],
      step: 100,
      name: "Time elapsed (years)",
      precision: 0,
    },
  },
  semantics: function ({ vars }) {
    var N0 = vars.N_0;
    var lambda = vars["\\lambda"];
    var t = vars.t;
    var remaining = N0 * Math.exp(-lambda * t);
    vars["N(t)"] = remaining;
  },
  fontSize: 1.5,
};

export default function Task1Solution() {
  return (
    <Provider config={config}>
      <Formula id="radioactive-decay" style={{ height: "350px", width: "800px" }} />
    </Provider>
  );
}
