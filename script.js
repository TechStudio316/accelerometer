// Initialize variables
let simulatedSteps = 0;
let useSimulatedSteps = false; // Flag to determine if we are using simulated data

// Check if DeviceMotion is supported and listen to the event
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
        if (!useSimulatedSteps) {
            // If we are not using simulated data, process the real accelerometer data
            let acceleration = event.accelerationIncludingGravity;

            // Log the x, y, z values to the console for debugging
            console.log(`x: ${acceleration.x}, y: ${acceleration.y}, z: ${acceleration.z}`);

            // Process the accelerometer data to detect steps
            processAccelerometerData(acceleration);
        }
    });
} else {
    alert("DeviceMotion API is not supported on this device.");
}

// Function to process the accelerometer data for step detection
function processAccelerometerData(acceleration) {
    // Set a threshold for detecting steps based on acceleration
    const stepThreshold = 1.5;  // You can adjust this value for sensitivity

    // Check if the absolute values of acceleration on x, y, or z axis exceed the threshold
    if (Math.abs(acceleration.x) > stepThreshold || Math.abs(acceleration.y) > stepThreshold || Math.abs(acceleration.z) > stepThreshold) {
        simulatedSteps++;
        
        // Update the step count display
        document.getElementById("stepCountDisplay").innerText = `Steps Detected: ${simulatedSteps}`;
    }
}

// Simulate step count manually using the input field and button
document.getElementById("simulateButton").addEventListener("click", function() {
    // Get the number of steps entered by the user
    let stepCount = document.getElementById("stepInput").value;

    if (stepCount && stepCount > 0) {
        // Set the flag to use simulated data
        useSimulatedSteps = true;

        // Override the real step count with the simulated steps
        simulatedSteps = parseInt(stepCount, 10);

        // Update the step count display
        document.getElementById("stepCountDisplay").innerText = `Simulated Steps: ${simulatedSteps}`;
    } else {
        alert("Please enter a valid number of steps.");
    }
});

// Add a button to switch back to real device data
document.getElementById("useRealDataButton").addEventListener("click", function() {
    useSimulatedSteps = false; // Switch back to real data
    alert("Now using real accelerometer data.");
});

let simulatedSteps = 0;
let realSteps = 0;
const simulateButton = document.getElementById('simulateButton');
const useRealDataButton = document.getElementById('useRealDataButton');

// Simulate steps
simulateButton.addEventListener('click', () => {
    simulatedSteps = parseInt(document.getElementById('stepInput').value) || 0;
    document.getElementById('stepCountDisplay').innerText = `Steps Simulated: ${simulatedSteps}`;
});

// Check if DeviceMotion API is supported
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', (event) => {
        realSteps++;
        document.getElementById('stepCountDisplay').innerText = `Steps Detected: ${realSteps}`;
    });
} else {
    document.getElementById('stepCountDisplay').innerText = "Device motion not supported";
}

// Switch back to real data
useRealDataButton.addEventListener('click', () => {
    realSteps = 0;
    document.getElementById('stepCountDisplay').innerText = `Steps Detected: ${realSteps}`;
});

function saveSteps(steps) {
  db.collection("stepCounter").add({
    steps: steps,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Steps successfully saved!");
  })
  .catch((error) => {
    console.error("Error saving steps: ", error);
  });
}

// Call this function when simulating or detecting steps
simulateButton.addEventListener('click', () => {
  const steps = parseInt(document.getElementById('stepInput').value) || 0;
  saveSteps(steps);
});
