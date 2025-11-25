import React from "react";

import {
  FormulaComponent,
  FormulizeProvider,
  VisualizationComponent,
  InlineFormula,
  InlineVariable,
  type FormulizeConfig,
} from "formulize-math";

const kineticConfig: FormulizeConfig = {
  formulas: [
    {
      id: "kinetic-energy",
      latex: "K = \\frac{1}{2}mv^2",
    },
  ],
  variables: {
    K: {
      role: "computed",
      units: "J",
      name: "Kinetic Energy",
      precision: 2,
    },
    m: {
      role: "input",
      value: 1,
      range: [0.1, 10],
      step: 1,
      units: "kg",
      name: "Mass",
    },
    v: {
      role: "input",
      value: 2,
      range: [0.1, 100],
      step: 1,
      units: "m/s",
      name: "Velocity",
    },
  },
  computation: {
    engine: "manual",
    expressions: {
      "kinetic-energy": "{K} = 0.5 * {m} * {v} * {v}",
    },
    manual: function (vars) {
      const m = vars.m;
      const v = vars.v;
      return 0.5 * m * Math.pow(v, 2);
    },
  },
  visualizations: [
    {
      type: "plot2d" as const,
      xAxis: "v",
      yAxis: "K",
    },
  ],
  fontSize: 1.5,
};

export const Kinetic2DExample: React.FC = () => {
  return (
    <FormulizeProvider config={kineticConfig}>
      <p className="text-black-700 leading-relaxed">
        The kinetic energy formula{" "}
        <InlineFormula id="kinetic-energy" scale={1.0} /> shows that energy
        depends on both mass and velocity. With mass{" "}
        <InlineVariable id="m" display="withUnits" /> and velocity{" "}
        <InlineVariable id="v" display="withUnits" />, the kinetic energy is{" "}
        <InlineVariable id="K" display="withUnits" />. Doubling velocity
        quadruples the energy, while doubling mass only doubles it.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 mt-4">
        <FormulaComponent id="kinetic-energy" style={{ height: "200px" }} />
        {kineticConfig.visualizations && kineticConfig.visualizations[0] && (
          <VisualizationComponent
            type="plot2d"
            config={kineticConfig.visualizations[0]}
            height={400}
          />
        )}
      </div>
    </FormulizeProvider>
  );
};

export default Kinetic2DExample;
