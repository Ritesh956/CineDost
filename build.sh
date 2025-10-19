#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Building project..."
npx vite build

echo "Build completed successfully!"