import React from "react";

import {
  FormulaComponent,
  FormulizeProvider,
  InlineFormula,
  InlineVariable,
  type FormulizeConfig,
} from "formulize-math";

// ============================================================================
// Mann-Whitney U Test Example
// Based on the Wikipedia "Tortoise and Hare" example:
// https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test
//
// Default ranks (from finish order T H H H H H T T T T T H):
// - Tortoises: 1, 7, 8, 9, 10, 11 → sum = 46
// - Hares: 2, 3, 4, 5, 6, 12 → sum = 32
//
// Expected results: R_T=46, R_H=32, U_T=11, U_H=25, U=11
// ============================================================================

const mannWhitneyConfig: FormulizeConfig = {
  formulas: [
    // Step 1: Sum of ranks
    {
      id: "r1-sum",
      latex: "{R_T} = {t_1} + {t_2} + {t_3} + {t_4} + {t_5} + {t_6}",
    },
    {
      id: "r2-sum",
      latex: "{R_H} = {h_1} + {h_2} + {h_3} + {h_4} + {h_5} + {h_6}",
    },
    // Step 2: U statistic formulas
    {
      id: "u1-formula",
      latex: "{U_T} = {n_T} \\cdot {n_H} + \\frac{{n_T}({n_T}+1)}{2} - {R_T}",
    },
    {
      id: "u2-formula",
      latex: "{U_H} = {n_T} \\cdot {n_H} + \\frac{{n_H}({n_H}+1)}{2} - {R_H}",
    },
    {
      id: "u-final",
      latex: "{U} = \\min({U_T}, {U_H})",
    },
    // Step 3: Normal approximation
    {
      id: "mu-u",
      latex: "{\\mu_U} = \\frac{{n_T} \\cdot {n_H}}{2}",
    },
    {
      id: "sigma-u",
      latex: "{\\sigma_U} = \\sqrt{\\frac{{n_T} \\cdot {n_H} \\cdot ({n_T} + {n_H} + 1)}{12}}",
    },
    {
      id: "z-score",
      latex: "{z} = \\frac{{U} - {\\mu_U}}{{\\sigma_U}}",
    },
    // Inline formulas for prose explanations (no variable binding - just symbols)
    {
      id: "u-formula-inline",
      latex: "U = n_1 \\cdot n_2 + \\frac{n_1(n_1+1)}{2} - R_1",
    },
    {
      id: "z-formula-inline",
      latex: "z = \\frac{U - \\mu_U}{\\sigma_U}",
    },
  ],
  variables: {
    // Tortoise ranks - INPUT variables with drag interaction
    t_1: { role: "input", precision: 0, default: 1, range: [1, 12], step: 1, name: "t₁", latexDisplay: "value"},
    t_2: { role: "input", precision: 0, default: 7, range: [1, 12], step: 1, name: "t₂", latexDisplay: "value"},
    t_3: { role: "input", precision: 0, default: 8, range: [1, 12], step: 1, name: "t₃", latexDisplay: "value"},
    t_4: { role: "input", precision: 0, default: 9, range: [1, 12], step: 1, name: "t₄", latexDisplay: "value"},
    t_5: { role: "input", precision: 0, default: 10, range: [1, 12], step: 1, name: "t₅", latexDisplay: "value"},
    t_6: { role: "input", precision: 0, default: 11, range: [1, 12], step: 1, name: "t₆", latexDisplay: "value"},
    // Hare ranks - INPUT variables with drag interaction
    h_1: { role: "input", precision: 0, default: 2, range: [1, 12], step: 1, name: "h₁", latexDisplay: "value"},
    h_2: { role: "input", precision: 0, default: 3, range: [1, 12], step: 1, name: "h₂", latexDisplay: "value"},
    h_3: { role: "input", precision: 0, default: 4, range: [1, 12], step: 1, name: "h₃", latexDisplay: "value"},
    h_4: { role: "input", precision: 0, default: 5, range: [1, 12], step: 1, name: "h₄", latexDisplay: "value"},
    h_5: { role: "input", precision: 0, default: 6, range: [1, 12], step: 1, name: "h₅", latexDisplay: "value"},
    h_6: { role: "input", precision: 0, default: 12, range: [1, 12], step: 1, name: "h₆", latexDisplay: "value"},
    // Sample sizes - CONSTANTS (fixed)
    n_T: { role: "constant", precision: 0, default: 6, name: "n_T", latexDisplay: "value"},
    n_H: { role: "constant", precision: 0, default: 6, name: "n_H", latexDisplay: "value"},
    // Sum of ranks (computed)
    R_T: { role: "computed", precision: 0, name: "R_T", latexDisplay: "name", labelDisplay: "value" },
    R_H: { role: "computed", precision: 0, name: "R_H", latexDisplay: "name", labelDisplay: "value" },
    // U statistics (computed)
    U_T: { role: "computed", precision: 0, name: "U_T", latexDisplay: "name", labelDisplay: "value" },
    U_H: { role: "computed", precision: 0, name: "U_H", latexDisplay: "name", labelDisplay: "value" },
    U: { role: "computed", precision: 0, name: "U", latexDisplay: "name", labelDisplay: "value" },
    // Normal approximation parameters
    "\\mu_U": { role: "computed", precision: 2, name: "μ_U", latexDisplay: "name", labelDisplay: "value" },
    "\\sigma_U": { role: "computed", precision: 2, name: "σ_U", latexDisplay: "name", labelDisplay: "value" },
    z: { role: "computed", precision: 3, name: "z", latexDisplay: "name", labelDisplay: "value" },
  },
  semantics: {
    engine: "manual",
    manual: (vars) => {
      // Sum of ranks
      const R_T = vars.t_1 + vars.t_2 + vars.t_3 + vars.t_4 + vars.t_5 + vars.t_6;
      const R_H = vars.h_1 + vars.h_2 + vars.h_3 + vars.h_4 + vars.h_5 + vars.h_6;
      vars.R_T = R_T;
      vars.R_H = R_H;

      const n1 = vars.n_T;
      const n2 = vars.n_H;

      // U statistics
      const U_T = n1 * n2 + (n1 * (n1 + 1)) / 2 - R_T;
      const U_H = n1 * n2 + (n2 * (n2 + 1)) / 2 - R_H;
      vars.U_T = U_T;
      vars.U_H = U_H;
      vars.U = Math.min(U_T, U_H);

      // Normal approximation
      const muU = (n1 * n2) / 2;
      const sigmaU = Math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12);
      vars["\\mu_U"] = muU;
      vars["\\sigma_U"] = sigmaU;
      vars.z = (vars.U - muU) / sigmaU;
    },
  },
  fontSize: 1.3,
};

export const MannWhitneyExample: React.FC = () => {
  return (
    <FormulizeProvider config={mannWhitneyConfig}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Mann-Whitney U Test</h1>

        <p className="mb-6 text-gray-700">
          The Mann-Whitney U test compares two independent samples to determine
          if one group tends to have larger values than the other. It's a
          non-parametric alternative to the independent t-test.
        </p>

        {/* Story */}
        <section className="mb-8 bg-amber-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">The Tortoise and Hare Race</h2>
          <p>
            Aesop races <InlineVariable id="n_T" display="value" /> tortoises
            against <InlineVariable id="n_H" display="value" /> hares. The finish
            order is <strong>T H H H H H T T T T T H</strong>. The ranks below
            reflect this order. Drag them to explore different scenarios!
          </p>
        </section>

        {/* Step 1: Sum of Ranks */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Step 1: Sum of Ranks</h2>
          <p className="mb-4 text-gray-700">
            First, we rank all 12 animals by finish position (1 = first place).
            Then we sum the ranks for each group. The tortoise ranks
            sum to <InlineVariable id="R_T" display="both" />, and the hare
            ranks sum to <InlineVariable id="R_H" display="both" />.
          </p>
          <div className="grid grid-cols-1 gap-6">
            <FormulaComponent id="r1-sum" style={{ height: "180px" }} />
            <FormulaComponent id="r2-sum" style={{ height: "180px" }} />
          </div>
        </section>

        {/* Step 2: U Statistics */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Step 2: U Statistics</h2>
          <p className="mb-4 text-gray-700">
            The U statistic measures how many times members of one group
            beat members of the other. Using the indirect method, we
            compute <InlineFormula id="u-formula-inline" scale={0.9} />.
            This gives us <InlineVariable id="U_T" display="both" /> for
            tortoises and <InlineVariable id="U_H" display="both" /> for hares.
            The test statistic is the smaller value: <InlineVariable id="U" display="both" />.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormulaComponent id="u1-formula" style={{ height: "200px" }} />
            <FormulaComponent id="u2-formula" style={{ height: "200px" }} />
          </div>
          <div className="mt-4">
            <FormulaComponent id="u-final" style={{ height: "150px" }} />
          </div>
        </section>

        {/* Step 3: Significance Testing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Step 3: Normal Approximation</h2>
          <p className="mb-4 text-gray-700">
            For larger samples, we can approximate the distribution of U with a
            normal distribution. Under the null hypothesis (no difference between
            groups), U has mean <InlineVariable id="\mu_U" display="both" /> and
            standard deviation <InlineVariable id="\sigma_U" display="both" />.
            We compute a z-score using <InlineFormula id="z-formula-inline" scale={0.9} /> to
            assess significance.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
            <FormulaComponent id="mu-u" style={{ height: "180px" }} />
            <FormulaComponent id="sigma-u" style={{ height: "180px" }} />
          </div>
          <FormulaComponent id="z-score" style={{ height: "180px" }} />
        </section>

        {/* Interpretation */}
        <section className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Interpretation</h2>
          <p className="mb-3">
            With the default race results, we get <InlineVariable id="U" display="both" /> and
            z = <InlineVariable id="z" display="value" />. The z-score tells us how
            far U is from its expected value under the null hypothesis (no difference
            between groups).
          </p>
          <p className="mb-3">
            <strong>What z-scores mean:</strong> If |z| &gt; 1.96, the result is
            significant at the 5% level (p &lt; 0.05). If |z| &gt; 2.58, it's
            significant at the 1% level (p &lt; 0.01). Our z = <InlineVariable id="z" display="value" /> is
            highly significant, providing strong evidence that tortoises and hares
            differ in racing performance.
          </p>
          <p className="mb-3">
            We can verify U = <InlineVariable id="U" display="value" /> using
            the <strong>direct method</strong>: count how many hares each tortoise
            beats. The first tortoise (rank 1) beats all 6 hares. The remaining
            5 tortoises (ranks 7-11) each beat only the slowest hare (rank 12).
            Total: 6 + 1 + 1 + 1 + 1 + 1 = 11.
          </p>
          <p>
            Try dragging the rank values above to explore. When ranks are more
            mixed between groups, U increases toward <InlineVariable id="\mu_U" display="value" /> and
            z approaches zero (no significant difference).
          </p>
        </section>
      </div>
    </FormulizeProvider>
  );
};

export default MannWhitneyExample;
