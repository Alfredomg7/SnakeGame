import Snake from './snake.js';
import Food from './food.js';
import Score from './score.js';

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.score = new Score();
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.moveInterval = 150; // milliseconds
        this.status = 'running';
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
        this.setupPauseButton();
    }

    // Determine the scale based on canvas size
    determineScale(width, height) {
        const minDimension = Math.min(width, height);
        return Math.floor(minDimension / 20);
    }

    // Control snake position update
    updateSnakePosition() {
        this.snake.draw();
        this.snake.update();
    }

    // Control food respawn
    respawnFood() {
        this.food.spawn(this.snake);
        this.food.draw();
        this.score.increment();
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
            // Adjust canvas based on the new scale
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            switch (this.status) {
                case 'running':
                    this.status = 'paused';
                    break;
                case 'paused':
                    this.displayPauseMessage();
                    break;
                case 'over':
                    this.displayGameOverMessage();
                    break;
            }
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
            // Handle direction changes
            if (evt.key.includes('Arrow')) {
                const direction = evt.key.replace('Arrow', '');
                this.snake.changeDirection(direction);
            }
            
            // Handle pause with 'p' or Space key
            if ((evt.key === 'p' || evt.key === 'P' || evt.key === ' ') && 
                (this.status === 'running' || this.status === 'paused')) {
                this.togglePause();
            }
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
            requestAnimationFrame((time) => this.gameLoop(time));
        } else if (this.status === 'paused') {
            this.pause();
            return;
        } else if (this.status === 'over') {
            this.end();
            return;
        }
    }

    // Toggle between pause and resume
    togglePause() {
        if (this.status === 'running') {
            this.status = 'paused';
        } else if (this.status === 'paused') {
            this.resume();
        }
    }

    // Displays the Pause message on the canvas
    displayPauseMessage() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '40px Arial'
        this.ctx.fillText("Paused", this.canvas.width / 4, this.canvas.height / 2);
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
            this.status = 'running';
            this.restart();
        };
    }

    // Sets up the pause button functionality
    setupPauseButton() {
        let pauseButton = document.getElementById('pauseButton');
        pauseButton.onclick = () => {
            if (this.status === 'running' || this.status === 'paused') {
                this.togglePause();
            }
        };
    }

    // Start the game
    start() {
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Handle pause scenario
    pause() {
        document.getElementById('pauseButton').textContent = 'Resume';
        this.displayPauseMessage();
    }
        
    // Resume the game after a pause
    resume() {
        document.getElementById('pauseButton').textContent = 'Pause';
        this.status = 'running';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.draw(true);
        this.food.draw();
        this.lastTime = performance.now();
        this.accumulatedTime = 0;
                
        requestAnimationFrame((time) => this.gameLoop(time, true));
    }

    // Handles the end game scenario
    end() {
        this.displayGameOverMessage();
        this.setupRestartButton();
        this.score.saveScoreHistory();
    }

    // Handles the restart functionality
    restart() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.setupGameComponents();
        this.score.reset();
        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.start();
    }
}

export default Game;