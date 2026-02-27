## How Interactive Formulas are Implemented

---

### Step 1: Define a formula config

Before you can build an interactive formula, you need somewhere to put all the pieces. The config object is that container.

Create a configuration object that defines the interactive formula. It contains the following parts — `formulas`, `variables`, and `semantics`.

```tsx
const config: Config = {
  formulas: [...],
  variables: {...},
  semantics: function ({ vars }) {...},
};
```

### Step 2: Write the formula

Now let's give readers something to look at — the equation itself.

Write the formula in LaTeX as an entry in the `formulas` array. Assign the entry a unique `id`.

```tsx
formulas: [
  {
    id: "gravity",
    latex: "\\vec{F} = G \\frac{m_1 m_2}{r^2}",
  },
],
```

### Step 3: Define the variables

A formula full of symbols can feel intimidating. By defining variables, you give each symbol a name and a value — turning abstract notation into something readers can understand.

Specify which variables in the formula should be labeled and tracked. The variable key must **exactly match** the corresponding LaTeX token (case-sensitive). Symbols in the LaTeX that are not listed in `variables` render as plain, non-interactive notation. When a variable key contains LaTeX commands or special characters (like `\\vec{F}`), use the escaped LaTeX string as the key and quote it. Subscripted keys like `m_1` can be used as unquoted object keys.

Use `sigFigs` to control how many significant figures are displayed, or `precision` to control decimal places. Pick one or the other — if you define both, `sigFigs` takes precedence and `precision` is ignored.

```tsx
variables: {
  "\\vec{F}": {
    name: "Gravitational Force",
  },
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
  m_2: {
    default: 80,
    name: "Mass of Person",
    precision: 0,
  },
  r: {
    default: 6.371e6,
    name: "Earth's radius",
    sigFigs: 4,
  },
},
```

### Step 4: Define the formula `semantics`

So far, the formula just displays symbols. The semantics function teaches it how to actually compute — how the inputs produce the output.

Define how input variables map to output variables in the `semantics` function. Access variables as properties of the `vars` object. Use dot notation for simple and subscripted keys (`vars.G`, `vars.m_1`). For keys that contain special characters, use bracket notation (`vars["\\vec{F}"]`).

```tsx
semantics: function ({ vars }) {
  var product = vars.m_1 * vars.m_2;
  var squared = vars.r * vars.r;
  var force = (vars.G * product) / squared;
  vars["\\vec{F}"] = force;
},
```

You can read this as: multiply `m_1` and `m_2`, square `r`, compute the gravitational force, and assign the result to `\\vec{F}`.

### Step 5: Render with `Provider` and `Formula`

With the config ready, it's time to see your work on screen.

Render the formula using the `Provider` and `Formula` components. `Provider` wraps everything and receives the `config` prop. `Formula` renders a formula by its `id`.

```tsx
<Provider config={config}>
  <Formula id="gravity" style={{ height: "300px", width: "700px" }} />
</Provider>
```

At this point you have a working formula — variables are labeled, values are displayed, and the semantics function computes the result.

### Step 6: Make variables interactive with drag

Static formulas show one answer. But what if readers could ask "what happens if I change this?" and discover the answer themselves? That's what drag interaction enables.

To let users change variable values by dragging, add `input`, `default`, `range`, and `step` properties to the variables you want to be interactive. For example, to make `m_2` (mass of the person) draggable:

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

- `input: "drag"` enables drag interaction on the variable
- `default` sets the starting value
- `range` sets the minimum and maximum values
- `step` sets the increment size when dragging

You can make multiple variables draggable. Here is the full `variables` config with `m_2` and `r` both interactive:

```tsx
variables: {
  "\\vec{F}": {
    name: "Gravitational Force",
  },
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
    sigFigs: 4,
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

| Layer                | Simple key `"r"`               | Subscripted key `"m_1"`           | LaTeX key `"\\vec{F}"`            |
| -------------------- | ------------------------------ | --------------------------------- | --------------------------------- |
| **LaTeX**            | `r` in `"...r^2"`              | `m_1` in `"...m_1 m_2..."`        | `\\vec{F}` in `"\\vec{F} = ..."`  |
| **Variables config** | `r: { default: 6.371e6, ... }` | `m_1: { default: 5.972e24, ... }` | `"\\vec{F}": { name: "..." }`     |
| **Semantics**        | `vars.r`                       | `vars.m_1`                        | `vars["\\vec{F}"]`                |

### Variable properties

| Property    | Description                                     | Example                 | Required?                 |
| ----------- | ----------------------------------------------- | ----------------------- | ------------------------- |
| `name`      | Explanatory label displayed to users            | `name: "Mass of Earth"` | No                        |
| `default`   | The starting value                              | `default: 5.972e24`     | For variables with values |
| `sigFigs`   | Number of significant figures to display        | `sigFigs: 4`            | No                        |
| `precision` | Number of decimal places to display             | `precision: 0`          | No                        |
| `input`     | How the user interacts with it                  | `input: "drag"`         | For interactive variables |
| `range`     | Min and max values for input variables          | `range: [0, 100]`       | For interactive variables |
| `step`      | Increment size when dragging                    | `step: 0.1`             | For interactive variables |

**Note:** `sigFigs` and `precision` are mutually exclusive. If both are defined, `sigFigs` takes precedence.

### Components

| Component     | Purpose                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Provider`    | Wraps everything; receives the `config` prop.                                                                                 |
| `Formula`     | Renders a formula by `id`; must match an entry in `formulas`.                                                                 |
