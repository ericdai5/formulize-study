import {
  Formula,
  Provider,
  StepControl,
  latex,
  type Config,
} from "math-notation";
import { formulaContainerStyle } from "../styles";

const config: Config = {
  formulas: [
    {
      id: "cross-product",
      latex:
        "\\vec{a} \\times \\vec{b} = \\begin{pmatrix} a_1 \\\\ a_2 \\end{pmatrix} \\times \\begin{pmatrix} b_1 \\\\ b_2 \\end{pmatrix} = a_1 b_2 - a_2 b_1 = \\vec{c}",
    },
  ],
  variables: {
    "\\vec{a}": {
      default: [3, 2],
      name: "Vector a",
    },
    "\\vec{b}": {
      default: [1, 4],
      name: "Vector b",
    },
    a_1: {},
    a_2: {},
    b_1: {},
    b_2: {},
    "\\vec{c}": { name: "Cross product result" },
  },
  stepping: true,
  semantics: function ({ vars, step }) {
    // Extract components from the array variables
    var a = vars["\\vec{a}"];
    var b = vars["\\vec{b}"];

    // Assign to individual component variables so they display in the formula
    vars.a_1 = a[0];
    vars.a_2 = a[1];
    vars.b_1 = b[0];
    vars.b_2 = b[1];

    // Step 1: Compute a₁b₂
    var term1 = vars.a_1 * vars.b_2;
    step({
      description: "Multiply diagonally",
      labels: {
        "\\vec{a}": vars["\\vec{a}"],
        "\\vec{b}": vars["\\vec{b}"],
        a_1: vars.a_1,
        b_2: vars.b_2,
        "a_1 b_2": "$a_1 \\cdot b_2 = $ " + latex(term1).precision(0),
      },
    });

    // Step 2: Compute a₂b₁
    var term2 = vars.a_2 * vars.b_1;
    step({
      description: "Multiply the other diagonal",
      labels: {
        a_2: vars.a_2,
        b_1: vars.b_1,
        "a_2 b_1": "$a_2 \\cdot b_1 = $ " + latex(term2).precision(0),
      },
    });

    // Step 3: Subtract to get the result
    var result = term1 - term2;
    vars["\\vec{c}"] = result;
    step({
      description: "Subtract to get vector $\\vec{c}$",
      labels: {
        "a_1 b_2": "$a_1 b_2 = $ " + latex(term1).precision(0),
        "a_2 b_1": "$a_2 b_1 = $ " + latex(term2).precision(0),
        "\\vec{c}": latex(vars["\\vec{c}"]).precision(0),
      },
    });
  },
  fontSize: 1.5,
};

export default function Tutorial2Solution() {
  return (
    <Provider config={config}>
      <Formula id="cross-product" style={formulaContainerStyle} />
      <div style={{ marginTop: "10px" }}>
        <StepControl />
      </div>
    </Provider>
  );
}
