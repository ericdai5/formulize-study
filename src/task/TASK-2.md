# Expected Value Formula

## About the formula

Imagine you're at a casino deciding whether to place a bet. You might win big, or you might lose your money — but if you played the same bet hundreds of times, how much would you expect to come out ahead or behind _on average_? That's exactly what **expected value** tells you.

Expected value is one of the most fundamental concepts in probability and statistics. It answers the question: "If I repeated this random process many times, what would the average outcome be?" It shows up everywhere — in gambling (is this bet worth taking?), insurance (how much should a policy cost?), decision-making (which option has the best average payoff?), and machine learning (what's the average error of this model?).

This leads to the **expected value formula**:

$$
E = \sum_{x \in X} x \, P(x)
$$

In this formula:

- $X$ is the set of all possible outcomes
- $x$ is a single outcome value from that set
- $P(x)$ is the probability of that outcome occurring
- $E$ is the expected value — the probability-weighted average

The formula says: for each possible outcome $x$ in the set $X$, multiply its value by its probability, then add them all up. Outcomes that are more likely contribute more to the average. It's not just the simple average of the outcomes, but a _weighted_ average that accounts for how likely each one is. If one outcome is much more probable than another, it pulls the expected value toward itself.

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

Create an interactive formula for explaining expected value. You can start with this LaTeX:

```latex
E = \\sum_{x \\in X} x P(x)
```

Your goal is to augment the formula in a way that you think best helps a reader understand expected value. There's no single right answer. The only requirement is that your formula must include at least one step. We encourage you to get creative with this task and to try out alternatives.

---

### Example scenario: Roulette Bet on Red

One interesting scenario where expected value is applied is in gambling. You're at a roulette table and place a $\$10$ bet on red. An American roulette wheel has 38 slots: 18 red, 18 black, and 2 green (0 and 00). Each color represents a different outcome for your bet:

- **Red** — you win $\$10$ (net gain)
- **Black** — you lose $\$10$ (net loss)
- **Green** — you also lose $\$10$ (net loss)

Even though black and green both lose, they have different probabilities — and that matters for expected value. The data for this bet, broken out by color:

| Outcome      | Payoff ($x$) | Probability ($P(x)$) |
| ------------ | ------------ | -------------------- |
| Red (win)    | $+\$10$      | $0.47$               |
| Black (lose) | $-\$10$      | $0.47$               |
| Green (lose) | $-\$10$      | $0.06$               |

With these values, the computation looks like:

$$
E = 10(0.47) + (-10)(0.47) + (-10)(0.06) = -0.6
$$

Some interesting questions that arise in this scenario are:

- The expected value is - $\$0.60$ — meaning on average, you lose 60 cents every time you place this bet. Why is the game unfair?
- What if you changed the bet amount — how does that affect the expected value?
- What would the probabilities need to be for this to be a fair bet (expected value of zero)?
- These might be interesting questions to allow people to play with in your augmented formula.

---

## Task Duration

You have **30 minutes** for this part. Once the timer is up, your facilitator will let you know.
