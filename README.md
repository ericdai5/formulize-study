# Formulize Study - Formulize Condition

Build interactive formula visualizations by editing Formulize configurations.

## Getting Started

### In GitHub Codespaces (Recommended)

1. Click the green **Code** button on the repo
2. Select **Codespaces** tab
3. Click **Create codespace on condition-formulize**

The environment will automatically install all dependencies and configure Claude Code CLI.

### Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at the forwarded port (usually `localhost:5173`).

## Using Claude Code

Claude Code CLI is pre-installed. To start an AI coding session:

```bash
claude
```

Use Claude to help you understand and modify the Formulize configuration.

## Your Task

Modify the `config` object in `src/App.tsx` to create your own interactive formula visualization.

## How Formulize Works

Formulize uses a **configuration object** to define interactive formulas:

```typescript
const config: FormulizeConfig = {
  formulas: [
    {
      id: "my-formula",
      latex: "y = {m}{x} + {b}",  // Variables in {braces}
    },
  ],

  variables: {
    m: {
      role: "input",        // User can drag to change
      default: 2,
      range: [-10, 10],
      latexDisplay: "value", // Show number in formula
    },
    x: {
      role: "input",
      default: 5,
      range: [0, 10],
      latexDisplay: "value",
    },
    b: {
      role: "input",
      default: 1,
      range: [-5, 5],
      latexDisplay: "value",
    },
    y: {
      role: "computed",     // Calculated automatically
      latexDisplay: "value",
    },
  },

  semantics: {
    engine: "manual",
    manual: (vars) => {
      vars.y = vars.m * vars.x + vars.b;  // Compute y
    },
  },
};
```

## Key Concepts

### Variables

- **`role: "input"`** - User can drag to change the value
- **`role: "computed"`** - Calculated by the `manual` function
- **`latexDisplay: "value"`** - Shows the number in the formula
- **`latexDisplay: "name"`** - Shows the variable name instead

### Formulas

- Use LaTeX syntax: `\\frac{a}{b}`, `x^2`, `\\sqrt{x}`
- Wrap variable names in braces: `{variableName}`
- Each formula needs a unique `id`

### Components

- `<FormulaComponent id="..." />` - Displays a formula
- `<InlineVariable id="..." display="value" />` - Shows a value in text
- `<VisualizationComponent />` - For charts (advanced)

## Example Modifications

Try changing the starter code to:

1. **Quadratic formula**: `y = ax² + bx + c`
2. **Ohm's Law**: `V = IR`
3. **Compound interest**: `A = P(1 + r)^t`

## Tips

- The dev server hot-reloads when you save
- Check the browser console for errors
- LaTeX errors will show in the formula display
- Ask Claude Code for help with LaTeX syntax
