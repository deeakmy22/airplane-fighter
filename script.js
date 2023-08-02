const startButton = document.getElementById("start-button");
const currentTime = document.getElementById("time");
const killed = document.getElementById("killed");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const img = document.getElementById("rocket");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const finishTime = document.getElementById("finish-time");
const enemiesAvoided = document.getElementById("enemies-avoided");
const enemiesShots = document.getElementById("enemies-shots");
const restartButton = document.getElementById("restart-button");

let rocket = {
  x: canvas.width / 2,
  y: canvas.height - 5,
  width: 5,
  height: 5,
  dx: 5,
};

let enemies = [];
let countEnemies = 0;
let enemiesKilled = 0;
let bullets = [];
let isGameOver = false;

// I use this function to reload the game when the restart game button is clicked
const restartGame = () => {
  location.reload();
};

// I used this function to stop the game and time, to show the text Game Over and the score.
const gameOver = () => {
  isGameOver = true;
  clearInterval(intervalID);
  gameOverArea.style.display = "block";
  gameOverText.innerHTML = "Game Over!";
  clearInterval(stopCreateEnemies);
  clearInterval(stopGame);
  currentTime.style.display = "none";
  killed.style.display = "none";
  finishTime.innerHTML = "Score: " + minutes + ": " + seconds;
  enemiesAvoided.innerHTML = "Enemies avoided: " + countEnemies;
  enemiesShots.innerHTML = "Enemies killed: " + enemiesKilled;
};

// In this function I draw the rocket in the canvas

const drawRocket = () => {
  context.fillStyle = "red";
  context.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
};

// In this function I draw the enemies in the canvas

const drawEnemies = () => {
  context.fillStyle = "yellow";
  for (let i = 0; i < enemies.length; i++) {
    context.fillRect(
      enemies[i].x,
      enemies[i].y,
      enemies[i].width,
      enemies[i].height
    );
  }
};

// In this function I draw the bullets in the canvas

const drawBullets = () => {
  context.fillStyle = "black";
  for (let i = 0; i < bullets.length; i++) {
    context.fillRect(
      bullets[i].x,
      bullets[i].y,
      bullets[i].width,
      bullets[i].height
    );
  }
};

// In this function I acces all the function were I draw objects

const drawElemCanvas = () => {
  drawRocket();
  drawEnemies();
  drawBullets();
};

const bulletSpeed = 10;

// In this function I redraw the buletts and when is out from the canvas I remove the bullet

const updateBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bulletSpeed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
};

// In this function I redraw the enemy and when is out the canvas I remove the enemy

const updateEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemies[i].dy;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      i--;
      ++countEnemies;
    }
  }
};

// I use this function to acces the updates function

const updates = () => {
  updateBullets();
  updateEnemies();
};

// With this function I acces function gameOver when the rocket hit an enemy

const avoidEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    if (
      enemies[i].x < rocket.x + rocket.width &&
      enemies[i].x + enemies[i].width > rocket.x &&
      enemies[i].y < rocket.y + rocket.height &&
      enemies[i].y + enemies[i].height > rocket.y
    ) {
      gameOver();
    }
  }
};

// With this function I shot the enemies and when I hit an enemy I remove the bullet and the enemy

const shotEnemy = () => {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      if (
        enemies[i].x < bullets[j].x + bullets[j].width &&
        enemies[i].x + enemies[i].width > bullets[j].x &&
        enemies[i].y < bullets[j].y + bullets[j].height &&
        enemies[i].y + enemies[i].height > bullets[j].y
      ) {
        // Remove bullet and enemy
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        i--;
        j--;
        ++enemiesKilled;
      }
    }
  }
};

// In this function I show the number of enemies killed each time I shot an enemy.

const showEnemiesShots = () => {
  killed.innerHTML = "Enemies killed: " + enemiesKilled;
};

// This is a loop function where I acces the functions I will need and I clear the canvas after every move

const gameLoop = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawElemCanvas();
  updates();
  avoidEnemies();
  shotEnemy();
  showEnemiesShots();
};

// With this function I will move the rocket to the border at the canvas

const moveRocket = (dx, dy) => {
  let newX = rocket.x + dx;
  let newY = rocket.y + dy;
  if (newX < 0 || newX + rocket.width > canvas.width) {
    newX = rocket.x;
  }
  if (newY < 0 || newY + rocket.height > canvas.height) {
    newY = rocket.y;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  rocket.x = newX;
  rocket.y = newY;
  context.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);
};

// With this function create the bullets

const shotABullet = () => {
  let bullet = {
    x: rocket.x + rocket.width / 2,
    y: rocket.y,
    width: 5,
    height: 5,
  };
  bullets.push(bullet);
};

const createEnemy = () => {
  let enemy = {
    x: Math.floor(Math.random() * (canvas.width - 10)),
    y: -10,
    width: 10,
    height: 10,
    color: "yellow",
    dy: 2,
  };
  context.fillStyle = enemy.color;
  enemies.push(enemy);
};

let intervalID;
let time = 0;
let minutes, seconds;

const increaseTime = () => {
  time += 10;
  minutes = Math.floor(time / 1000 / 60);
  seconds = Math.floor((time / 1000) % 60);
  currentTime.innerHTML = "Time: " + minutes + ": " + seconds;
};

let stopGame;
let stopCreateEnemies;

// The startGame function makes the start button disappear, the game board appear, starts the timer with function increaseTime,
// starts creating enemies with function createEnemy and acces game loop function at a setted time.

const startGame = () => {
  startButton.style.display = "none";
  canvas.classList.add("canvas");
  intervalID = setInterval(increaseTime, 10);
  stopCreateEnemies = setInterval(createEnemy, 2000);
  stopGame = setInterval(gameLoop, 50);
};

// In this function I seted the direction of the rocket when I press an arrow key and to shot when the spacebar is presed.

const onKeyDown = (event) => {
  switch (event.key) {
    case "ArrowLeft":
      moveRocket(-5, 0);
      break;
    case "ArrowUp":
      moveRocket(0, -5);
      break;
    case "ArrowRight":
      moveRocket(5, 0);
      break;
    case "ArrowDown":
      moveRocket(0, 5);
      break;
    case " ":
      shotABullet();
      break;
  }
};

document.addEventListener("keydown", onKeyDown);
