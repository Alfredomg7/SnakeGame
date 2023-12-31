class Food {
    constructor(ctx, scale, rows, columns) {
        this._ctx = ctx
        this._scale = scale;
        this._rows = rows;
        this._columns = columns;
        this.spawn(); 
    }

    adjustLayout(newScale,newRows,newColumns) {
        this._scale = newScale;
        this._rows = newRows;
        this._columns = newColumns;
        this.spawn();
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
