/**
 * This file contains the library of functions for the MindView project.
 */
// Define pairs of similar colors
const similarColors = [
    ["red", "pink"],
    ["red", "orange"],
    ["blue", "green"],
    ["blue", "lightblue"],
    ["blue", "teal"],
    ["orange", "brown"],
    ["orange", "yellow"],
    ["green", "lime"],
    ["green", "teal"],
    ["gray", "darkgray"],
    ["black", "gray"],
    ["yellow", "gold"],
];

// More advance similar colors
const similarColorsAdvanced = [
    ["teal", "turquoise"],
    ["orange", "coral"],
    ["purple", "violet"],
    ["brown", "sienna"],
];

// Randomize similar colors
function randomizeSimilarColors() {

    // Get random color pair
    let randomIndex = Math.floor(Math.random() * similarColors.length);
    let colorPair = similarColors[randomIndex];

    // Randomly swap the order
    if (Math.random() < 0.5) {
        colorPair = [colorPair[1], colorPair[0]];
    }
    return colorPair
}

// Show toast notification
function showToast(message, duration = 10000) {
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.setAttribute('aria-live', 'assertive');
    // Announce to screen readers
    toast.style.visibility = 'visible';

    setTimeout(() => {
        toast.style.opacity = '0';
        // Hide after transition
        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 500);
    }, duration);
}
