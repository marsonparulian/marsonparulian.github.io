document.addEventListener('DOMContentLoaded', function () {
    $(document).foundation();

    // Start new round
    nextRound();
    // Open info modal
    $('#about-modal').foundation('open');
    // Set focus to close button
    document.getElementById('close-about-modal').focus();
});

// SeparatorsList of half areas of a rectangle
const HalfAreas = ["top left", "top middle", "top right", "right middle"];

// Randomize separator
function randomizeHalfRect() {
    return HalfAreas[Math.floor(Math.random() * HalfAreas.length)];
}

// Start new round
function nextRound() {
    // Randomize color
    let randomColors = randomizeSimilarColors();

    // Randomize which half of the canvas 
    let firstArea = randomizeHalfRect();

    // Draw canvas
    drawCanvas(firstArea, randomColors);

    // Update answer in the modal
    document.getElementById("answer-text").innerText = "Color in the " + firstArea + " is " + randomColors[0] + " and the rest is " + randomColors[1] + ".";
}


function drawCanvas(firstArea, colors) {
    // Get canvas and context
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill second area with remaining color
    ctx.fillStyle = colors[1];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fill first area based on separator position
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    switch (firstArea) {
        case "top left":
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, 0);
            ctx.lineTo(0, canvas.height);
            break;
        case "top middle":
            ctx.rect(0, 0, canvas.width, canvas.height / 2);
            break;
        case "top right":
            ctx.moveTo(canvas.width, 0);
            ctx.lineTo(0, 0);
            ctx.lineTo(canvas.width, canvas.height);
            break;
        case "right middle":
            ctx.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
            break;
    }
    ctx.fill();


}
