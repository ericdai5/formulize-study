# Task 2: Expected Value Formula

## About the formula

When you roll a fair six-sided die, every outcome (1 through 6) is equally likely. The average result over many rolls is 3.5 — right in the middle. But what if the die is weighted, so some outcomes are more likely than others? The **expected value** tells you the long-run average in that case.

Expected value is one of the most fundamental concepts in probability and statistics. It answers the question: "If I repeated this random process many times, what would the average outcome be?" It shows up everywhere — in gambling (is this bet worth taking?), insurance (how much should a policy cost?), decision-making (which option has the best average payoff?), and machine learning (what's the average error of this model?).

The formula is:

$$
E = \sum_{x \in X} x \, P(x)
$$

- $X$ is the set of all possible outcomes
- $x$ is a single outcome value from that set
- $P(x)$ is the probability of that outcome occurring
- $E$ is the expected value — the probability-weighted average

The formula says: for each possible outcome $x$ in the set $X$, multiply its value by its probability, then add them all up. Outcomes that are more likely contribute more to the average. For example, with a weighted die where 4 comes up 40% of the time but 1 only comes up 10% of the time, the expected value will be pulled toward 4 — it's not just the simple average of the outcomes, but a *weighted* average that accounts for how likely each one is.

---

In this task, you will build an interactive formula that displays and computes expected value. The starter code provides an empty canvas with the essential imports already in place.

---

## Starter Code

Open `Task2.tsx`. You'll find a minimal config ready to be filled in:

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

Build an interactive formula for expected value using this LaTeX:

```latex
E = \sum_{x \in X} x P(x)
```

Use the library to make this formula come alive in whatever way you think best helps a reader understand expected value. There's no single right answer — get creative with it.

---

## Scenario: Weighted Die

The scenario is a weighted die where higher numbers are more likely. Here are the variables:

| Variable | Meaning                             |
|----------|-------------------------------------|
| $X$      | Set of possible outcomes            |
| $x$      | A single outcome value              |
| $P(x)$   | Probability of that outcome         |
| $E$      | Expected value (computed)           |

And the data for this particular die:

| Outcome ($x$) | Probability ($P(x)$) |
|----------------|----------------------|
| 1              | 0.1                  |
| 2              | 0.2                  |
| 3              | 0.3                  |
| 4              | 0.4                  |

With these values, the computation looks like:

$$
E = 1(0.1) + 2(0.2) + 3(0.3) + 4(0.4) = 0.1 + 0.4 + 0.9 + 1.6 = 3.0
$$

The expected value is 3.0 — pulled toward the higher outcomes because they have greater probability.

## Goal

Make the interactive formula as clear and educational as possible. Imagine a student encountering expected value for the first time — your formula should help them build intuition for how probability-weighted averages work.

Feel free to improve the interactive formula in any way that makes it easier to understand. You might try different variable names, add extra labels, adjust the formula layout, or anything else that helps comprehension.

---

## Timing

You have **20 minutes** for this part.
