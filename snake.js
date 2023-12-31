class Snake {
    constructor(canvas, ctx, scale) {
        this._canvas = canvas;
        this._ctx = ctx;
        this._scale = scale;
        this._body = [{x:0, y:0}];
        this._xSpeed = this._scale;
        this._ySpeed = 0;
        this._hasEaten = false;
    }
   
    // Draws the snake on the canvas
    draw() {
        // Clear the canvas where the snake moves
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

           // Draw each segment of the snake
        this._ctx.fillStyle = '#fff';
        for (let i = 0; i < this._body.length; i++) {
            this._ctx.fillRect(this._body[i].x, this._body[i].y, this._scale, this._scale);
        }
    }

    // Updates the position of the snake
    update() {
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

    // Changes the direction of the snake based on arrow key input
    changeDirection(direction) {
        // Change the velocity based on the direction
        switch(direction) {
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
        
        // Reposition the snake's head and recalculate its body
        this._body = this._body.map(segment => {
            return {
                x: (segment.x / oldScale) * this._scale,
                y: (segment.y / oldScale) * this._scale
            };
        });

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
}

export default Snake;