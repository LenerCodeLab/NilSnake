document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);
});

let gameInterval;
let direction = 'right';

function restartGame() {
    clearInterval(gameInterval);
    showPopup('restartPopup');
    document.getElementById('restartButton').style.display = 'none';
}

function startGame() {
    clearInterval(gameInterval);

    const restartButton = document.getElementById('restartButton');
    restartButton.style.display = 'inline'; // Mostrar el botón de reinicio

    const restartPopup = document.getElementById('restartPopup');
    restartPopup.style.display = 'none'; // Ocultar el cuadro de reinicio

    const gameContainer = document.querySelector('.game-container');
    const snakeHead = document.getElementById('snake-head');
    const snake = document.getElementById('snake');
    const food = document.getElementById('food');

    snakeHead.style.left = '10px';
    snakeHead.style.top = '10px';
    snake.innerHTML = '';

    gameContainer.appendChild(snakeHead);

    let snakeX = 10;
    let snakeY = 10;
    let foodX = 5;
    let foodY = 5;
    let gridSize = 20;
    let gridWidth = gameContainer.clientWidth / gridSize;
    let gridHeight = gameContainer.clientHeight / gridSize;
    let snakeXSpeed = 1;
    let snakeYSpeed = 0;
    let snakeTrail = [];
    let tailLength = 1;

    function update() {
        snakeX += snakeXSpeed;
        snakeY += snakeYSpeed;

        if (snakeX < 0) {
            snakeX = gridWidth - 1;
        }
        if (snakeX >= gridWidth) {
            snakeX = 0;
        }

        if (snakeY < 0) {
            snakeY = gridHeight - 1;
        }
        if (snakeY >= gridHeight) {
            snakeY = 0;
        }

        // Verificar si la serpiente choca consigo misma
        const bodySegments = snake.children;
        for (let i = 0; i < bodySegments.length; i++) {
            const segment = bodySegments[i];
            const segmentX = parseInt(segment.style.left) / gridSize;
            const segmentY = parseInt(segment.style.top) / gridSize;

            if (snakeX === segmentX && snakeY === segmentY) {
                showPopup('loserPopup');
                stopGame();
                return;
            }
        }

        snakeTrail.push({ x: snakeX, y: snakeY });
        while (snakeTrail.length > tailLength) {
            snakeTrail.shift();
        }

        if (snakeX === foodX && snakeY === foodY) {
            tailLength++;
            foodX = Math.floor(Math.random() * gridWidth);
            foodY = Math.floor(Math.random() * gridHeight);
        }

        snakeHead.style.left = snakeX * gridSize + 'px';
        snakeHead.style.top = snakeY * gridSize + 'px';

        food.style.left = foodX * gridSize + 'px';
        food.style.top = foodY * gridSize + 'px';

        // Crear segmentos para el cuerpo de la serpiente
        snake.innerHTML = '';
        snakeTrail.forEach((segment) => {
            const bodySegment = document.createElement('div');
            bodySegment.className = 'snake-segment';
            bodySegment.style.left = segment.x * gridSize + 'px';
            bodySegment.style.top = segment.y * gridSize + 'px';
            snake.appendChild(bodySegment);
        });
    }

    function changeDirection(newDirection) {
        switch (newDirection) {
            case 'up':
                if (snakeYSpeed !== 1) {
                    snakeXSpeed = 0;
                    snakeYSpeed = -1;
                }
                break;
            case 'down':
                if (snakeYSpeed !== -1) {
                    snakeXSpeed = 0;
                    snakeYSpeed = 1;
                }
                break;
            case 'left':
                if (snakeXSpeed !== 1) {
                    snakeXSpeed = -1;
                    snakeYSpeed = 0;
                }
                break;
            case 'right':
                if (snakeXSpeed !== -1) {
                    snakeXSpeed = 1;
                    snakeYSpeed = 0;
                }
                break;
        }
    }
    
    document.getElementById('upBtn').addEventListener('click', () => changeDirection('up'));
    document.getElementById('leftBtn').addEventListener('click', () => changeDirection('left'));
    document.getElementById('rightBtn').addEventListener('click', () => changeDirection('right'));
    document.getElementById('downBtn').addEventListener('click', () => changeDirection('down'));

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                changeDirection('up');  
                break;
            case 'ArrowDown':
                changeDirection('down');
                break;
            case 'ArrowLeft':
                changeDirection('left');
                break;
            case 'ArrowRight':
                changeDirection('right');
                break;
        }
    });

    document.querySelector('.controls').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const direction = e.target.textContent;
            changeDirection(direction.toLowerCase());
        }
    });

    gameInterval = setInterval(update, 150);
}

function stopGame() {
    clearInterval(gameInterval);
}

function showPopup(popupId) {
    clearInterval(gameInterval);
    const popup = document.getElementById(popupId);
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}
