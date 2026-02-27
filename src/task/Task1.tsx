import { Formula, Provider, latex, type Config } from "math-notation";
import { formulaContainerStyle } from "../styles";

const config: Config = {
  formulas: [
    {
      id: "expected-value",
      latex: "",
    },
  ],
  variables: {},
  semantics: function ({ vars }) {},
  fontSize: 1.5,
};

export default function Task1() {
  return (
    <Provider config={config}>
      <Formula id="expected-value" style={formulaContainerStyle} />
    </Provider>
  );
}
