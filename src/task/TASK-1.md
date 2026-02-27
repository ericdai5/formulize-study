# Task 1: Expected Value Formula

In this task, you will build an interactive formula that displays and computes expected value. The starter code provides an empty canvas with the essential imports already in place.

---

## Starter Code

Open `Task1.tsx`. You'll find a minimal config ready to be filled in:

```tsx
import { Formula, Provider, latex, type Config } from "math-notation";

const config: Config = {
  formulas: [],
  variables: {},
  semantics: function ({ vars }) {},
};
```

Your job is to fill in the config to display and compute the expected value formula.

---

## Task

Implement the formula for **expected value** with the following LaTeX:

```latex
E[X] = \sum_{i=1}^{n} x_i \cdot P(x_i)
```

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

4. **Correct result** — The semantics function computes the correct expected value:
   - $E[X] = 1(0.1) + 2(0.2) + 3(0.3) + 4(0.4) = 0.1 + 0.4 + 0.9 + 1.6 = 3.0$

5. **Live updates** — The computed $E[X]$ value displays in the formula.

---

## Hints

- Use array variables to store the outcomes and probabilities
- The semantics function should loop through the arrays to compute the sum
- Assign the final result to `vars["E[X]"]` so it displays in the formula

---

## Feel Free to Experiment

Don't limit yourself to just the requirements above. Feel free to improve the interactive formula in any way that makes it easier to understand. You might try different variable names, add extra labels, adjust the formula layout, or anything else that helps comprehension.

---

## Timing

You have **20 minutes** for this part. Once complete, proceed to **Task 2** to add step-by-step walkthroughs.
