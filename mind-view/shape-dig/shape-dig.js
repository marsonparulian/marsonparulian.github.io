let toaster, confetti;

// Initial life
let lives = 5;

// Current score
let score = 0;
// Elements related in displaying score
let currentResultElement, scoreElement;

// This will used as base length, dependent on the screen size
let baseLength;
window.addEventListener('resize', () => {
    measureBaseLength();
    regenerateShapes();
});
function measureBaseLength() {
    baseLength = window.innerWidth * 0.04;
}

// Types of shapes
const shapeTypes = ["square", "circle", "triangle", "star", "cross"];

const colors = [
    0xFF0000, // red
    0x0000FF, // blue
    0x008000, // green
    0xFFFF00, // yellow
    0xFFA500, // orange
    0x800080, // purple
    // 0xFFFFFF, // white
    0x00FFFF, // cyan
    0xFF00FF, // magenta
];

// number of shapes on first draw.
const numberOfShapesOnFirstDraw = 90;

// Selected shapeType, is the first shapeType selected by player, which must be selected by the player throughout the game.
let selectedShapeType = "none";

// PIXI App
let app;


$(document).ready(function () {
    // Parse elements
    currentResultElement = document.getElementById("current-result");
    scoreElement = document.getElementById("score");

    // Calculate basic values
    measureBaseLength();

    // Foundation
    $(document).foundation();

    // Show modal on page load
    $('#intro-modal').foundation('open');

    // Init Toaster
    toaster = new Toaster();

    // Init Confetti
    confetti = new Confetti();

    // Init PIXI Application with fullscreen size canvas
    app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight - document.querySelector('.control-container').offsetHeight,
        backgroundAlpha: 0,
        antiAlias: true,
    });
    // Position canvas below control container
    app.view.style.position = 'absolute';
    app.view.style.top = document.querySelector('.control-container').offsetHeight + 'px';
    app.view.style.left = '0';
    document.body.appendChild(app.view);
});

// Close intro modal
function closeModalAndStart() {
    $('#intro-modal').foundation('close');
    newGame();
}
// Close Result Modal
function closeResultModal() {
    $('#result-modal').foundation('close');
    newGame();
}

// Start a new game
function newGame() {
    lives = 5;
    updateLivesDisplay();
    console.log('update lives display');

    // Reset the selected shape
    score = 0;
    selectedShapeType = "none";

    // Update score related display
    updateCurrentResultDisplay();

    toaster.show('New game started!');
    regenerateShapes();
}

function regenerateShapes() {
    shapes = generateGraphics();
    drawShapes(shapes);
}

/**
 * Generate shapes (PIXI.Graphics) with random calor and random coordinates.
 * Also attach event handler 'onclick' to each shape.
 */
function generateGraphics() {
    let shapes = [];



    for (let i = 0; i < numberOfShapesOnFirstDraw; i++) {
        // Random shape type
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

        shapes.push(generateAGraphic(shapeType));
    }

    return shapes;
}
function generateAGraphic(shapeType) {
    // Create new PIXI Graphics object
    const graphics = new PIXI.Graphics();

    // Random position within window bounds
    const x = Math.random() * (window.innerWidth - baseLength * 2) + baseLength * 1;
    const y = Math.random() * (window.innerHeight - baseLength * 2) + baseLength * 1;

    // Random shape color
    const color = parseInt(colors[Math.floor(Math.random() * colors.length)]);

    graphics.beginFill(color);
    graphics.lineStyle(2, 0x000000);

    // Draw different shapes based on type
    switch (shapeType) {
        case 'square':
            graphics.drawRect(x, y, baseLength * 3.2, baseLength * 3.2);
            break;
        case 'circle':
            graphics.drawCircle(x, y, baseLength * 1.8);
            break;
        case 'triangle':
            graphics.moveTo(x, y - baseLength * 2);
            graphics.lineTo(x + baseLength * 1.7, y + baseLength);
            graphics.lineTo(x - baseLength * 1.7, y + baseLength);
            graphics.closePath();
            break;
        case 'star':
            // Draw star outline point by point
            const outerRadius = baseLength * 2;
            const innerRadius = baseLength;
            const points = 5;
            const angleStep = (Math.PI * 2) / points;
            const halfAngleStep = angleStep / 2;

            // Start at the top point
            graphics.moveTo(
                x + Math.cos(-Math.PI / 2) * outerRadius,
                y + Math.sin(-Math.PI / 2) * outerRadius
            );

            // Draw the star points
            for (let i = 0; i < points; i++) {
                const angle = (-Math.PI / 2) + (i * angleStep);

                // Draw line to inner point
                graphics.lineTo(
                    x + Math.cos(angle + halfAngleStep) * innerRadius,
                    y + Math.sin(angle + halfAngleStep) * innerRadius
                );

                // Draw line to next outer point
                graphics.lineTo(
                    x + Math.cos(angle + angleStep) * outerRadius,
                    y + Math.sin(angle + angleStep) * outerRadius
                );
            }

            graphics.closePath();
            break;
        case 'cross':
            const width = baseLength * 0.8;
            const length = baseLength * 2;
            // Draw cross outline point by point
            graphics.moveTo(x - width / 2, y - length); // Top of vertical bar
            graphics.lineTo(x + width / 2, y - length); // Top right corner
            graphics.lineTo(x + width / 2, y - width / 2); // Right side to horizontal intersection
            graphics.lineTo(x + length, y - width / 2); // Right end of horizontal bar
            graphics.lineTo(x + length, y + width / 2); // Bottom right of horizontal
            graphics.lineTo(x + width / 2, y + width / 2); // Right side intersection
            graphics.lineTo(x + width / 2, y + length); // Bottom right of vertical
            graphics.lineTo(x - width / 2, y + length); // Bottom left of vertical
            graphics.lineTo(x - width / 2, y + width / 2); // Left side intersection
            graphics.lineTo(x - length, y + width / 2); // Left end of horizontal
            graphics.lineTo(x - length, y - width / 2); // Top left of horizontal
            graphics.lineTo(x - width / 2, y - width / 2); // Left side intersection
            graphics.closePath(); // Back to start
            break;
    }

    graphics.endFill();

    // Store shape type as property
    graphics.shapeType = shapeType;

    // Make shape interactive
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';

    graphics.on('pointerdown', () => {
        // If no shape type selected yet, set it as the first clicked shape type
        if (!shapeTypes.includes(selectedShapeType)) {
            selectedShapeType = shapeType;
            updateCurrentResultDisplay();

            // Remove the shape
            app.stage.removeChild(graphics);
        } else {
            // Handle the click based on shape type
            handleShapeClick(graphics, shapeType, color);
        }
    });

    return graphics;
}

function drawShapes(shapes) {
    app.stage.removeChildren();
    shapes.forEach(shape => {
        app.stage.addChild(shape);
    });
}

/**
 * Handle the click based on shape type.
 */
function handleShapeClick(graphics, shapeType, color) {
    // Remove the shape from the stage
    app.stage.removeChild(graphics);
    // Replace with other shape that has same `shapeType`
    app.stage.addChild(generateAGraphic(graphics.shapeType));

    if (shapeType === selectedShapeType) {
        correctSelect(graphics);
    } else {
        falseSelect(graphics);
    }

    // End game if `lives` are no more
    if (lives < 1) showResultModal();
}

function correctSelect(graphics) {
    increaseScore(1);

    toaster.show(`Correct! You tap on ${graphics.shapeType}, score: ${score}`);
}

function falseSelect(graphics) {
    // Reduce life
    lives--;
    updateLivesDisplay();

    toaster.show(`Wrong shape! You chose ${graphics.shapeType}. Try again.`);
}

function increaseScore(scoreAdd) {
    // Increase score
    score++;
    document.querySelector('#score').textContent = score;
    updateCurrentResultDisplay();
}
// Update Lives Display
function updateLivesDisplay() {
    const livesDisplay = document.querySelector('.lives-display');
    livesDisplay.innerHTML = ''; // Clear existing hearts

    for (let i = 0; i < 5; i++) {

        const heart = document.createElement('span');
        heart.classList.add('heart');
        if (i < lives) {
            heart.innerHTML = '❤️'; // Full heart
        } else {
            heart.classList.add('empty');
            heart.innerHTML = '🤍'; // White heart emoji as empty heart
        }
        livesDisplay.appendChild(heart);
    }
}

function showResultModal() {
    confetti.triggerConfetti();
    $('#result-modal').foundation('open');

}
// function updateLivesDisplay() {
//     const selectedShapeDisplay = document.getElementById('selected-shape-type');
//     selectedShapeDisplay.textContent = graphics.shapeType; // Update the selected shape display
// }

function updateCurrentResultDisplay() {
    let msg = '';
    if (!shapeTypes.includes(selectedShapeType)) {
        msg = 'Select any shape';
    } else if (score < 1) {
        msg = `Tap on more ${selectedShapeType}s`;
    } else {
        msg = `${score} ${selectedShapeType}s`;
    }
    currentResultElement.textContent = msg;
}