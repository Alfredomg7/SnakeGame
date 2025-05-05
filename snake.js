class Snake {
    constructor(canvas, ctx, scale) {
        this._canvas = canvas;
        this._ctx = ctx;
        this._scale = scale;
        this._body = [{x:0, y:0}];
        this._xSpeed = this._scale;
        this._ySpeed = 0;
        this._hasEaten = false;
        this._nextDirection = null;
        this._currentDirection = 'Right';
    }

    // Draws the snake on the canvas
    draw(fullDraw = false) {
        this._ctx.fillStyle = "#fff";

        if (fullDraw) {
            // Draw the entire snake body
            for (const segment of this._body) {
                this._ctx.fillRect(segment.x, segment.y, this._scale, this._scale);
            }
        } else {
            // Incrementally draw - only update head and tail
            // Draw the new head
            const head = this._body[0];
            this._ctx.fillRect(head.x, head.y, this._scale, this._scale);
        
            // Clear the tail if the snake hasn't eaten
            if (!this._hasEaten) {
                // Handle multi and single segment snake
                const tail = this._body.length > 1 ? this._body[this._body.length - 1] : this.calculatePreviousHeadPosition();
                this._ctx.clearRect(tail.x, tail.y, this._scale, this._scale);
            }
        }
    }

    // Updates the position of the snake
    update() {
        if (this._nextDirection) {
            this._currentDirection = this._nextDirection;
            this._nextDirection = null;
        
            // Change the velocity based on the new direction
            switch(this._currentDirection) {
                case 'Up':
                    this._xSpeed = 0;
                    this._ySpeed = -this._scale;
                    break;
                case 'Down':
                    this._xSpeed = 0;
                    this._ySpeed = this._scale;
                    break;
                case 'Left':
                    this._xSpeed = -this._scale;
                    this._ySpeed = 0;
                    break;
                case 'Right':
                    this._xSpeed = this._scale;
                    this._ySpeed = 0;
                    break;
            }
        }

        let newHead = {
            x: this._body[0].x + this._xSpeed,
            y: this._body[0].y + this._ySpeed
        };
    
        // Add new head to the beginning of the body
        this._body.unshift(newHead);
    
        // Remove the last segment of the body if the snake hasn't eaten
        if (!this._hasEaten) {
            this._body.pop();
        } else {
            this._hasEaten = false;
        }
    
        this.checkCollisions();
    }    

    // Update the next direction from user input
    changeDirection(direction) {
        // Prevent 180 degree turns
        if (this._currentDirection === 'Up' && direction === 'Down') return
        if (this._currentDirection === 'Down' && direction === 'Up') return
        if (this._currentDirection === 'Left' && direction === 'Right') return
        if (this._currentDirection === 'Right' && direction === 'Left') return 

        this._nextDirection = direction;
    }

    // Checks if the snake has eaten the food
    eat(food) {
        // Check if the snake eats the food
         if (this._body[0].x === food.x && this._body[0].y == food.y){
            // Add a new segment at the current tail position
            let newSegment = this.calculateNewSegmentPosition();
            this._body.push(newSegment);
            this._hasEaten = true;
            return true;
         }
         return false;
    }

    calculateNewSegmentPosition() {
        let lastSegment = this._body[this._body.length - 1];

        let newSegment =  {
            x: lastSegment.x - this._xSpeed,
            y: lastSegment.y - this._ySpeed
        }
        
        return newSegment;
    }

    adjustLayout(newCanvas, newScale) {
        const oldScale = this._scale;
        this._canvas = newCanvas;
        this._scale = newScale;
        
        // Reposition the snake's body and redraw it
        for (let i = 0; i < this._body.length; i++) {
            this._body[i] = {
                x: (this._body[i].x / oldScale) * this._scale,
                y: (this._body[i].y / oldScale) * this._scale
            };
        }

        // Draw the complete snake at its new position
        this.draw(true);

        // Update the speed based on the new scale immediately
        if (this._xSpeed !== 0) {
            this._xSpeed = Math.sign(this._xSpeed) * this._scale;
        }
        if (this._ySpeed !== 0) {
            this._ySpeed = Math.sign(this._ySpeed) * this._scale;
        }
    }
    
    checkBoundsCollision() {
        return (this._body[0].x < 0 || this._body[0].x >= this._canvas.width || 
            this._body[0].y < 0 || this._body[0].y >= this._canvas.height)
    }

    checkSelfCollision() {
        for (let i = 1; i < this._body.length; i++) {
            if (this._body[i].x === this._body[0].x && this._body[i].y === this._body[0].y) {
                return true;
            }
        }
        return false;
    }

    checkCollisions() {
        const boundsCollision = this.checkBoundsCollision();
        const selfCollision = this.checkSelfCollision();

        return boundsCollision || selfCollision;
    }

    isPositionOccupied(x, y) {
        return this._body.some(segment => segment.x === x && segment.y === y);
    }

    calculatePreviousHeadPosition() {
        const head = this._body[0];
        
        return {
            x: head.x - this._xSpeed,
            y: head.y - this._ySpeed
        };
    }
}

export default Snake;