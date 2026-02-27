## How to Add Step-by-Step Walkthroughs

In Tutorial 1, you built an interactive formula where readers could drag variables and watch results update. But for multi-step calculations, seeing just the final answer isn't enough — readers need to understand *how* you get there.

Stepping solves this. Instead of showing everything at once, you guide readers through a calculation one piece at a time. At each step, parts of the formula highlight and labels appear to show intermediate values. Readers control the pace with navigation buttons.

By the end of this tutorial, you'll be able to turn any multi-step calculation into a guided walkthrough.

This tutorial builds on Tutorial 1. You should already know how to create a config with `formulas`, `variables`, and `semantics`.

---

### Starting Point

Open `Tutorial2.tsx`. You'll find a working cross product formula already set up:

- **Formula**: The 2D cross product equation is defined in LaTeX
- **Variables**: Vectors `\vec{a}` and `\vec{b}` with their components `a_1`, `a_2`, `b_1`, `b_2`, plus the result `\vec{c}`
- **Semantics**: The calculation extracts vector components, computes `term1 = a_1 * b_2`, `term2 = a_2 * b_1`, and assigns `result = term1 - term2` to `\vec{c}`

The formula displays and computes correctly, but there's no stepping — readers see everything at once. Your task is to add step-by-step navigation so readers can follow the calculation one piece at a time.

#### Array Variables

Notice that `\vec{a}` and `\vec{b}` store their components as arrays:

```tsx
"\\vec{a}": { default: [3, 2], name: "Vector a" },
"\\vec{b}": { default: [1, 4], name: "Vector b" },
```

This keeps the vector definition clean — one variable holds both components.

#### Setting Variable Values in Semantics

The component variables `a_1`, `a_2`, `b_1`, `b_2` are defined in the config but have no `default` value. Instead, the semantics function extracts values from the array variables and assigns them:

```tsx
semantics: function ({ vars }) {
  var a = vars["\\vec{a}"];
  var b = vars["\\vec{b}"];
  vars.a_1 = a[0];  // Assigns 3 to a_1
  vars.a_2 = a[1];  // Assigns 2 to a_2
  vars.b_1 = b[0];  // Assigns 1 to b_1
  vars.b_2 = b[1];  // Assigns 4 to b_2
  // ...
}
```

This pattern — reading from `vars` and writing back to `vars` — is how you derive values from other variables. Once assigned, these values display in the formula just like any other variable.

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
  var term1 = vars.a_1 * vars.b_2;
  step({
    description: "Multiply $a_1$ by $b_2$",
    labels: {
      a_1: vars.a_1,
      b_2: vars.b_2,
    },
  });

  var term2 = vars.a_2 * vars.b_1;
  step({
    description: "Multiply $a_2$ by $b_1$",
    labels: {
      a_2: vars.a_2,
      b_1: vars.b_1,
    },
  });
}
```

### Step 3: Add labels to highlight parts of the formula

Steps alone tell readers *when* to pause, but not *where* to look. Labels draw the eye to the relevant part of the formula and show computed values — connecting the abstract symbols to concrete numbers.

The `labels` object maps keys to display values. Keys can be **variable keys** or **expression scopes**:

```tsx
step({
  description: "Compute the first product",
  labels: {
    a_1: vars.a_1,           // Variable key — shows value on that variable
    "a_1 b_2": "= 12",       // Expression scope — highlights that portion of the formula
  },
});
```

Expression scope strings must be exact substrings of the formula's LaTeX:

- `"a_1 b_2"` highlights the first product
- `"a_2 b_1"` highlights the second product
- `"a_1 b_2 - a_2 b_1"` highlights the full result expression

### Step 4: Format numbers with the `latex()` helper

Raw JavaScript numbers can look awkward in mathematical context — too many decimals, no formatting. The `latex()` helper gives you control over how computed values appear in labels.

Use `latex()` to format computed values in labels:

```tsx
import { latex } from "math-notation";

var term1 = vars.a_1 * vars.b_2;
step({
  description: "First product: " + latex(term1).precision(0),
  labels: {
    "a_1 b_2": latex(term1).precision(0),
  },
});
```

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


