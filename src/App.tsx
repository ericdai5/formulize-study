import { Formula, Provider, StepControl, type Config } from "math-notation";

const config: Config = {
  formulas: [],
  variables: {},
  stepping: true,
  semantics: function () {},
};

function App() {
  return (
    <div className="flex flex-col items-center h-screen">
      <Provider config={config}>
        <Formula id="" style={{ height: "300px", width: "700px" }} />
        <div style={{ width: "400px" }}>
          <StepControl />
        </div>
      </Provider>
    </div>
  );
}

export default App;
