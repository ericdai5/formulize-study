# Task 2: Expected Value Step-by-Step Walkthrough

In this task, you will add step-by-step navigation to your expected value formula from Task 1. This will guide users through the computation one piece at a time.

---

## Starter Code

Open `Task2.tsx`. You'll find your Task 1 solution with stepping enabled but no steps defined yet:

```tsx
import { Formula, Provider, StepControl, latex, type Config } from "math-notation";

const config: Config = {
  formulas: [...],      // Your formula from Task 1
  variables: {...},     // Your variables from Task 1
  stepping: true,       // Stepping is now enabled
  semantics: function ({ vars, step }) {
    // Your computation from Task 1
    // Add step() calls to create the walkthrough
  },
};
```

The `StepControl` component is already rendered — it provides step navigation buttons (skip to start, previous, next, skip to end) and a progress bar.

---

## Task

Add `step()` calls to your semantics function to create an educational walkthrough of the expected value computation.

---

## Requirements

1. **Enable stepping** — Set `stepping: true` in your config and add `step` to your semantics function parameters.

2. **Create meaningful steps** — Break the computation into steps that help users understand:
   - What "weighting by probability" means
   - How each outcome contributes to the total
   - Why outcomes with higher probability have more influence on the result

3. **Use labels effectively** — At each step, highlight the relevant parts of the formula and show intermediate values.

4. **Use the `latex()` helper** — Format computed values appropriately using `.precision()` for clean display.

5. **Use string concatenation** — Combine descriptive text with formatted numbers to create readable labels:
   ```tsx
   "x_i \\cdot P(x_i)": "Contribution = " + latex(contribution).precision(2)
   ```

---

## Example Step Structure

Here's one way to structure your steps (you can organize differently):

1. **Introduction** — Show the formula and explain what we're computing
2. **Each outcome** — For each value/probability pair:
   - Highlight the current outcome value and probability
   - Show the contribution (value × probability)
   - Show the running total
3. **Final result** — Show the complete expected value

---

## Goal

Make the walkthrough as clear and educational as possible. Imagine a student encountering expected value for the first time — your walkthrough should help them build intuition for how probability-weighted averages work.

---

## Feel Free to Experiment

Don't limit yourself to just the requirements above. Feel free to improve the interactive formula in any way that makes it easier to understand. You might try different step structures, add extra explanatory text, highlight different parts of the formula, or anything else that helps comprehension.

---

## Timing

You have **25 minutes** for this part. Spend the time improving the quality and clarity of the walkthrough.
