## How to Add Step-by-Step Walkthroughs

In Tutorial 1, you built an interactive formula where readers could drag variables and watch results update. But for multi-step calculations, seeing just the final answer isn't enough — readers need to understand *how* you get there.

Stepping solves this. Instead of showing everything at once, you guide readers through a calculation one piece at a time. At each step, parts of the formula highlight and labels appear to show intermediate values. Readers control the pace with navigation buttons.

By the end of this tutorial, you'll be able to turn any multi-step calculation into a guided walkthrough.

This tutorial builds on Tutorial 1. You should already know how to create a config with `formulas`, `variables`, and `semantics`.

---

### Starting Point

Open `Tutorial2.tsx`. You'll find a working gravitational force formula already set up:

- **Formula**: Newton's law of universal gravitation: $\vec{F} = G \frac{m_1 m_2}{r^2}$
- **Variables**: `G` (gravitational constant), `m_1` (mass of Earth), `m_2` (mass of a person), `r` (Earth's radius), and `\vec{F}` (the resulting force)
- **Semantics**: The calculation multiplies the masses, squares the distance, and computes the gravitational force

The formula displays and computes correctly, but there's no stepping — readers see everything at once. Your task is to add step-by-step navigation so readers can follow the calculation one piece at a time.

#### Scientific Notation and Significant Figures

Notice that variables use scientific notation and specify significant figures:

```tsx
G: {
  default: 6.674e-11,
  name: "Gravitational Constant",
  sigFigs: 4,
},
m_1: {
  default: 5.972e24,
  name: "Mass of Earth",
  sigFigs: 4,
},
```

The `sigFigs` option controls how many significant figures display for very large or small numbers.

#### Computing Derived Values

The semantics function reads variable values and computes the result:

```tsx
semantics: function ({ vars }) {
  var G = vars.G;
  var m1 = vars.m_1;
  var m2 = vars.m_2;
  var r = vars.r;
  var product = m1 * m2;
  var squared = r * r;
  var fraction = product / squared;
  var force = G * fraction;
  vars["\\vec{F}"] = force;
}
```

This pattern — reading from `vars`, computing intermediate values, and writing the result back to `vars` — is how you build up complex calculations.

---

### Step 1: Enable stepping in your config

Some calculations are too complex to grasp all at once. By enabling stepping, you let readers move through the math one piece at a time — building understanding as they go.

Add `stepping: true` to your config and include `step` in the semantics function parameters:

```tsx
const config: Config = {
  formulas: [...],
  variables: {...},
  stepping: true,
  semantics: function ({ vars, step }) {
    // computation with step() calls
  },
};
```

### Step 2: Create steps in your semantics function

Now you need to decide where the natural breakpoints are in your calculation. Each `step()` call captures a snapshot that the user can navigate to — think of them as "pause here and explain" moments.

Call `step()` at key points in your calculation:

```tsx
semantics: function ({ vars, step }) {
  var m1 = vars.m_1;
  var m2 = vars.m_2;
  var product = m1 * m2;
  step({
    labels: {
      m_1: m1,
      m_2: m2,
    },
  });

  var r = vars.r;
  var squared = r * r;
  step({
    description: "Square the distance",
    labels: {
      r: r,
    },
  });
}
```

### Step 3: Add labels to highlight parts of the formula

Steps alone tell readers *when* to pause, but not *where* to look. Labels draw the eye to the relevant part of the formula and show computed values — connecting the abstract symbols to concrete numbers.

The `labels` object maps keys to display values. Keys can be **variable keys** or **expression scopes**:

```tsx
step({
  labels: {
    m_1: m1,                                    // Variable key — shows value on that variable
    m_2: m2,
    "m_1 m_2": "Multiply the two masses = ...", // Expression scope — highlights that portion of the formula
  },
});
```

Expression scope strings must be exact substrings of the formula's LaTeX:

- `"m_1 m_2"` highlights the mass product in the numerator
- `"r^2"` highlights the squared distance in the denominator
- `"\\frac{m_1 m_2}{r^2}"` highlights the entire fraction

### Step 4: Format numbers with the `latex()` helper

Raw JavaScript numbers can look awkward in mathematical context — too many decimals, no formatting. The `latex()` helper gives you control over how computed values appear in labels.

Use `latex()` to format computed values in labels:

```tsx
import { latex } from "math-notation";

var product = m1 * m2;
step({
  labels: {
    m_1: m1,
    m_2: m2,
    "m_1 m_2": "Multiply the two masses = " + latex(product).sigfigs(4),
  },
});
```

You can use **string concatenation** to combine descriptive text with formatted numbers:

```tsx
"m_1 m_2": "Multiply the two masses = " + latex(product).sigfigs(4),
```

This creates readable labels that explain what's happening alongside the computed value.

For scientific notation and large numbers, use `.sigfigs()` to control significant figures. For decimal places, use `.precision()`.

### Step 5: Add the StepControl component

With steps defined, readers need a way to navigate through them. The `StepControl` component provides forward, back, and skip buttons — putting readers in control of their own pace.

Render `StepControl` to give readers navigation buttons:

```tsx
import { Formula, Provider, StepControl } from "math-notation";

<Provider config={config}>
  <Formula id="my-formula" style={{ height: "400px", width: "800px" }} />
  <StepControl />
</Provider>
```

`StepControl` provides buttons to navigate through steps (skip to start, previous, next, skip to end) and shows a progress bar.

---

## Reference

### The `step()` function


| Property      | Description                                                      | Required? |
| ------------- | ---------------------------------------------------------------- | --------- |
| `description` | Step text shown to the user. Supports inline LaTeX with `$...$`. | No        |
| `labels`      | Variable keys or expression scopes mapped to display values.     | No        |


### Label values


| Value type           | Example                     | Result                                 |
| -------------------- | --------------------------- | -------------------------------------- |
| **Number**           | `a_1: vars.a_1`             | Displays the number                    |
| **Formatted number** | `latex(term1).precision(0)` | Displays with specified decimal places |
| **String**           | `"$a_1 \\cdot b_2 = 12$"`   | Displays text, supports inline LaTeX   |
| `**null`**           | `"a_1 b_2": null`           | Highlights expression, no label text   |


### New components


| Component     | Purpose                                                              |
| ------------- | -------------------------------------------------------------------- |
| `StepControl` | Navigation buttons for stepping through (previous, next, skip, etc.) |


### New config options


| Option     | Description                                      |
| ---------- | ------------------------------------------------ |
| `stepping` | Set to `true` to enable step-by-step navigation. |


