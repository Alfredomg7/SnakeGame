class Food {
    constructor(ctx, scale, rows, columns) {
        this._ctx = ctx
        this._scale = scale;
        this._rows = rows;
        this._columns = columns;
        this.spawn();
    }

    adjustLayout(newScale, newRows, newColumns) {
        const oldScale = this._scale;
        this._scale = newScale;
        this._rows = newRows;
        this._columns = newColumns;
        
        // Reposition the food based on the new scale ensuring is within the new grid boundaries
        this.x = Math.min((this.x / oldScale) * this._scale, (this._columns - 1) * this._scale);
        this.y = Math.min((this.y / oldScale) * this._scale, (this._rows - 1) * this._scale);
        this.draw(); // Redraw the food at the new position
    }

    // Places the food at a random location excluding the snake's body
    spawn(snake = null) {
        // Handle initial spawn without snake
        if (!snake) {
            this.x = Math.floor(Math.random() * this._columns) * this._scale;
            this.y = Math.floor(Math.random() * this._rows) * this._scale;
            this.draw(); // Draw the food at the initial position
            return;
        }

        // Handle spawn with snake collision check
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * this._columns) * this._scale;
            newY = Math.floor(Math.random() * this._rows) * this._scale;
        } while (snake.isPositionOccupied(newX, newY));

        this.x = newX;
        this.y = newY;
    }

    // Draws the food on the canvas
    draw() {
        this._ctx.fillStyle = "#ff0000";
        this._ctx.fillRect(this.x, this.y, this._scale, this._scale);
    }
}

export default Food;
