#!/bin/bash

# Start the Firebase Emulators
firebase emulators:start --import=./data

# Interval between exports in seconds (e.g., 60 seconds = 1 minute)
EXPORT_INTERVAL=60

# Function to export emulator data
export_data() {
  echo "Exporting emulator data..."
  firebase emulators:export ./data
  
  if [ $? -eq 0 ]; then
    echo "Export completed successfully."
  else
    echo "Export failed. Please check the Firebase Emulator status."
  fi
}

# Periodically export data while the script is running
while true; do
  export_data
  echo "Waiting $EXPORT_INTERVAL seconds before the next export..."
  sleep $EXPORT_INTERVAL
done