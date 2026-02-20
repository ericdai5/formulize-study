import { Formula, Provider, StepControl, type Config } from "math-notation";

const config: Config = {
  formulas: [],
  variables: {},
  stepping: true,
  semantics: function () {},
};

function App() {
  return (
    <Provider config={config}>
      <Formula id="" style={{ height: "300px", width: "700px" }} />
      <StepControl />
    </Provider>
  );
}

export default App;
