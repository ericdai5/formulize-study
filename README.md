# Formulize Study

Interactive formula visualization study environment.

## Getting Started with GitHub Codespaces

1. Click the green **Code** button on the repo
2. Select **Codespaces** tab
3. Click **Create codespace on main**

The environment will automatically install all dependencies and configure Claude Code CLI.

## Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at the forwarded port (usually `localhost:5173`).

## Using Claude Code

Claude Code CLI is pre-installed. To start:

```bash
claude
```

If you need to set your API key manually:

```bash
export ANTHROPIC_API_KEY=your-api-key-here
claude
```

## Local Development

If running locally instead of Codespaces:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Study Conditions

This repo supports two study conditions:

- **AI Condition**: Use Claude Code with base JavaScript/KaTeX to create formula visualizations
- **Formulize Condition**: Edit configuration files to create formula visualizations using the Formulize API

Your study coordinator will provide specific instructions for your assigned condition.
