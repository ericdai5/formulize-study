# Formulize Study - AI Condition

Build interactive formula visualizations using React, KaTeX, and D3 with AI assistance.

## Getting Started

### In GitHub Codespaces (Recommended)

1. Click the green **Code** button on the repo
2. Select **Codespaces** tab
3. Click **Create codespace on condition-ai**

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

Use Claude to help you:
- Write React components
- Create D3.js visualizations
- Render LaTeX formulas with KaTeX
- Debug and improve your code

## Your Task

Build an interactive formula visualization that:
1. Displays mathematical formulas using KaTeX
2. Allows users to interact with variables (sliders, inputs, etc.)
3. Updates the visualization in real-time as values change

## Available Libraries

- **React** - UI components and state management
- **KaTeX** - LaTeX formula rendering
- **D3.js** - SVG visualizations and data binding
- **Tailwind CSS** - Styling

## Example Code

The starter code in `src/App.tsx` includes:
- A `Formula` component for rendering KaTeX
- An example interactive slider
- Placeholder for your visualization

## Tips

- Start simple - get one formula rendering first
- Use React `useState` for interactive values
- KaTeX accepts LaTeX strings like `"E = mc^2"` or `"\\frac{a}{b}"`
- Ask Claude Code for help with D3.js patterns
