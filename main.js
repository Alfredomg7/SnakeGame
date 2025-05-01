// Import the Snake and Food classes from their respective modules
import Snake from './snake.js';
import Food from './food.js';

// Setting up canvas context for drawing
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let lastTime = 0;
let accumulatedTime = 0;
const moveInterval = 150; // milliseconds
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

// Control snake position update
function updateSnakePosition() {
    snake.update();
    snake.draw();
}

// Control food respawn
function respawnFood() {
    food.spawn(snake);
    food.draw();
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
function gameLoop(currentTime) {
    // Calculate the time elapsed since the last frame
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    accumulatedTime += deltaTime;
    
    // Handle state updates based on the move interval
    while (accumulatedTime >= moveInterval) {
        // Snake movement
        updateSnakePosition();
        
        // Food respawn
        if (snake.eat(food)) {
            respawnFood();
        }

        // Collision detection
        if (snake.checkCollisions()) {
            endGame();
            return;
        }

        accumulatedTime -= moveInterval;
    }

    // Continue the game loop
    requestAnimationFrame(gameLoop);
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