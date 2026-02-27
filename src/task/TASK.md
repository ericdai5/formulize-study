# Task: Expected Value Step-by-Step Walkthrough

In this task, you will build an interactive formula with a step-by-step computation walkthrough. The starter code provides an empty canvas with the essential imports already in place.

---

## Starter Code

Open `Task.tsx`. You'll find a minimal config ready to be filled in:

```tsx
import { Formula, Provider, StepControl, latex, type Config } from "math-notation";

const config: Config = {
  formulas: [],
  variables: {},
  stepping: true,
  semantics: function ({ vars, step }) {},
};
```

The `StepControl` component is already rendered — it provides step navigation buttons (skip to start, previous, next, skip to end) and a progress bar. Your job is to fill in the config to make it work.

---

## Task

Implement the formula for **expected value** with the following LaTeX:

```latex
E[X] = \sum_{i=1}^{n} x_i \cdot P(x_i)
```

Your implementation must produce a step-by-step walkthrough of the computation that a user can navigate through using the `StepControl`.

---

## Requirements

1. **Formula display** — The formula renders correctly:

$$
E[X] = \sum_{i=1}^{n} x_i \cdot P(x_i)
$$

2. **Scenario** — A weighted die with these outcomes and probabilities:

| Outcome | Value ($x_i$) | Probability ($P(x_i)$) |
|---------|---------------|------------------------|
| 1       | 1             | 0.1                    |
| 2       | 2             | 0.2                    |
| 3       | 3             | 0.3                    |
| 4       | 4             | 0.4                    |

3. **Variable labels** — Each variable has a descriptive name:
   - $E[X]$ : Expected Value
   - $n$ : Number of outcomes
   - $i$ : Outcome index
   - $x_i$ : Outcome value
   - $P(x_i)$ : Probability of outcome

4. **Step-by-step walkthrough** — A user can step through the computation and understand how expected value is calculated. The walkthrough should be educational.

5. **Correct result** — The final expected value is correct:
   - $E[X] = 1(0.1) + 2(0.2) + 3(0.3) + 4(0.4) = 0.1 + 0.4 + 0.9 + 1.6 = 3.0$

6. **Live updates** — At each stage, the relevant variable values update in the formula display.

---

## Goal

Make the step-by-step walkthrough as clear and educational as you can. Imagine a student encountering expected value for the first time — your walkthrough should help them understand:

- What "weighting by probability" means
- How each outcome contributes to the total
- Why outcomes with higher probability have more influence on the result

---

## Timing

You have **45 minutes**. Spend the time improving the quality and clarity of the walkthrough.
