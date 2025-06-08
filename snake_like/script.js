let gridSize = 16;
let celluleSize = 50;
const startSnake = { x: 0, y: 5, dir: { x: 1, y: 0 }, length: 3 };
let snake = startSnake;
let path = [];
let fruit = {};

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.stroke();

setInterval(loop, 1000 / 7);
placeFruit();

function drawRect(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * size, y * size, size, size);
}

function loop() {
  //check if alive
  if (snake.x > gridSize || snake.x < 0 || snake.y > gridSize || snake.y < 0) {
    // snake is (right || left || down || up) of canva
    restart();
  }

  if (path.length >= snake.length)
    for (let i = 1; i < snake.length; i++) {
      if (
        path[path.length - 1 - i].x == snake.x &&
        path[path.length - 1 - i].y == snake.y
      ) {
        // snake pos == path[i] pos
        restart();
      }
    }

  //check if fruit
  if (snake.x == fruit.x && snake.y == fruit.y) {
    placeFruit();
    snake.length++;
  }

  //clear
  ctx.clearRect(
    snake.x * celluleSize,
    snake.y * celluleSize,
    celluleSize,
    celluleSize
  );

  if (path.length >= snake.length) {
    for (let i = 0; i < path.length; i++) {
      ctx.clearRect(
        path[path.length - 1 - i].x * celluleSize,
        path[path.length - 1 - i].y * celluleSize,
        celluleSize,
        celluleSize
      );
    }
  }

  // move
  snake.x += snake.dir.x;
  snake.y += snake.dir.y;
  drawRect(snake.x, snake.y, celluleSize, "green");

  //tail
  path.push({ x: snake.x, y: snake.y });

  if (path.length >= snake.length) {
    for (let i = 0; i < snake.length; i++) {
      drawRect(
        path[path.length - 1 - i].x,
        path[path.length - 1 - i].y,
        celluleSize,
        "green"
      );
    }
  }

  //fruit
  drawRect(fruit.x, fruit.y, celluleSize, "red");
}

function restart() {
  snake = { x: 0, y: 5, dir: { x: 1, y: 0 }, length: 3 };
  path = [];
  ctx.clearRect(0, 0, celluleSize * gridSize, celluleSize * gridSize);
  placeFruit();
  alert("restart" + snake.x);
}

function placeFruit() {
  fruit = { x: getRandomInt(16), y: getRandomInt(16) };
}

document.addEventListener(
  "keydown",
  (event) => {
    let code = event.code;
    //W
    if (code == "KeyW") {
      if (snake.dir.y != 1) {
        snake.dir = { x: 0, y: -1 };
      }
    }

    //A
    if (code == "KeyA") {
      if (snake.dir.x != 1) {
        snake.dir = { x: -1, y: 0 };
      }
    }

    //S
    if (code == "KeyS") {
      if (snake.dir.y != -1) {
        snake.dir = { x: 0, y: 1 };
      }
    }

    //D
    if (code == "KeyD") {
      if (snake.dir.x != -1) {
        snake.dir = { x: 1, y: 0 };
      }
    }
  },
  false
);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
