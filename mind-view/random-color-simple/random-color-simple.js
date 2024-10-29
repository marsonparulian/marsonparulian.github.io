document.addEventListener('DOMContentLoaded', function () {
    $(document).foundation();

    // Start new round
    nextRound();
    // Open info modal
    $('#about-modal').foundation('open');
    // Set focus to close button
    document.getElementById('close-about-modal').focus();
});

// Define colors to be shuffled
const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "gray", "black", "white"];

// Start new round
function nextRound() {
    // Randomize color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;

    // Show answer
    document.getElementById("answer-text").innerText = "Color of this page is " + randomColor + ".";
}
