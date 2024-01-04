class Food {
    constructor(ctx, scale, rows, columns) {
        this._ctx = ctx
        this._scale = scale;
        this._rows = rows;
        this._columns = columns;
        this.spawn(); 
    }

    adjustLayout(newScale,newRows,newColumns) {
        const oldScale = this._scale;
        this._scale = newScale;
        this._rows = newRows;
        this._columns = newColumns;
        
        // Reposition the food based on the new scale ensuring is within the new grid boundaries
        this.x = Math.min((this.x / oldScale) * this._scale, (this._columns - 1) * this._scale);
        this.y = Math.min((this.y / oldScale) * this._scale, (this._rows - 1) * this._scale);
    }

    // Places the food at a random location
    spawn() {
        this.x = Math.floor(Math.random() * this._columns) * this._scale;
        this.y = Math.floor(Math.random() * this._rows) * this._scale;
    }

    // Draws the food on the canvas
    draw() {
        this._ctx.fillStyle = "#ff0000";
        this._ctx.fillRect(this.x, this.y, this._scale, this._scale);
    }
}

export default Food;
