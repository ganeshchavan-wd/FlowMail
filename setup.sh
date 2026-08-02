#!/bin/bash
# Run this once after unzipping, before opening the project in Android Studio.
set -e
echo "Installing dependencies..."
npm install
echo "Syncing Capacitor Android project..."
npx cap sync android
echo ""
echo "Done. Now open the 'android' folder in Android Studio and build."
