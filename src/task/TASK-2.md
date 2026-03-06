# Task 2: Expected Value Formula

## About the formula

Imagine you're at a casino deciding whether to place a bet. You might win big, or you might lose your money — but if you played the same bet hundreds of times, how much would you expect to come out ahead or behind *on average*? That's exactly what **expected value** tells you.

Expected value is one of the most fundamental concepts in probability and statistics. It answers the question: "If I repeated this random process many times, what would the average outcome be?" It shows up everywhere — in gambling (is this bet worth taking?), insurance (how much should a policy cost?), decision-making (which option has the best average payoff?), and machine learning (what's the average error of this model?).

The formula is:

$$
E = \sum_{x \in X} x \, P(x)
$$

- $X$ is the set of all possible outcomes
- $x$ is a single outcome value from that set
- $P(x)$ is the probability of that outcome occurring
- $E$ is the expected value — the probability-weighted average

The formula says: for each possible outcome $x$ in the set $X$, multiply its value by its probability, then add them all up. Outcomes that are more likely contribute more to the average. It's not just the simple average of the outcomes, but a *weighted* average that accounts for how likely each one is. If one outcome is much more probable than another, it pulls the expected value toward itself.

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

## Scenario: Roulette Bet on Red

You're at a roulette table and place a \$10 bet on red. An American roulette wheel has 38 slots: 18 red, 18 black, and 2 green (0 and 00). Each color represents a different outcome for your bet:

- **Red** — you win \$10 (net gain)
- **Black** — you lose \$10 (net loss)
- **Green** — you also lose \$10 (net loss)

Even though black and green both lose, they have different probabilities — and that matters for expected value. Here are the variables:

| Variable | Meaning                             |
|----------|-------------------------------------|
| $X$      | Set of possible net payoffs         |
| $x$      | A single payoff value               |
| $P(x)$   | Probability of that payoff          |
| $E$      | Expected value (computed)           |

And the data for this bet, broken out by color:

| Outcome       | Payoff ($x$) | Probability ($P(x)$) |
|---------------|--------------|----------------------|
| Red (win)     | +\$10        | 0.47                 |
| Black (lose)  | -\$10        | 0.47                 |
| Green (lose)  | -\$10        | 0.06                 |

With these values, the computation looks like:

$$
E = 10(0.47) + (-10)(0.47) + (-10)(0.06) = 4.7 + (-4.7) + (-0.6) = -0.6
$$

The expected value is -\$0.60 — meaning on average, you lose 60 cents every time you place this bet. Notice that the red and black terms nearly cancel each other out; it's the two green slots that create the house edge. Without green, the game would be perfectly fair.

## Goal

Make the interactive formula as clear and educational as possible. Imagine a student encountering expected value for the first time — your formula should help them build intuition for how probability-weighted averages work.

Feel free to improve the interactive formula in any way that makes it easier to understand. You might try different variable names, add extra labels, adjust the formula layout, or anything else that helps comprehension.

---

## Timing

You have **20 minutes** for this part.
