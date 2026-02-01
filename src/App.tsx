import { useState } from "react";
import katex from "katex";

/**
 * AI Condition - Formula Visualization Study
 *
 * Your task: Build an interactive formula visualization using React, KaTeX, and D3.
 *
 * Available tools:
 * - KaTeX: Render LaTeX math formulas (see example below)
 * - D3.js: Create SVG visualizations
 * - React state: Make values interactive
 *
 * Use Claude Code to help you build your visualization!
 */

// Example: Render a KaTeX formula
function Formula({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function App() {
  // Example interactive state - modify this for your visualization
  const [value, setValue] = useState(5);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Formula Visualization</h1>

      <p className="text-gray-600 mb-8">
        Build your interactive formula visualization here. Use Claude Code to help!
      </p>

      {/* Example: Static formula */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Example: Static Formula</h2>
        <Formula latex="E = mc^2" />
      </div>

      {/* Example: Interactive formula with slider */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Example: Interactive Value</h2>
        <Formula latex={`x = ${value}`} />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drag to change x:
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Your visualization goes here */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-64">
        <h2 className="text-lg font-semibold mb-4 text-gray-400">
          Your Visualization Here
        </h2>
        <p className="text-gray-400">
          Start building your interactive formula visualization...
        </p>
      </div>
    </div>
  );
}

export default App;
