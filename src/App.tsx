import { useState } from "react";
import "./App.css";
import NeuralNetworkExample from "./NeuralNetwork";
import Kinetic2DExample from "./Kinetic2D";
import BayesVisualizationExample from "./BayesVisualization";
import MinimalSummation from "./MinimalSummation";

function App() {
  const [activeExample, setActiveExample] = useState<
    "kinetic" | "bayes" | "summation" | "neural"
  >("neural");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const examples = [
    { id: "neural", label: "Neural Network" },
    { id: "kinetic", label: "Kinetic Energy" },
    { id: "bayes", label: "Bayes Theorem" },
    { id: "summation", label: "Summation" },
  ];

  const currentExample = examples.find((ex) => ex.id === activeExample);

  return (
    <div className="relative min-h-screen">
      {/* Dropdown Menu - using fixed positioning to escape container constraints */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
          title={currentExample?.label}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-w-[200px]">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => {
                  setActiveExample(
                    example.id as "kinetic" | "bayes" | "summation" | "neural"
                  );
                  setDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap ${
                  activeExample === example.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-screen">
        {activeExample === "neural" ? (
          <NeuralNetworkExample />
        ) : activeExample === "kinetic" ? (
          <Kinetic2DExample />
        ) : activeExample === "bayes" ? (
          <BayesVisualizationExample />
        ) : (
          <MinimalSummation />
        )}
      </div>
    </div>
  );
}

export default App;
