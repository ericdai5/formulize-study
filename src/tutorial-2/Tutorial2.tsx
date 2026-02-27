import { Formula, Provider, type Config } from "math-notation";
import { formulaContainerStyle } from "../styles";

const config: Config = {
  formulas: [
    {
      id: "gravity",
      latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
    },
  ],
  variables: {
    "\\vec{F}": {
      default: 0,
      name: "Gravitational Force",
      precision: 2,
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
      default: 80,
      name: "Mass of Person",
      precision: 0,
    },
    r: {
      default: 6.371e6,
      name: "Earth's radius",
      sigFigs: 4,
    },
  },
  semantics: function ({ vars }) {
    var G = vars.G;
    var m1 = vars.m_1;
    var m2 = vars.m_2;
    var r = vars.r;
    var product = m1 * m2;
    var squared = r * r;
    var fraction = product / squared;
    var force = G * fraction;
    vars["\\vec{F}"] = force;
  },
  fontSize: 1.5,
};

export default function Tutorial2() {
  return (
    <Provider config={config}>
      <Formula id="gravity" style={formulaContainerStyle} />
    </Provider>
  );
}
