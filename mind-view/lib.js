/**
 * This file contains the library of functions for the MindView project.
 */
// Define pairs of similar colors
const similarColors = [
    ["red", "pink"],
    ["red", "orange"],
    ["blue", "green"]
    ["blue", "lightblue"],
    ["blue", "teal"],
    ["orange", "brown"],
    ["orange", "yellow"],
    ["green", "lime"],
    ["green", "teal"],
    ["gray", "darkgray"],
    ["black", "dimgray"],
    ["white", "snow"]
];

// More advance similar colors
const similarColorsAdvanced = [
    ["teal", "turquoise"],
    ["yellow", "gold"],
    ["orange", "coral"],
    ["purple", "violet"],
    ["brown", "sienna"],
];

// Randomize similar colors
function randomizeSimilarColors() {
    // Get random color pair
    let colorPair = similarColors[Math.floor(Math.random() * similarColors.length)];
    // Randomly swap the order
    if (Math.random() < 0.5) {
        colorPair = [colorPair[1], colorPair[0]];
    }
    return similarColors[Math.floor(Math.random() * similarColors.length)];
}


