import { ChevronDown } from "lucide-react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Tutorial1 from "./examples/Tutorial1";
import Tutorial1Solution from "./examples/Tutorial1Solution";
import Tutorial2 from "./examples/Tutorial2";
import Tutorial2Solution from "./examples/Tutorial2Solution";
import Task from "./examples/Task";

type ExampleKey =
  | "tutorial1"
  | "tutorial1Solution"
  | "tutorial2"
  | "tutorial2Solution"
  | "task";

const examples: Record<
  ExampleKey,
  { name: string; path: string; component: React.ComponentType }
> = {
  tutorial1: {
    name: "Tutorial 1",
    path: "/tutorial-1",
    component: Tutorial1,
  },
  tutorial1Solution: {
    name: "Tutorial 1: Solution",
    path: "/tutorial-1/solution",
    component: Tutorial1Solution,
  },
  tutorial2: {
    name: "Tutorial 2",
    path: "/tutorial-2",
    component: Tutorial2,
  },
  tutorial2Solution: {
    name: "Tutorial 2: Solution",
    path: "/tutorial-2/solution",
    component: Tutorial2Solution,
  },
  task: {
    name: "Task",
    path: "/task",
    component: Task,
  },
};

function ExampleSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentKey =
    (Object.entries(examples).find(
      ([, { path }]) => path === location.pathname
    )?.[0] as ExampleKey) || "tutorial1";

  return (
    <div className="mb-6 relative">
      <select
        id="example-select"
        value={currentKey}
        onChange={(e) => {
          const key = e.target.value as ExampleKey;
          navigate(examples[key].path);
        }}
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
  );
}

function AppLayout() {
  return (
    <div className="flex flex-col items-center h-screen p-4 bg-slate-50">
      <ExampleSelector />
      <Routes>
        <Route path="/" element={<Navigate to="/tutorial-1" replace />} />
        {Object.entries(examples).map(([key, { path, component: Component }]) => (
          <Route key={key} path={path} element={<Component />} />
        ))}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
