class Score {
    constructor() {
        this.currentScore = 0;
        this.highScore = 0;
        this.loadHighScore();
        this.setupUI();
    }

    increment(points = 10) {
        this.currentScore += points;
        this.updateScoreDisplay();
        
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
            this.updateHighScoreDisplay();
        }
        
        return this.currentScore;
    }
    
    reset() {
        this.currentScore = 0;
        this.updateScoreDisplay();
        return this.currentScore;
    }
    
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore);
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        this.highScore = saved ? parseInt(saved) : 0;
    }
    
    saveScoreHistory() {
        if (this.currentScore <= 0) return;
        
        const history = JSON.parse(localStorage.getItem('snakeScoresHistory')) || [];
        history.push({
            score: this.currentScore,
            date: new Date().toISOString()
        });
        
        // Order scores and keep only the top 10
        history.sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('snakeScoresHistory', JSON.stringify(history));
    }

    setupUI() {
        // Initialize the display with current values
        this.updateScoreDisplay();
        this.updateHighScoreDisplay();
    }
    
    updateScoreDisplay() {
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = this.currentScore;
            scoreElement.classList.add('score-update');
            setTimeout(() => scoreElement.classList.remove('score-update'), 300);
        }
    }
    
    updateHighScoreDisplay() {
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = this.highScore;
        }
    }
}

export default Score;