import { Formula, Provider, type Config } from "math-notation";

const config: Config = {
  formulas: [
    {
      id: "gravity",
      latex: "",
    },
  ],
  variables: {},
  semantics: function ({ vars }) {},
  fontSize: 1.5,
};

export default function Tutorial1() {
  return (
    <Provider config={config}>
      <Formula id="gravity" />
    </Provider>
  );
}
