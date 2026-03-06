import { Formula, Provider, StepControl, type Config } from "math-notation";

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
  stepping: true,
  semantics: function ({ vars, step, latex }) {
    var G = vars.G;
    var m1 = vars.m_1;
    var m2 = vars.m_2;
    var r = vars.r;

    // Step 1: Multiply the two masses
    var product = m1 * m2;
    step({
      labels: {
        m_1: m1,
        m_2: m2,
        "m_1 m_2": "Multiply the two masses = " + latex(product).sigfigs(4),
      },
    });

    // Step 2: Square the distance
    var squared = r * r;
    step({
      description: "Square the distance = " + latex(squared).sigfigs(4),
      labels: {
        r: r,
      },
    });

    // Step 3: Compute the final force
    var fraction = product / squared;
    var force = G * fraction;
    vars["\\vec{F}"] = force;
    step({
      description: "Multiply by $G$ to get force",
      labels: {
        "\\vec{F}": latex(vars["\\vec{F}"]).precision(2),
        G: vars.G,
        "m_1 m_2": latex(product).sigfigs(4),
        "r^2": latex(squared).sigfigs(3),
      },
    });
  },
  fontSize: 1.5,
};

export default function Tutorial2Solution() {
  return (
    <Provider config={config}>
      <div style={{ marginBottom: "24px" }}>
        <StepControl />
      </div>
      <Formula id="gravity" />
    </Provider>
  );
}
