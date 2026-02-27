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
      latex: "", // Copy your formula from Task 1
    },
  ],
  variables: {
    // Copy your variables from Task 1
  },
  stepping: true,
  semantics: function ({ vars }) {
    // Copy your computation from Task 1
    // Add step() calls to create the walkthrough
  },
  fontSize: 1.5,
};

export default function Task2() {
  return (
    <Provider config={config}>
      <Formula id="expected-value" style={formulaContainerStyle} />
      <div style={{ marginTop: "10px" }}>
        <StepControl />
      </div>
    </Provider>
  );
}
