import { Formula, Provider, type Config } from "math-notation";

const config: Config = {
  formulas: [],
  variables: {},
  semantics: function ({ vars }) {},
  fontSize: 1.5,
};

export default function Task1() {
  return (
    <Provider config={config}>
      <Formula id="radioactive-decay" />
    </Provider>
  );
}
