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
  const defaultM = 1;
  const [m, setM] = useState(defaultM);
  const [v, setV] = useState(defaultV);

  const [vHovered, setVHovered] = useState(false);
  const [kHovered, setKHovered] = useState(false);
  const [mHovered, setMHovered] = useState(false);

  const K = 0.5 * m * v * v;
  const latex = `\\cssId{var-K}{K} = \\frac{1}{2} \\cssId{var-m}{m} \\cssId{var-v}{v}^2`;

  return (
    <div className="flex justify-center p-12">
      <FormulaContainer className="relative">
        <div style={{ fontSize: "1.5rem" }}>
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
            min={0}
            max={10}
            step={1}
          />
          <VariableHitArea
            elementId="var-m"
            isHovered={mHovered}
            onHover={setMHovered}
            value={m}
            onChange={setM}
            min={0}
            max={10}
            step={1}
          />
        </div>
        <div className="flex justify-center gap-8">
          <VariableLabel
            elementId="var-K"
            value={K}
            name="Kinetic Energy"
            isHovered={kHovered}
            onHover={setKHovered}
          />
          <VariableLabel
            elementId="var-m"
            value={m}
            name="Mass"
            isHovered={mHovered}
            onHover={setMHovered}
            onChange={setM}
            min={0}
            max={10}
            step={1}
          />
          <VariableLabel
            elementId="var-v"
            value={v}
            name="Velocity"
            isHovered={vHovered}
            onHover={setVHovered}
            onChange={setV}
            min={0}
            max={10}
            step={1}
          />
        </div>
        <ConnectingLines />
      </FormulaContainer>
    </div>
  );
}

export default App;
