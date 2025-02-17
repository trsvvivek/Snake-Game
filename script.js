// References to DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const mainMenu = document.getElementById('main-menu');
const difficultyScreen = document.getElementById('difficulty-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const highscoreBtn = document.getElementById('highscore-btn');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');
const exitBtn = document.getElementById('exit-btn'); // Reference for the exit button

// Audio elements
const bgMusic = new Audio('your-background-music.mp3'); // Path to your background music
bgMusic.loop = true; // Loop the background music
const eatSound = new Audio('eat-sound.mp3'); // Path to your eat sound effect
const gameOverSound = new Audio('game-over-sound.mp3'); // Path to your game over sound effect

// Variables to manage the game state
let gameInterval;
let snake;
let direction;
let food;
let gameSpeed = 100;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Constants for sizes
const segmentSize = 20; // Size of each snake segment
const foodSize = 15; // Diameter of the food

// Game initialization function
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    snake = [{ x: 50, y: 50 }]; // Starting position of the snake
    direction = { x: segmentSize, y: 0 };
    food = generateFood();
    score = 0;
    gameInterval = setInterval(() => gameLoop(ctx, canvas), gameSpeed);
    bgMusic.play(); // Play background music when game starts
}

// Game logic (loop)
function gameLoop(ctx, canvas) {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (newHead.x < 0) newHead.x = canvas.width - segmentSize;
    else if (newHead.x >= canvas.width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = canvas.height - segmentSize;
    else if (newHead.y >= canvas.height) newHead.y = 0;
    snake.unshift(newHead);

    if (collisionWithSelf()) {
        gameOver();
        return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = 'blue';
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, segmentSize, segmentSize);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(snake[i].x, snake[i].y, segmentSize, segmentSize); // Outline for the body segments
    }

    // Draw the snake's head as a smiley emoji
    ctx.font = `${segmentSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤡', snake[0].x + segmentSize / 2, snake[0].y + segmentSize / 2); // Draw the smiley in the center of the head segment

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + segmentSize / 2, food.y + segmentSize / 2, foodSize / 2, 0, 2 * Math.PI); // Draw a circle with radius half of foodSize
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Collision detection with snake's own body
function collisionWithSelf() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Generate random food position
function generateFood() {
    const x = Math.floor(Math.random() * (600 / segmentSize)) * segmentSize;
    const y = Math.floor(Math.random() * (400 / segmentSize)) * segmentSize;
    return { x, y };
}

// Handle keypress events for snake control
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -segmentSize };
    if (event.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: segmentSize };
    if (event.key === 'ArrowLeft' && direction.x === 0) direction = { x: -segmentSize, y: 0 };
    if (event.key === 'ArrowRight' && direction.x === 0) direction = { x: segmentSize, y: 0 };
});

// Add event listeners to control the snake with on-screen buttons
document.getElementById('up-btn').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: -segmentSize };
});
document.getElementById('down-btn').addEventListener('click', () => {
    if (direction.y === 0) direction = { x: 0, y: segmentSize };
});
document.getElementById('left-btn').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: -segmentSize, y: 0 };
});
document.getElementById('right-btn').addEventListener('click', () => {
    if (direction.x === 0) direction = { x: segmentSize, y: 0 };
});

// Transition functions
function startGame() {
    welcomeScreen.classList.add('hidden');
    mainMenu.classList.add('hidden');
    difficultyScreen.classList.remove('hidden');
}

function selectDifficulty(level) {
    switch (level) {
        case 'easy': gameSpeed = 200; break;
        case 'medium': gameSpeed = 100; break;
        case 'hard': gameSpeed = 50; break;
    }
    difficultyScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initGame();
}

function gameOver() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameOverSound.play();
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

function showHighScore() {
    alert(`High Score: ${highScore}`);
}

function restartGame() {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    initGame();
}

function goHome() {
    gameOverScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
}

// Function to exit the game and go back to the welcome screen
function exitGame() {
    clearInterval(gameInterval);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    gameScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}

// Event listeners for buttons
startBtn.addEventListener('click', startGame);
highscoreBtn.addEventListener('click', showHighScore);
easyBtn.addEventListener('click', () => selectDifficulty('easy'));
mediumBtn.addEventListener('click', () => selectDifficulty('medium'));
hardBtn.addEventListener('click', () => selectDifficulty('hard'));
restartBtn.addEventListener('click', restartGame);
homeBtn.addEventListener('click', goHome);
exitBtn.addEventListener('click', exitGame); // Add event listener for the exit button

// Show welcome message for 3 seconds, then go to main menu
window.onload = () => {
    welcomeScreen.classList.remove('hidden');
    mainMenu.classList.add('hidden');
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    }, 3000);
};
