# Task 1: Radioactive Decay Formula

## About the formula

Radioactive decay describes how unstable atoms break down over time. Every radioactive substance has a characteristic rate at which its atoms decay — some fast (in fractions of a second), some very slowly (over billions of years). The key insight is that the rate of decay is proportional to how many atoms are left: the more atoms you have, the more decay events happen per second, but each individual atom has the same fixed probability of decaying in any given moment.

This leads to the **exponential decay formula**:

$$
N(t) = N_0 \cdot e^{-\lambda t}
$$

- $N_0$ is how many atoms you start with
- $\lambda$ (lambda) is the **decay constant** — a number specific to each substance that captures how quickly it decays. A larger $\lambda$ means faster decay.
- $t$ is the time that has passed
- $N(t)$ is how many atoms remain after time $t$

The formula says: take the initial count, and multiply it by $e^{-\lambda t}$, which is a number that starts at 1 (when $t = 0$) and shrinks toward 0 as time increases. The result is a smooth curve that never quite reaches zero — there are always *some* atoms left, but fewer and fewer over time.

A useful concept is the **half-life** — the time it takes for half the atoms to decay. For Carbon-14, the half-life is about 5,730 years. This is why Carbon-14 dating works: by measuring how much Carbon-14 remains in an archaeological sample, scientists can estimate how old it is.

---

In this task, you will build an interactive formula that displays and computes radioactive decay. The starter code provides an empty canvas with the essential imports already in place.

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

Your job is to fill in the config to display and compute the radioactive decay formula.

---

## Task

Build an interactive formula for radioactive decay using this LaTeX:

```latex
N(t) = N_0 \cdot e^{-\lambda t}
```

Use the library to make this formula come alive in whatever way you think best helps a reader understand radioactive decay. There's no single right answer — get creative with it.

---

## Scenario: Carbon-14 Dating

The scenario is Carbon-14 dating of an archaeological sample. Here are the variables and some reasonable starting values:

| Variable        | Meaning                      | Example value     |
|-----------------|------------------------------|-------------------|
| $N_0$           | Initial number of atoms      | 1000              |
| $\lambda$       | Decay constant (per year)    | 0.000121          |
| $t$             | Time elapsed (years)         | 5730              |
| $N(t)$          | Remaining atoms (computed)   | ≈ 500             |

With these values, the computation looks like:

$$
N(t) = 1000 \cdot e^{-0.000121 \times 5730} \approx 500
$$

Since Carbon-14 has a half-life of ~5,730 years, roughly half the atoms remain after that time. In JavaScript, use `Math.exp()` to compute $e^x$.

## Goal

Make the interactive formula as clear and educational as possible. Imagine a student encountering radioactive decay for the first time — your formula should help them build intuition for how exponential decay works and why half-life is a useful concept.

Feel free to improve the interactive formula in any way that makes it easier to understand. You might try different variable names, add extra labels, adjust the formula layout, or anything else that helps comprehension.

---

## Timing

You have **20 minutes** for this part. Once complete, proceed to **Task 2**.
