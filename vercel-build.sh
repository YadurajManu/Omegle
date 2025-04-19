#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Install server dependencies
echo "Installing server dependencies..."
cd server && npm install

# Return to root directory
cd ..

echo "Build completed successfully!" 