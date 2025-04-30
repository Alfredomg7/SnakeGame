// Import the Snake and Food classes from their respective modules
import Snake from './snake.js';
import Food from './food.js';

// Setting up canvas context for drawing
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const updateFrequency = 15;
let frameCounter = 0;
let scale;
let rows;
let columns
let snake;
let food;

// Determine the scale based on canvas size
function determineScale(width, height) {
    const minDimension = Math.min(width, height);
    return Math.floor(minDimension / 20);
}

// Control snake speed updating the snake position based on frameCounter
function updateSnakePosition() {
    if (frameCounter % updateFrequency === 0) {
        snake.update();
    }
}

// Change canvas size and layout components responsively
function resizeCanvas(gameInitialized=true) {
    // Set the drawing buffer size to match the displayed size
    let displayWidth = canvas.offsetWidth;
    let displayHeight = canvas.offsetHeight;
  
    scale = determineScale(displayWidth, displayHeight);

    // Adjust canvas dimensions to be multiples of the scale
    canvas.width = Math.floor(displayWidth / scale) * scale;
    canvas.height = Math.floor(displayHeight / scale) * scale;

    rows = canvas.height / scale;
    columns = canvas.width / scale;

    if (gameInitialized) {
        // Adjust snake and food based on the new canvas size
        food.adjustLayout(scale, rows, columns);
        snake.adjustLayout(canvas, scale);
    }
}

// Sets up the initial state of the game 
function setupGame() {
    snake = new Snake(canvas, ctx, scale);
    food = new Food(ctx, scale, rows, columns);
}

// Sets up the keyboard controls for the snake
function setupControls() {
    window.addEventListener('keydown', ((evt) => {
        const direction = evt.key.replace('Arrow', '');
        snake.changeDirection(direction);
    }));
}

// Sets up the event listener for windows resize
function setupResizeListener() {
    window.addEventListener('resize', resizeCanvas);
}

// The main game loop function
function gameLoop() {
    frameCounter++;
    updateSnakePosition();
    snake.draw();
    food.draw();

    // Check if the snake has eaten the food
    if (snake.eat(food)) {
        food.spawn(snake);
    }

    // Check for collision
    if (snake.checkCollisions()) {
        ('Collision Detected');
        endGame();
    } else {
        // Rquest the next animation frame
        requestAnimationFrame(gameLoop);
    }
}

// Displays the Game Over message on the canvas
function displayGameOverMessage() {
    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial'
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
}

// Sets up the restart button functionality
function setupRestartButton() {
    let restartButton = document.getElementById('restartButton');
    restartButton.style.visibility = 'visible';
    restartButton.onclick = function() {
        location.reload();
    };
}

// Handles the end game scenario
function endGame(){
    displayGameOverMessage();
    setupRestartButton();
}

// The main function that starts the game
function main() {
    resizeCanvas(false);
    setupGame();
    setupControls();
    setupResizeListener();
    requestAnimationFrame(gameLoop); // Start the game loop
}

// Call the main function to start the game
main();