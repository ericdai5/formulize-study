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
      id: "expected-value",
      latex: "",
    },
  ],
  variables: {},
  stepping: true,
  semantics: function ({ vars }) {},
  fontSize: 1.5,
};

export default function Task() {
  return (
    <Provider config={config}>
      <Formula id="expected-value" style={formulaContainerStyle} />
      <div style={{ marginTop: "10px" }}>
        <StepControl />
      </div>
    </Provider>
  );
}
