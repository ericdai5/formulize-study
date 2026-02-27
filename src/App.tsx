import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Tutorial1 from "./examples/Tutorial1";
import Tutorial1Solution from "./examples/Tutorial1Solution";
import Tutorial2 from "./examples/Tutorial2";
import Tutorial2Solution from "./examples/Tutorial2Solution";

type ExampleKey =
  | "tutorial1"
  | "tutorial1Solution"
  | "tutorial2"
  | "tutorial2Solution";

const examples: Record<
  ExampleKey,
  { name: string; component: React.ComponentType }
> = {
  tutorial1: {
    name: "Tutorial 1",
    component: Tutorial1,
  },
  tutorial1Solution: {
    name: "Tutorial 1: Solution",
    component: Tutorial1Solution,
  },
  tutorial2: {
    name: "Tutorial 2",
    component: Tutorial2,
  },
  tutorial2Solution: {
    name: "Tutorial 2: Solution",
    component: Tutorial2Solution,
  },
};

function App() {
  const [selected, setSelected] = useState<ExampleKey>("tutorial1");
  const Example = examples[selected].component;

  return (
    <div className="flex flex-col items-center h-screen p-4 bg-slate-50">
      {/* Example selector */}
      <div className="mb-6 relative">
        <select
          id="example-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value as ExampleKey)}
          className="appearance-none pl-4 pr-10 py-2 text-sm bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
        >
          {Object.entries(examples).map(([key, { name }]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {/* Render selected example */}
      <Example key={selected} />
    </div>
  );
}

export default App;
