# Radioactive Decay Formula

## About the formula

Radioactive decay describes how unstable atoms break down over time. Every radioactive substance has a characteristic rate at which its atoms decay — some fast (in fractions of a second), some very slowly (over billions of years). The time it takes for half the atoms to decay is called a half-life.

One important scientific discovery was that the rate of radioactive decay is proportional to how many atoms are left in the material: the more atoms you have, the more decay events happen per second. But each individual atom has the same fixed probability of decaying in any given moment, where that probability is determined by the substance.

This leads to the **exponential decay formula**:

$$
N(t) = N_0 \cdot e^{-\lambda t}
$$

In this formula:

- $N_0$ represents how many atoms there are at the beginning of a decay period
- $\lambda$ (lambda) is the **decay constant** — a number specific to each substance that captures how quickly it decays. A larger $\lambda$ means faster decay.
- $t$ is the time that has passed since the start of the decay period
- $N(t)$ is a prediction of how many atoms will remain after $t$ has passed

The formula can be pictured as a smooth curve that gradually approaches zero.

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

Create an interactive formula for explaining radioactive decay. You can start with this LaTeX:

```latex
N(t) = N_0 \\cdot e^{-\\lambda t}
```

Your goal is to augment the formula in a way that you think best helps a reader understand radioactive decay. There's no single right answer. We encourage you to get creative with this task and to try out alternatives.

---

### Example scenario: Carbon-14 Dating

One interesting scenario where radioactive decay is applied is in carbon-14 dating. Carbon-14 is a particular compound sometimes found in archeological sample. A scientist can estimate the age of a sample by observing the relationship between an estimated starting amount of carbon-14 and the current amount that they can measure. The decay constant for carbon-14 is 0.000121.

Some interesting questions that arise in this scenario are:

- What is the half-life for carbon-14? In other words, what is the amount of time it takes for the amount of carbon-14 in a substance to halve?
- Given a measured quantity of carbon-14 in a sample and an estimate of the initial amount, how much time has likely passed?
- These might be interesting questions to allow people to play with in your augmented formula.

---

## Task Duration

You have **30 minutes** for this part. Once the timer is up, your facilitator will let you know.
