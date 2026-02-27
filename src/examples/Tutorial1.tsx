import { Formula, Provider, type Config } from "math-notation";
import { formulaContainerStyle } from "../styles";

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
      <Formula id="gravity" style={formulaContainerStyle} />
    </Provider>
  );
}
