#!/bin/bash
set -e

echo "========================================="
echo "Setting up Formulize Study Environment"
echo "========================================="

# Install project dependencies
echo "Installing npm dependencies..."
npm install

echo ""
echo "========================================="
echo "Setup complete!"
echo "========================================="
echo ""
echo "To start the dev server:  npm run dev"
echo "To use Claude:            Open the Claude panel in the sidebar (or Cmd/Ctrl+Shift+P → 'Claude')"
echo ""
