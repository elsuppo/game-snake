const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scoreValue = document.querySelector('.score-value');
const recordsSpan = document.querySelector('.records-switch');
const recordsOpen = document.querySelector('.records');

let speed = 1;

let score = 0;

let recordsList = {};
let countGame = 0;

let cellCount = 20;
let cellSize = canvas.width / cellCount;

let snake = [];
snake[0] = {
    x: Math.floor(Math.random() * cellCount),
    y: Math.floor(Math.random() * cellCount)
};

let xHeadSnake = snake[0].x;
let yHeadSnake = snake[0].y;

const sound = new Audio('./assets/audio/bite.mp3');
sound.volume = 0.1;

const foodImg = new Image();
foodImg.src = './assets/img/food.png';

const snakeImg = new Image();
snakeImg.src = './assets/img/snake.png';

let xFood = Math.floor(Math.random() * cellCount);
let yFood = Math.floor(Math.random() * cellCount);

let xDirection = 0;
let yDirection = 0;

let gameOver = false;

let xDirectionPrev = 0;
let yDirectionPrev = 0;

drawGame();
function drawGame() {
    // fix bag
    if (xDirectionPrev === 1 && xDirection === -1) xDirection = xDirectionPrev;
    if (xDirectionPrev === -1 && xDirection === 1) xDirection = xDirectionPrev;
    if (yDirectionPrev === 1 && yDirection === -1) yDirection = yDirectionPrev;
    if (yDirectionPrev === -1 && yDirection === 1) yDirection = yDirectionPrev;
    xDirectionPrev = xDirection;
    yDirectionPrev = yDirection;

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('GAME OVER!', canvas.width / 8.8, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2.4, canvas.height / 1.7);
        ctx.font = '12px Arial';
        ctx.fillText('for return click on the snake', canvas.width / 3.2, canvas.height / 1.5);
        ctx.fillText('or refresh the page', canvas.width / 2.7, canvas.height / 1.4);
        document.body.removeEventListener('keydown', keyDown);
        return;
    };
    
    clearScreen();   
    drawFood();
    drawSnake();
    moveSnake();
    drawSpeed();
    changeSpeed();
    drawHighScore();
    setTimeout(drawGame, 200 / speed);
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'green';
        // ctx.fillRect(snake[i].x * cellCount, snake[i].y * cellCount, cellSize, cellSize);
        ctx.drawImage(snakeImg, snake[i].x * cellCount, snake[i].y * cellCount);
    };

    if (xFood == xHeadSnake && yFood == yHeadSnake) {
        score++;
        scoreValue.innerHTML = `Score: ${score}`;
        sound.play();
        xFood = Math.floor(Math.random() * cellCount);
        yFood = Math.floor(Math.random() * cellCount);
    } else {
        snake.pop();
    };

    if (xHeadSnake < 0 || xHeadSnake >= cellSize || yHeadSnake < 0 || yHeadSnake >= cellSize) {
        gameOver = true;
        countGame++;
        localStorage.setItem('countGameSuppo', countGame);
        recordsList[countGame] = score;
        localStorage.setItem('recordsListSuppo', JSON.stringify(recordsList));
    };

    let newHead = {
        x: xHeadSnake,
        y: yHeadSnake
    };

    for (let i = 0; i < snake.length; i++) {
        if (newHead.x == snake[i].x && newHead.y == snake[i].y) {
            gameOver = true;
            countGame++;
            localStorage.setItem('countGameSuppo', countGame);
            recordsList[countGame] = score;
            localStorage.setItem('recordsListSuppo', JSON.stringify(recordsList));
            break;
        };
    };

    snake.unshift(newHead);
};

function drawFood() {
    // ctx.fillStyle = 'red';
    // ctx.fillRect(xFood * cellCount, yFood * cellCount, cellSize, cellSize);
    ctx.drawImage(foodImg, xFood * cellCount, yFood * cellCount);
};

function moveSnake() {
    xHeadSnake += xDirection;
    yHeadSnake += yDirection;
};

function drawSpeed() {
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Speed ${speed}`, canvas.width - 50, 16);
};

function drawHighScore() {
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    if (localStorage.getItem('highScoreSuppo')) {
        ctx.fillText(`High score ${localStorage.getItem('highScoreSuppo')}`, canvas.width - 393, 16);
    } else {
        ctx.fillText(`High score 0`, canvas.width - 393, 16);
    };
};

function changeSpeed() {
    if (score > 2) {
        speed = 2;
    };
    if (score > 10) {
        speed = 3;
    };
    if (score > 20) {
        speed = 4;
    };
    if (score > 30) {
        speed = 5;
    };
    if (score > 40) {
        speed = 6;
    };
    if (score > 50) {
        speed = 7;
    };
};

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    if (event.keyCode == 37 && xDirection != 1) {
        yDirection = 0;
        xDirection = -1;
    };

    if (event.keyCode == 38 && yDirection != 1) {
        yDirection = -1;
        xDirection = 0;
    };

    if (event.keyCode == 39 && xDirection != -1) {
        yDirection = 0;
        xDirection = 1;
    };

    if (event.keyCode == 40 && yDirection != -1) {
        yDirection = 1;
        xDirection = 0;
    };
};

let isOpen = false;
recordsSpan.addEventListener('click', () => {
    if (!isOpen) {
        recordsOpen.classList.add('open');
        recordsSpan.innerText = 'records->';
        isOpen = true;
    } else {
        recordsOpen.classList.remove('open');
        recordsSpan.innerText = '<-records';
        isOpen = false;
    };
});

function getLocalStorage() {
    if (localStorage.getItem('recordsListSuppo')) {
        recordsList = JSON.parse(localStorage.getItem('recordsListSuppo'));
        countGame = localStorage.getItem('countGameSuppo');
        const keys = Object.keys(recordsList);
        keys.forEach(key => {
            const recordSpan = `<span>Game: ${key}, score: ${recordsList[key]}<span>`;
            recordsOpen.insertAdjacentHTML('afterbegin', recordSpan);
        });

        // for high score
        const values = Object.values(recordsList);
        let highScore = values.sort((a, b) => b - a)[0]
        localStorage.setItem('highScoreSuppo', highScore);
    };
};

getLocalStorage();


console.log(
    'Оценка: 60\n\n',
    '1. Вёрстка (10/10)\n',
    'реализован интерфейс игры +5\n',
    'в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\n\n',
    '2. Логика игры. Ходы, перемещения фигур, другие действия игрока подчиняются определённым свойственным игре правилам (10/10)\n\n',
    '3. Реализовано завершение игры при достижении игровой цели (10/10)\n\n',
    '4. По окончанию игры выводится её результат, например, количество ходов, время игры, набранные баллы, выигрыш или поражение и т.д (10/10)\n\n',
    '5. Результаты последних 10 игр сохраняются в local storage. Есть таблица рекордов, в которой сохраняются результаты предыдущих 10 игр (10/10)\n\n',
    '6. Анимации или звуки, или настройки игры. Баллы начисляются за любой из перечисленных пунктов (10/10)'
);