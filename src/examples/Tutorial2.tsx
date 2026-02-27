import { Formula, Provider, type Config } from "math-notation";
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
  semantics: function ({ vars }) {
    var a = vars["\\vec{a}"];
    var b = vars["\\vec{b}"];
    vars.a_1 = a[0];
    vars.a_2 = a[1];
    vars.b_1 = b[0];
    vars.b_2 = b[1];
    var term1 = vars.a_1 * vars.b_2;
    var term2 = vars.a_2 * vars.b_1;
    var result = term1 - term2;
    vars["\\vec{c}"] = result;
  },
  fontSize: 1.5,
};

export default function Tutorial2() {
  return (
    <Provider config={config}>
      <Formula id="cross-product" style={formulaContainerStyle} />
    </Provider>
  );
}
