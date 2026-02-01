#!/bin/bash
set -e

echo "========================================="
echo "Setting up Formulize Study Environment"
echo "========================================="

# Install project dependencies
echo "Installing npm dependencies..."
npm install

# Install Gemini CLI
echo "Installing Gemini CLI..."
npm install -g @google/gemini-cli

# Configure Gemini API key if provided via Codespaces secret
if [ -n "$GEMINI_API_KEY" ]; then
  echo "Configuring Gemini with API key..."
  echo "export GEMINI_API_KEY=$GEMINI_API_KEY" >> ~/.bashrc
  echo "Gemini API key configured!"
else
  echo "Note: No GEMINI_API_KEY secret found."
  echo "You can set it later with: export GEMINI_API_KEY=your-key"
fi

echo ""
echo "========================================="
echo "Setup complete!"
echo "========================================="
echo ""
echo "To start the dev server:  npm run dev"
echo "To use Gemini:            gemini"
echo ""
