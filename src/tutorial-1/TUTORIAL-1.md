## How Interactive Formulas are Implemented

### What are interactive formulas?

Mathematical formulas can be hard to learn from when they just sit on a page. An interactive formula lets readers change values, see results update in real time, and build intuition by playing around — turning a static equation into something they can explore.

### What this tutorial covers

This tutorial walks you through how to build interactive formulas using a custom library designed for this purpose. By the end, you'll be able to take a LaTeX equation, label its variables, wire up the math, and let readers drag values to see what happens.

### A note on feedback

As you work through this tutorial, please let us know if anything about the library feels confusing, unclear, or frustrating. We're actively looking for feedback on the API design and documentation — your observations are valuable even if you're unsure whether something is a "real" issue.

---

### Step 1: Define a formula config

In this library, everything you specify about how to make a formula interactive goes into a "Config" object. **Create one such object now.** It contains three parts — `formulas`, `variables`, and `semantics` — which you will fill out in the following steps:

```tsx
const config: Config = {
  formulas: [...],
  variables: {...},
  semantics: function ({ vars }) {...},
};
```

- `formulas` — the LaTeX equations to display
- `variables` — the variables and their properties
- `semantics` — a function that defines how variables relate to each other

### Step 2: Write the formula

Give readers something to look at — the equation itself, written in LaTeX. **Add the following entry to the `formulas` array:**

```tsx
formulas: [
  {
    id: "gravity",
    latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
  },
],
```

Write the formula in LaTeX as an entry in the `formulas` array. Assign the entry a unique `id`. Each entry has an `id` (a unique name you'll reference later) and a `latex` string containing the equation.

### Step 3: Display the formula

Render the formula on screen so you can see your progress as you build. The library provides two React components for this: `Provider` (which makes the config available to everything inside it) and `Formula` (which renders a specific equation). **Replace your app's return statement with the following JSX:**

```tsx
<Provider config={config}>
  <Formula id="gravity" />
</Provider>
```

`Provider` wraps everything and receives the `config` prop. `Formula` renders a formula by its `id`, which must match an entry in the `formulas` array.

### Step 4: Run the app

**Run `npm run dev`** in your terminal to start the development server, then open the URL it prints. You should see the equation rendered on screen — but the symbols are just plain notation for now. Keep the dev server running; it will update automatically as you make changes in the following steps.

### Step 5: Define the variables

Turn abstract symbols into something readers can understand by defining variables. We'll build up the variables config one property at a time.

The variable key must **exactly match** the corresponding LaTeX token (case-sensitive). Symbols in the LaTeX that are not listed in `variables` render as plain, non-interactive notation. When a variable key contains LaTeX commands or special characters (like `\\vec{F}`), use the escaped LaTeX string as the key and quote it. Subscripted keys like `m_1` can be used as unquoted object keys.

#### 5a: Label each variable with `name`

Give each symbol a human-readable name so readers know what it represents. **Add a `variables` object with a `name` for each variable:**

```tsx
variables: {
  "\\vec{F}": {
    name: "Gravitational Force",
  },
  G: {
    name: "Gravitational Constant",
  },
  m_1: {
    name: "Mass of Earth",
  },
  m_2: {
    name: "Mass of Person",
  },
  r: {
    name: "Earth's radius",
  },
},
```

`name` is the label displayed to readers next to the symbol in the rendered formula.

#### 5b: Set a starting value with `default`

Give each variable an initial numeric value. **Add a `default` property to `G`, `m_1`, `m_2`, and `r`:**

```tsx
variables: {
  "\\vec{F}": {
    name: "Gravitational Force",
  },
  G: {
    default: 6.674e-11,
    name: "Gravitational Constant",
  },
  m_1: {
    default: 5.972e24,
    name: "Mass of Earth",
  },
  m_2: {
    default: 80,
    name: "Mass of Person",
  },
  r: {
    default: 6.371e6,
    name: "Earth's radius",
  },
},
```

`default` sets the value that is displayed when the formula first renders. `\\vec{F}` has no `default` — its value will be computed by the semantics function later.

#### 5c: Control displayed digits with `sigFigs`

Limit how many significant figures are shown for a variable's value. **Add `sigFigs: 3` to `G`, `m_1`, and `r`:**

```tsx
G: {
  default: 6.674e-11,
  name: "Gravitational Constant",
  sigFigs: 3,
},
m_1: {
  default: 5.972e24,
  name: "Mass of Earth",
  sigFigs: 3,
},
```

`sigFigs: 3` displays `G` as `6.67 × 10⁻¹¹` (3 significant figures) rather than showing all available digits.

#### 5d: Control decimal places with `precision`

Limit how many decimal places are shown for a variable's value. **Add `precision: 0` to `m_2`:**

```tsx
m_2: {
  default: 80,
  name: "Mass of Person",
  precision: 0,
},
```

`precision: 0` displays `m_2` as `80` with no decimal places. Pick one or the other — if you define both `sigFigs` and `precision` on the same variable, `sigFigs` takes precedence and `precision` is ignored.

#### Full variables config

Putting it all together:

```tsx
variables: {
  "\\vec{F}": {
    name: "Gravitational Force",
  },
  G: {
    default: 6.674e-11,
    name: "Gravitational Constant",
    sigFigs: 3,
  },
  m_1: {
    default: 5.972e24,
    name: "Mass of Earth",
    sigFigs: 3,
  },
  m_2: {
    default: 80,
    name: "Mass of Person",
    precision: 0,
  },
  r: {
    default: 6.371e6,
    name: "Earth's radius",
    sigFigs: 3,
  },
},
```

### Step 6: Define the formula `semantics`

To allow someone to play around with a formula in the intended way, there has to be a way to map from input variable values to output variable values. Define that mapping with a `semantics` function. **Add the following `semantics` function to your config:**

```tsx
semantics: function ({ vars }) {
  var product = vars.m_1 * vars.m_2;
  var squared = vars.r * vars.r;
  var force = (vars.G * product) / squared;
  vars["\\vec{F}"] = force;
},
```

Access variables as properties of the `vars` object. Use dot notation for simple and subscripted keys (`vars.G`, `vars.m_1`). For keys that contain special characters, use bracket notation (`vars["\\vec{F}"]`). Reading from `vars` gets a variable's current value; writing to `vars` sets a variable's value.

### Step 7: Make variables interactive with drag

Let readers change a variable's value by dragging it, so they can explore how the formula responds. **Change your `m_2` variable to add `input`, `range`, and `step`:**

```tsx
m_2: {
  input: "drag",
  default: 80,
  range: [1, 200],
  step: 1,
  name: "Mass of Person",
  precision: 0,
},
```

- `input: "drag"` — enables drag interaction on the variable
- `range: [1, 200]` — sets the minimum and maximum values the user can drag to
- `step: 1` — sets the increment size when dragging

**Now do the same for `r`.** You can make multiple variables draggable. Here is the full `variables` config with `m_2` and `r` both interactive:

```tsx
variables: {
  "\\vec{F}": {
    name: "Gravitational Force",
  },
  G: {
    default: 6.674e-11,
    name: "Gravitational Constant",
    sigFigs: 3,
  },
  m_1: {
    default: 5.972e24,
    name: "Mass of Earth",
    sigFigs: 3,
  },
  m_2: {
    input: "drag",
    default: 80,
    range: [1, 200],
    step: 1,
    name: "Mass of Person",
    precision: 0,
  },
  r: {
    input: "drag",
    default: 6.371e6,
    range: [1e6, 1e7],
    step: 1e4,
    name: "Earth's radius",
    sigFigs: 3,
  },
},
```

The `semantics` function does not need to change — it already reads from `vars.m_2` and `vars.r`. When the user drags those variables, the semantics function re-runs automatically and `\\vec{F}` updates in real time.

---

## Reference

### Config structure

The config has three main parts:

- **`formulas`** — the LaTeX equations to display
- **`variables`** — the variables and their properties
- **`semantics`** — a function that defines how variables relate to each other

### Variable keys

The **variable key** is the single thread connecting the **LaTeX formula**, the **variables config**, and the **semantics function**.

Simple keys (like `r`, `G`) and subscripted keys (like `m_1`) use dot notation. Keys with LaTeX commands (like `\\vec{F}`) must be quoted in the config and accessed with bracket notation in semantics.

| Layer                | Simple key `"r"`               | Subscripted key `"m_1"`           | LaTeX key `"\\vec{F}"`           |
| -------------------- | ------------------------------ | --------------------------------- | -------------------------------- |
| **LaTeX**            | `r` in `"...r^2"`              | `m_1` in `"...m_1 m_2..."`        | `\\vec{F}` in `"\\vec{F} = ..."` |
| **Variables config** | `r: { default: 6.371e6, ... }` | `m_1: { default: 5.972e24, ... }` | `"\\vec{F}": { name: "..." }`    |
| **Semantics**        | `vars.r`                       | `vars.m_1`                        | `vars["\\vec{F}"]`               |

### Variable properties

| Property    | Description                              | Example                 | Required?                 |
| ----------- | ---------------------------------------- | ----------------------- | ------------------------- |
| `name`      | Explanatory label displayed to users     | `name: "Mass of Earth"` | No                        |
| `default`   | The starting value                       | `default: 5.972e24`     | For variables with values |
| `sigFigs`   | Number of significant figures to display | `sigFigs: 3`            | No                        |
| `precision` | Number of decimal places to display      | `precision: 0`          | No                        |
| `input`     | How the user interacts with it           | `input: "drag"`         | For interactive variables |
| `range`     | Min and max values for input variables   | `range: [0, 100]`       | For interactive variables |
| `step`      | Increment size when dragging             | `step: 0.1`             | For interactive variables |

**Note:** `sigFigs` and `precision` are mutually exclusive. If both are defined, `sigFigs` takes precedence.

### Components

| Component  | Purpose                                                       |
| ---------- | ------------------------------------------------------------- |
| `Provider` | Wraps everything; receives the `config` prop.                 |
| `Formula`  | Renders a formula by `id`; must match an entry in `formulas`. |
