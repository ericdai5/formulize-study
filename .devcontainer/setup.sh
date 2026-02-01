#!/bin/bash
set -e

echo "========================================="
echo "Setting up Formulize Study Environment"
echo "========================================="

# Install project dependencies
echo "Installing npm dependencies..."
npm install

# Install Claude Code CLI globally
echo "Installing Claude Code CLI..."
npm install -g @anthropic-ai/claude-code

# Configure Claude API key if provided via Codespaces secret
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "Configuring Claude Code with API key..."
  echo "export ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" >> ~/.bashrc
  echo "Claude Code API key configured!"
else
  echo "Note: No ANTHROPIC_API_KEY secret found."
  echo "You can set it later with: export ANTHROPIC_API_KEY=your-key"
fi

echo ""
echo "========================================="
echo "Setup complete!"
echo "========================================="
echo ""
echo "To start the dev server:  npm run dev"
echo "To start Claude Code:     claude"
echo ""
