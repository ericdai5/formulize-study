import React, { useEffect, useMemo, useState } from "react";

import {
  FormulaComponent,
  FormulizeProvider,
  VisualizationComponent,
  InlineVariable,
  EmbeddedFormula,
  Variable,
  register,
  type FormulizeConfig,
  type IFormula,
  type IVariablesUserInput,
  type IContext,
} from "formulize-math";

/**
 * Neural Network Forward Pass Example
 *
 * Demonstrates:
 * 1. Programmatic formula generation
 * 2. Custom visualization with EmbeddedFormula components at each node
 * 3. Formulas that expand on hover and have draggable input variables
 * 4. Real-time forward pass computation
 */

// Network architecture
const LAYERS = [3, 4, 4, 2];

// Activation function
const relu = (x: number) => Math.max(0, x);

// Layout constants
const VIZ_CONFIG = {
  width: 800,
  height: 480,
  nodeRadius: 22,
  layerSpacing: 170,
  nodeSpacing: 65,
  formulaWidth: 100,
  formulaHeight: 30,
};

const COLORS = {
  inputNode: "#4CAF50",
  hiddenNode: "#2196F3",
  outputNode: "#FF9800",
  nodeStroke: "#333",
  edgePositive: "#4CAF50",
  edgeNegative: "#F44336",
  edgeNeutral: "#aaa",
};

// =============================================================================
// Custom Neural Network Visualization
// =============================================================================

interface NeuralNetworkVizProps {
  context: IContext;
}

interface NodeInfo {
  id: string;
  layer: number;
  unit: number;
  x: number;
  y: number;
  type: "input" | "hidden" | "output";
  variableId: string;
  formulaId?: string;
}

const NeuralNetworkViz: React.FC<NeuralNetworkVizProps> = ({ context }) => {
  const [nodes, setNodes] = useState<NodeInfo[]>([]);

  const layers: number[] = (context.config as any)?.layers || LAYERS;

  // Build node positions
  useEffect(() => {
    const nodeList: NodeInfo[] = [];
    const totalWidth = (layers.length - 1) * VIZ_CONFIG.layerSpacing;
    const startX = (VIZ_CONFIG.width - totalWidth) / 2;

    layers.forEach((layerSize, layerIdx) => {
      const totalHeight = (layerSize - 1) * VIZ_CONFIG.nodeSpacing;
      const startY = (VIZ_CONFIG.height - totalHeight) / 2;

      for (let unit = 1; unit <= layerSize; unit++) {
        const x = startX + layerIdx * VIZ_CONFIG.layerSpacing;
        const y = startY + (unit - 1) * VIZ_CONFIG.nodeSpacing;

        const variableId = layerIdx === 0 ? `x_${unit}` : `h_${unit}_${layerIdx}`;
        const formulaId = layerIdx === 0 ? undefined : `formula_h_${unit}_${layerIdx}`;

        nodeList.push({
          id: `node_${layerIdx}_${unit}`,
          layer: layerIdx,
          unit,
          x,
          y,
          type: layerIdx === 0 ? "input" : layerIdx === layers.length - 1 ? "output" : "hidden",
          variableId,
          formulaId,
        });
      }
    });

    setNodes(nodeList);
  }, [layers]);

  // Generate edges using context.variables (provided by Formulize Canvas)
  const edges: { key: string; x1: number; y1: number; x2: number; y2: number; color: string; width: number }[] = [];

  for (let l = 1; l < layers.length; l++) {
    const currNodes = nodes.filter((n) => n.layer === l);
    const prevNodes = nodes.filter((n) => n.layer === l - 1);

    for (const curr of currNodes) {
      for (const prev of prevNodes) {
        const weightId = `w_${curr.unit}_${prev.unit}_${l}`;
        // Read from context.variables - this is updated by Formulize's Canvas
        const weight = context.variables[weightId] ?? 0;

        const color = weight > 0.05 ? COLORS.edgePositive : weight < -0.05 ? COLORS.edgeNegative : COLORS.edgeNeutral;
        const width = Math.max(0.5, Math.min(Math.abs(weight) * 2, 3));

        edges.push({
          key: `edge_${l}_${prev.unit}_${curr.unit}`,
          x1: prev.x + VIZ_CONFIG.nodeRadius,
          y1: prev.y,
          x2: curr.x - VIZ_CONFIG.nodeRadius,
          y2: curr.y,
          color,
          width,
        });
      }
    }
  }

  const getNodeColor = (type: NodeInfo["type"]) => {
    switch (type) {
      case "input": return COLORS.inputNode;
      case "output": return COLORS.outputNode;
      default: return COLORS.hiddenNode;
    }
  };

  const getAbbreviation = (node: NodeInfo) => {
    if (node.layer === 0) return `x_{${node.unit}}`;
    return `h_{${node.unit}}^{(${node.layer})}`;
  };

  return (
    <svg
      width={VIZ_CONFIG.width}
      height={VIZ_CONFIG.height}
      viewBox={`0 0 ${VIZ_CONFIG.width} ${VIZ_CONFIG.height}`}
      className="border border-gray-200 rounded-lg bg-white mx-auto block"
    >
      {/* Edges */}
      <g className="edges">
        {edges.map((edge) => (
          <line
            key={edge.key}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke={edge.color}
            strokeWidth={edge.width}
            strokeOpacity={0.6}
          />
        ))}
      </g>

      {/* Nodes */}
      <g className="nodes">
        {nodes.map((node) => {
          // Read from context.variables - updated by Formulize Canvas on changes
          const val = context.variables[node.variableId];
          const displayVal = typeof val === "number" ? val.toFixed(2) : "?";

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Formula above node */}
              <foreignObject
                x={-VIZ_CONFIG.formulaWidth / 2}
                y={-VIZ_CONFIG.nodeRadius - VIZ_CONFIG.formulaHeight - 3}
                width={VIZ_CONFIG.formulaWidth}
                height={VIZ_CONFIG.formulaHeight}
                style={{ overflow: "visible" }}
              >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  {node.formulaId ? (
                    <EmbeddedFormula
                      id={node.formulaId}
                      abbreviation={getAbbreviation(node)}
                      scale={0.6}
                      highlightOnHover={true}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "3px",
                        padding: "1px 3px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    />
                  ) : (
                    <EmbeddedFormula
                      id={`input_display_${node.variableId}`}
                      latex={getAbbreviation(node)}
                      scale={0.6}
                      highlightOnHover={false}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        borderRadius: "3px",
                        padding: "1px 3px",
                      }}
                    />
                  )}
                </div>
              </foreignObject>

              {/* Node circle */}
              <circle
                r={VIZ_CONFIG.nodeRadius}
                fill={getNodeColor(node.type)}
                stroke={COLORS.nodeStroke}
                strokeWidth={1.5}
              />

              {/* Value inside */}
              <text y={4} textAnchor="middle" fontSize="10px" fontWeight="bold" fill="white" style={{ pointerEvents: "none" }}>
                {displayVal}
              </text>
            </g>
          );
        })}
      </g>

      {/* Layer labels */}
      <g className="labels">
        {layers.map((_, i) => {
          const totalW = (layers.length - 1) * VIZ_CONFIG.layerSpacing;
          const x = (VIZ_CONFIG.width - totalW) / 2 + i * VIZ_CONFIG.layerSpacing;
          const label = i === 0 ? "Input" : i === layers.length - 1 ? "Output" : `Hidden ${i}`;
          return (
            <text key={i} x={x} y={VIZ_CONFIG.height - 12} textAnchor="middle" fontSize="11px" fill="#666">
              {label}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

// Register the visualization
register("NeuralNetwork", NeuralNetworkViz);

// =============================================================================
// Generate Neural Network Configuration
// =============================================================================

function generateNeuralNetwork(layers: number[]) {
  const formulas: IFormula[] = [];
  const variables: IVariablesUserInput = {};

  // Input variables
  const inputVars = Variable.vector("x", layers[0], {
    role: "input",
    default: () => Math.round((Math.random() * 2 - 1) * 100) / 100,
    range: [-2, 2],
    step: 0.05,
    precision: 2,
  });
  Object.assign(variables, inputVars);

  // For each layer after input
  for (let l = 1; l < layers.length; l++) {
    const currSize = layers[l];
    const prevSize = layers[l - 1];

    // Weights
    const weights = Variable.loop(
      { i: [1, currSize], j: [1, prevSize] },
      ({ i, j }) => [
        `w_${i}_${j}_${l}`,
        {
          role: "input" as const,
          default: Math.round((Math.random() * 2 - 1) * 100) / 100,
          range: [-2, 2],
          step: 0.05,
          precision: 2,
        },
      ]
    );
    Object.assign(variables, weights);

    // Biases
    for (let i = 1; i <= currSize; i++) {
      variables[`b_${i}_${l}`] = {
        role: "input",
        default: 0,
        range: [-2, 2],
        step: 0.05,
        precision: 2,
      };
    }

    // Computed variables and formulas
    for (let i = 1; i <= currSize; i++) {
      variables[`z_${i}_${l}`] = { role: "computed", precision: 3 };
      variables[`h_${i}_${l}`] = { role: "computed", precision: 3 };

      // Formula for h: shows the full computation
      const prevSymbol = l === 1 ? "x" : `h^{(${l - 1})}`;
      const latex = `h_{${i}}^{(${l})} = \\text{ReLU}\\left(\\sum_{j=1}^{${prevSize}} w_{${i}j}^{(${l})} ${prevSymbol}_j + b_{${i}}^{(${l})}\\right)`;

      formulas.push({
        id: `formula_h_${i}_${l}`,
        latex,
      });
    }
  }

  // Computation function
  const manual = (vars: Record<string, number>) => {
    for (let l = 1; l < layers.length; l++) {
      const currSize = layers[l];
      const prevSize = layers[l - 1];

      for (let i = 1; i <= currSize; i++) {
        let z = 0;
        for (let j = 1; j <= prevSize; j++) {
          const w = vars[`w_${i}_${j}_${l}`] ?? 0;
          const input = l === 1 ? (vars[`x_${j}`] ?? 0) : (vars[`h_${j}_${l - 1}`] ?? 0);
          z += w * input;
        }
        z += vars[`b_${i}_${l}`] ?? 0;
        vars[`z_${i}_${l}`] = z;
        vars[`h_${i}_${l}`] = relu(z);
      }
    }
  };

  return { formulas, variables, manual };
}

// =============================================================================
// Main Component
// =============================================================================

export const NeuralNetworkExample: React.FC = () => {
  const { formulas, variables, manual } = useMemo(() => generateNeuralNetwork(LAYERS), []);

  const config: FormulizeConfig = useMemo(() => ({
    formulas,
    variables,
    semantics: { engine: "manual", manual },
    visualizations: [
      {
        type: "custom" as const,
        component: "NeuralNetwork",
        variables: Object.keys(variables),
        update: { onVariableChange: true },
        config: { layers: LAYERS },
      },
    ],
  }), [formulas, variables, manual]);

  const totalWeights = LAYERS.slice(1).reduce((sum, n, i) => sum + n * LAYERS[i], 0);
  const totalBiases = LAYERS.slice(1).reduce((sum, n) => sum + n, 0);

  return (
    <FormulizeProvider config={config}>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Neural Network Forward Pass</h1>

        <p className="text-gray-700 mb-6">
          This {LAYERS.join(" → ")} network demonstrates <strong>programmatic formula generation</strong>.
          Each node shows a computed activation value. <strong>Hover over formulas above nodes</strong> to
          see the full equation, and <strong>drag input values</strong> in the expanded formulas to change them.
        </p>

        {/* Visualization - uses VisualizationComponent which handles reactivity */}
        <div className="mb-8">
          <VisualizationComponent
            type="custom"
            config={config.visualizations![0]}
            height={500}
          />
        </div>

        {/* Inputs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Inputs (drag to change)</h2>
          <div className="flex gap-6 justify-center">
            {Array.from({ length: LAYERS[0] }, (_, i) => (
              <div key={i} className="text-center">
                <div className="text-sm text-gray-500">x<sub>{i + 1}</sub></div>
                <div className="text-xl font-mono">
                  <InlineVariable id={`x_${i + 1}`} display="value" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Outputs</h2>
          <div className="flex gap-6 justify-center">
            {Array.from({ length: LAYERS[LAYERS.length - 1] }, (_, i) => (
              <div key={i} className="text-center bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-orange-600">h<sub>{i + 1}</sub><sup>({LAYERS.length - 1})</sup></div>
                <div className="text-2xl font-mono font-bold text-orange-700">
                  <InlineVariable id={`h_${i + 1}_${LAYERS.length - 1}`} display="value" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Formula */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Sample Formula</h2>
          <p className="text-gray-600 mb-3">
            Drag input values (x, weights, biases) in this formula to see the network update:
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <FormulaComponent id="formula_h_1_1" style={{ height: "120px" }} />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-50 rounded-lg p-4 text-sm">
          <strong>Statistics:</strong> {formulas.length} formulas, {totalWeights} weights, {totalBiases} biases —
          all generated programmatically using <code className="bg-blue-100 px-1 rounded">Variable.loop()</code> and
          <code className="bg-blue-100 px-1 rounded">Variable.vector()</code>.
        </div>
      </div>
    </FormulizeProvider>
  );
};

export default NeuralNetworkExample;
