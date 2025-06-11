let gridSize = 64;
let celluleSize = 12;

let pause = true;
let intervalId; // Variable to store the interval ID

// generation counter
let generation = 0;
const genText = document.getElementById("gen-text");

// tick rate
const tickRateInput = document.getElementById("tick-rate");
let tickRate = tickRateInput.value;

tickRateInput.addEventListener("input", function () {
  tickRate = tickRateInput.value;
  if (!pause) {
    clearInterval(intervalId);
    intervalId = setInterval(loop, 1000 / tickRate);
  }
});

// create canvas
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.moveTo(0, 0);
ctx.stroke();

let grid = new Array(gridSize); // ligne array
for (let i = 0; i < gridSize; i++) {
  grid[i] = new Array(gridSize); // cellule aray
}
// grid[2][3] => cellule coordinates 2 3

// setup each cellule to state 0
for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    grid[i][j] = 0;
  }
}

function randomStart() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = Math.round(Math.random());
    }
  }
  updateCanvas();
}

// update each cellule state in canvas
function updateCanvas() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] == 1) {
        ctx.fillStyle = "rgb(197, 195, 195)";
      } else {
        ctx.fillStyle = "rgba(61, 60, 60, 0.93)";
      }

      ctx.beginPath();
      ctx.rect(i * celluleSize, j * celluleSize, celluleSize, celluleSize);
      ctx.fill();
    }
  }
}

function loop() {
  let celluleToDie = [];
  let celluleToBorn = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let neighbors = getNeighbor(i, j);
      let nAlive = countValueInArray(neighbors, 1);
      if (grid[i][j] == 0) {
        if (nAlive == 3) {
          celluleToBorn.push([i, j]);
        }
      } else {
        if (nAlive < 2 || nAlive > 3) {
          celluleToDie.push([i, j]);
        }
      }
    }
  }

  for (let i = 0; i < celluleToDie.length; i++) {
    let x = celluleToDie[i][0];
    let y = celluleToDie[i][1];
    grid[x][y] = 0;
    console.log("cellule", x, y, "is dead");
  }
  for (let i = 0; i < celluleToBorn.length; i++) {
    let x = celluleToBorn[i][0];
    let y = celluleToBorn[i][1];
    grid[x][y] = 1;
    console.log("cellule", x, y, "is born");
  }

  updateCanvas();
  generation++;
  genText.innerText = "generation : " + generation;
  console.log("loop");
}

//return 8 neighbor of a cellule[x,y]
function getNeighbor(x, y) {
  let neighbor = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the cell itself
      let newX = x + i;
      let newY = y + j;
      if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        neighbor.push(grid[newX][newY]);
      } else {
        neighbor.push(0); // if out-of-bounds cells as dead
      }
    }
  }
  return neighbor;
}

//return the number of value in a 1D array
function countValueInArray(array, value) {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == value) {
      count++;
    }
  }
  return count;
}

function pauseSwap() {
  pause = !pause;
  if (pause) {
    clearInterval(intervalId); // Use the interval ID to clear the interval
  } else {
    intervalId = setInterval(loop, 1000 / tickRate); // Restart the interval
  }
}

function clearGrid() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = 0;
    }
  }
  updateCanvas();
  generation = 0;
  genText.innerText = "generation : " + generation;
}

c.addEventListener(
  "click",
  function (evt) {
    var mousePos = getMousePos(c, evt);
    let x = Math.floor(mousePos.x / celluleSize);
    let y = Math.floor(mousePos.y / celluleSize);
    grid[x][y] = !grid[x][y];
    updateCanvas();
  },
  false
);

//Get Mouse Position
function getMousePos(c, evt) {
  var rect = c.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
