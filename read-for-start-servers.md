cd to frontend

in the powershel or bash
Start the emulators
firebase emulators:start --import=./data

in the cmd (do not run in emulator ran prompts)
Start the react server/site
npm start

while emulator is running , to export data from the emulators
firebase emulators:export ./data

Alternative
run the run_emulator.sh in bash
./run_emulator.sh

while script is executed , run "firebase emulators:export ./data" to export from emulators

Note : export must done while emulator running 