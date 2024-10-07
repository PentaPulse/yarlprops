#!/bin/bash

# Get the Git user email
GIT_USER_EMAIL=$(git config user.email)

# Define the import directory based on the Git user email
if [ "$GIT_USER_EMAIL" = "tahrindu.sachintha.xyz1@gmail.com" ]; then
    IMPORT_DIR="./datas"
else
    IMPORT_DIR="./emulator-data/$GIT_USER_EMAIL"
fi

# Define the export directory based on Git user email
EXPORT_DIR="./emulator-data/$GIT_USER_EMAIL"

# Function to start the emulators with data import
start_emulators() {
    echo "Starting Firebase emulators with data import from $IMPORT_DIR..."
    firebase emulators:start --import="$IMPORT_DIR"
}

# Function to export the emulator data
export_emulators() {
    echo "Exporting Firebase emulators data to $EXPORT_DIR..."
    firebase emulators:export "$EXPORT_DIR"
}

# Main script execution
case $1 in
    start)
        start_emulators
        ;;
    export)
        export_emulators
        ;;
    *)
        echo "Usage: $0 {start|export}"
        exit 1
        ;;
esac