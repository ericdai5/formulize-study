import { Formula, Provider, type Config } from "math-notation";

const config: Config = {
  formulas: [
    {
      id: "gravity",
      latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
    },
  ],
  variables: {
    "\\vec{F}": {
      name: "Gravitational Force",
    },
    G: {
      default: 6.674e-11,
      name: "Gravitational Constant",
      sigFigs: 4,
    },
    m_1: {
      default: 5.972e24,
      name: "Mass of Earth",
      sigFigs: 4,
    },
    m_2: {
      input: "drag",
      default: 80,
      range: [1, 200],
      step: 1,
      name: "Mass of Person",
      precision: 0,
    },
    r: {
      input: "drag",
      default: 6.371e6,
      range: [1e6, 1e7],
      step: 1e4,
      name: "Earth's radius",
      sigFigs: 4,
    },
  },
  semantics: function ({ vars }) {
    var force = (vars.G * vars.m_1 * vars.m_2) / (vars.r * vars.r);
    vars["\\vec{F}"] = force;
  },
  fontSize: 1.5,
};

export default function Tutorial1Solution() {
  return (
    <Provider config={config}>
      <Formula id="gravity" />
    </Provider>
  );
}
