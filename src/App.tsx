/**
 * STUDY TASK FILE - This is the ONLY file you need to edit for the tasks.
 * The UI helper components (VariableLabel, VariableHitArea, ConnectingLines)
 * are imported from ui.tsx and do not need to be modified.
 */

import { useState } from "react";
import {
  Formula,
  VariableLabel,
  VariableHitArea,
  ConnectingLines,
  FormulaContainer,
} from "./ui";

function App() {
  const defaultV = 2;
  const [v, setV] = useState(defaultV);
  const [vHovered, setVHovered] = useState(false);
  const [kHovered, setKHovered] = useState(false);

  const m = 1;
  const K = 0.5 * m * v * v;
  const latex = `\\cssId{var-K}{K} = \\frac{1}{2} m \\cssId{var-v}{v}^2`;

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <div className="bg-white p-6 w-full max-w-4xl">
        <FormulaContainer className="relative">
          <div className="flex justify-center" style={{ fontSize: "1.5rem" }}>
            <Formula latex={latex} />
            <VariableHitArea
              elementId="var-K"
              isHovered={kHovered}
              onHover={setKHovered}
            />
            <VariableHitArea
              elementId="var-v"
              isHovered={vHovered}
              onHover={setVHovered}
              value={v}
              onChange={setV}
              min={0.1}
              max={10}
              step={0.1}
            />
          </div>
          <div className="flex justify-center gap-8">
            <VariableLabel
              elementId="var-K"
              value={K}
              unit="J"
              name="Kinetic Energy"
              isHovered={kHovered}
              onHover={setKHovered}
            />
            <VariableLabel
              elementId="var-v"
              value={v}
              unit="m/s"
              name="Velocity"
              isHovered={vHovered}
              onHover={setVHovered}
              onChange={setV}
              min={0.1}
              max={10}
              step={0.1}
            />
          </div>
          <ConnectingLines />
        </FormulaContainer>
      </div>
    </div>
  );
}

export default App;
