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
      expression: "{K} = 0.5 * {m} * {v} * {v}",
      manual: function (vars) {
        const m = vars.m;
        const v = vars.v;
        return 0.5 * m * Math.pow(v, 2);
      },
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
  },
  visualizations: [
    {
      type: "plot2d" as const,
      xAxis: "v",
      yAxis: "K",
      height: 400,
      width: 400,
      lines: [
        {
          name: "Kinetic Energy Formula",
        },
      ],
    },
  ],
  fontSize: 1,
};

export const Kinetic2DExample: React.FC = () => {
  return (
    <FormulizeProvider config={kineticConfig}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Kinetic Energy</h2>
        <p className="text-black-700 leading-relaxed">
          The kinetic energy formula <InlineFormula id="kinetic-energy" scale={1.0} /> shows
          that energy depends on both mass and velocity. With
          mass <InlineVariable id="m" display="withUnits" /> and
          velocity <InlineVariable id="v" display="withUnits" />, the kinetic
          energy is <InlineVariable id="K" display="withUnits" />. Doubling
          velocity quadruples the energy, while doubling mass only doubles it.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <div>
          <FormulaComponent id="kinetic-energy" style={{ height: "200px" }} />
        </div>
        <div>
          {kineticConfig.visualizations && kineticConfig.visualizations[0] && (
            <VisualizationComponent
              type="plot2d"
              config={kineticConfig.visualizations[0]}
              height={400}
            />
          )}
        </div>
      </div>
    </FormulizeProvider>
  );
};

export default Kinetic2DExample;
