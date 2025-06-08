let gridSize = 4; //en cells
let cellSize = 100; // en px
let canvasSize = gridSize * cellSize; // en px

//setup table
let cells = [];

for (let x = 0; x < gridSize; x++) {
  cells[x] = [];
  for (let y = 0; y < gridSize; y++) {
    cells[x][y] = createCell();
  }
}

//setup matrix
let colorsMatrix = [];

for (let x = 0; x < gridSize; x++) {
  colorsMatrix[x] = [];
  for (let y = 0; y < gridSize; y++) {
    colorsMatrix[x][y] = 0; // ou une autre valeur
  }
}

colorsMatrix[2][3] = 1;
update();
function update() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (colorsMatrix[x][y] == 1) {
        cells[x][y].style.color = "rgb(122, 24, 24)";
        console.log(cells[x][y]);
      }
    }
  }
}

function createCell() {
  var newDiv = document.createElement("div");
  newDiv.classList.add("cell");

  newDiv.style.width = cellSize + "px";
  newDiv.style.height = cellSize + "px";

  //  add to DOM
  var currentDiv = document.getElementById("div1");
  //   document.body.insertBefore(newDiv, currentDiv);
  currentDiv.appendChild(newDiv);
  currentDiv.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;

  return newDiv;
}
