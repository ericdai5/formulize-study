import { Formula, Provider, latex, type Config } from "math-notation";

const config: Config = {
  formulas: [],
  variables: {},
  semantics: function ({ vars }) {},
  fontSize: 1.5,
};

export default function Task2() {
  return (
    <Provider config={config}>
      <Formula id="expected-value" />
    </Provider>
  );
}
