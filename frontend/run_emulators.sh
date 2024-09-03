#!/bin/bash

# Define paths
EMULATOR_DATA_DIR="./emulator-data"
SCRIPT_PATH="./your-script.sh"

# Function to start the emulators with data import
start_emulators() {
    echo "Starting Firebase emulators with data import..."
    firebase emulators:start --import="$EMULATOR_DATA_DIR"
}

# Function to export the emulator data
export_emulators() {
    echo "Exporting Firebase emulators data..."
    firebase emulators:export "$EMULATOR_DATA_DIR"
}

# Function to stop the emulators after executing a script
stop_emulators() {
    echo "Stopping Firebase emulators and running script..."
    firebase emulators:exec "$SCRIPT_PATH"
}

# Main script execution
case $1 in
    start)
        start_emulators
        ;;
    export)
        export_emulators
        ;;
    stop)
        stop_emulators
        ;;
    *)
        echo "Usage: $0 {start|export|stop}"
        exit 1
        ;;
esac
