import Snake from './snake.js';
import Food from './food.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.status = 'idle'; 
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.moveInterval = 150; // milliseconds
        this.scale = null;
        this.rows = null;
        this.columns = null;
        this.snake = null;
        this.food = null;

        this.setupGame();
    }

    // Setup the game components and event listeners
    setupGame() {
        this.resizeCanvas(false);
        this.setupGameComponents();
        this.setupControls();
        this.setupResizeListener();
    }

    // Determine the scale based on canvas size
    determineScale(width, height) {
        const minDimension = Math.min(width, height);
        return Math.floor(minDimension / 20);
    }

    // Control snake position update
    updateSnakePosition() {
        this.snake.update();
        this.snake.draw();
    }

    // Control food respawn
    respawnFood() {
        this.food.spawn(this.snake);
        this.food.draw();
    }

    // Change canvas size and layout components responsively
    resizeCanvas(gameInitialized = true) {
        // Set the drawing buffer size to match the displayed size
        let displayWidth = this.canvas.offsetWidth;
        let displayHeight = this.canvas.offsetHeight;
    
        this.scale = this.determineScale(displayWidth, displayHeight);

        // Adjust canvas dimensions to be multiples of the scale
        this.canvas.width = Math.floor(displayWidth / this.scale) * this.scale;
        this.canvas.height = Math.floor(displayHeight / this.scale) * this.scale;

        this.rows = this.canvas.height / this.scale;
        this.columns = this.canvas.width / this.scale;

        if (gameInitialized) {
            // Adjust snake and food based on the new canvas size
            this.food.adjustLayout(this.scale, this.rows, this.columns);
            this.snake.adjustLayout(this.canvas, this.scale);
        }
    }

    // Initialize the game components (snake and food) 
    setupGameComponents() {
        this.snake = new Snake(this.canvas, this.ctx, this.scale);
        this.food = new Food(this.ctx, this.scale, this.rows, this.columns);
    }

    // Sets up the keyboard controls for the snake movement
    setupControls() {
        window.addEventListener('keydown', ((evt) => {
            const direction = evt.key.replace('Arrow', '');
            this.snake.changeDirection(direction);
        }));
    }

    // Sets up the event listener for resize canvas on window resize
    setupResizeListener() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // The main game loop function
    gameLoop(currentTime) {
        // Calculate the time elapsed since the last frame
        if (!this.lastTime) this.lastTime = currentTime;
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.accumulatedTime += deltaTime;

        // Handle state updates based on the move interval
        while (this.accumulatedTime >= this.moveInterval) {
            // Snake movement
            this.updateSnakePosition();
            
            // Food respawn
            if (this.snake.eat(this.food)) {
                this.respawnFood();
            }

            // Collision detection
            if (this.snake.checkCollisions()) {
                this.status = 'over';
            }

            this.accumulatedTime -= this.moveInterval;
        }

        
        // Continue or end the game loop based on the status 
        if (this.status === 'running') {
            requestAnimationFrame((time) => this.gameLoop(time)); // Continue the game loop
        } else if (this.status === 'over') {
            this.endGame(); // End the game
            return;
        }
    }

    // Displays the Game Over message on the canvas
    displayGameOverMessage() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px Arial'
        this.ctx.fillText("Game Over", this.canvas.width / 4, this.canvas.height / 2);
    }

    // Sets up the restart button functionality
    setupRestartButton() {
        let restartButton = document.getElementById('restartButton');
        restartButton.style.visibility = 'visible';
        restartButton.onclick = () => {
            restartButton.style.visibility = 'hidden';
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.setupGameComponents();
            this.lastTime = 0;
            this.accumulatedTime = 0;
            this.start();
        };
    }

    // Handles the end game scenario
    endGame() {
        this.displayGameOverMessage();
        this.setupRestartButton();
    }

    // Start the game
    start() {
        this.status = 'running';
        requestAnimationFrame((time) => this.gameLoop(time)); // Start the game loop
    }
}

export default Game;