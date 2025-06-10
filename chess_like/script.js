let gridSize = 8; //en cells
let cellSize = 90 / gridSize; // en % screen
let pieceSize = 75 / gridSize; // en % screen

let gameMode = "local";
let playerColor = "white";
let playerTurn = "white";

let symbolDB = [
  " ",
  "♔",
  "♕",
  "♖",
  "♗",
  "♘",
  "♙",
  "♚",
  "♛",
  "♜",
  "♝",
  "♞",
  "♟",
];

let circleDB = [" ", "circle.png"];

let blackColor = "rgb(151, 133, 133)";
let whiteColor = "rgb(238, 238, 238)";

let pieces = []; // ♔ ♕ ♖ <== divs
let piecesMatrix = []; // 0 1 2 3 <== id
let circlesMatrix = []; // doable Circles

let selectedPiece = {};

//#region setup
//setup
for (let y = 0; y < gridSize; y++) {
  pieces[y] = [];
  piecesMatrix[y] = [];
  circlesMatrix[y] = [];
  for (let x = 0; x < gridSize; x++) {
    piecesMatrix[y][x] = 0;
    circlesMatrix[y][x] = 0;
    pieces[y][x] = createPiece(y, x);
  }
}

function createPiece(y, x) {
  //div
  var newDiv = document.createElement("div");
  newDiv.classList.add("piece");

  // Remplacer le TextNode par un span
  let t = document.createElement("span");
  t.textContent = " ";
  newDiv.appendChild(t);

  t.style.fontSize = pieceSize + "vh";

  //circle
  let circle = document.createElement("img");
  newDiv.appendChild(circle);

  circle.style.width = cellSize + "vh";
  circle.style.height = cellSize + "vh";

  newDiv.onclick = function () {
    selectPiece(y, x);
  };

  newDiv.style.width = cellSize + "vh";
  newDiv.style.height = cellSize + "vh";

  //  add to DOM
  var currentDiv = document.getElementById("div1");
  currentDiv.appendChild(newDiv);
  currentDiv.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}vh)`;

  return newDiv;
}
//#endregion

function update() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // symbols
      pieces[y][x].children[0].textContent = symbolDB[piecesMatrix[y][x]];

      // square getColor
      if ((x + y) % 2 == 0) {
        pieces[y][x].style.backgroundColor = whiteColor;
      } else {
        pieces[y][x].style.backgroundColor = blackColor;
      }

      if (selectedPiece.x == x && selectedPiece.y == y) {
        pieces[y][x].style.backgroundColor = "rgb(255, 8, 8)";
      }

      // circle
      pieces[y][x].childNodes[1].src = circleDB[circlesMatrix[y][x]];
    }
  }
}

function flip(enable) {
  var currentDiv = document.getElementById("div1");

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (enable) {
        currentDiv.insertBefore(pieces[y][x], currentDiv.children[0]);
      } else {
        currentDiv.appendChild(pieces[y][x]);
      }
    }
  }
}

function selectPiece(y, x) {
  if (Object.keys(selectedPiece).length !== 0) {
    //selectedPiece n'est pas null ?
    let id = piecesMatrix[selectedPiece.y][selectedPiece.x];

    if (circlesMatrix[y][x] != 0) {
      //le joueur deplace une piece
      piecesMatrix[selectedPiece.y][selectedPiece.x] = 0;
      piecesMatrix[y][x] = id;

      //promotion de pion
      //white
      if (id == 6 && y == 0) {
        piecesMatrix[y][x] = 2;
      }
      //black
      if (id == 12 && y == 7) {
        piecesMatrix[y][x] = 8;
      }

      //passe à l'autre joueur
      if (gameMode == "local") {
        if (getColor(id) == "white") {
          playerColor = "black";
          flip(true);
        } else {
          playerColor = "white";
          flip(false);
        }
      }
    }

    resetCircle();
    selectedPiece = {};
    update();
    return;
  }

  if (piecesMatrix[y][x] != 0 && getColor(piecesMatrix[y][x]) == playerColor) {
    // la piece selectionné est alliee
    selectedPiece = { x: x, y: y };

    resetCircle();

    //tower
    if (piecesMatrix[y][x] == 3 || piecesMatrix[y][x] == 9) {
      towerShowCircles(y, x, 1);
      towerShowCircles(y, x, -1);
    }
    //bishop
    if (piecesMatrix[y][x] == 4 || piecesMatrix[y][x] == 10) {
      bishopShowCircles(y, x, 1);
      bishopShowCircles(y, x, -1);
    }
    //queen
    if (piecesMatrix[y][x] == 2 || piecesMatrix[y][x] == 8) {
      queenShowCircles(y, x, 1);
      queenShowCircles(y, x, -1);
    }
    //knight
    if (piecesMatrix[y][x] == 5 || piecesMatrix[y][x] == 11) {
      knightShowCircles(y, x);
    }
    //king
    if (piecesMatrix[y][x] == 1 || piecesMatrix[y][x] == 7) {
      kingShowCircles(y, x);
    }
    //pawn
    if (piecesMatrix[y][x] == 6 || piecesMatrix[y][x] == 12) {
      pawnShowCircles(y, x);
    }

    update();
  } else {
    selectedPiece = {};
    update();
  }
}

function resetCircle() {
  for (let y = 0; y < gridSize; y++) {
    circlesMatrix[y] = [];
    for (let x = 0; x < gridSize; x++) {
      circlesMatrix[y][x] = 0;
    }
  }
}

function getColor(id) {
  if (id == 0) {
    return "empty";
  }
  if (id <= 6) {
    return "white";
  } else {
    return "black";
  }
}

function towerShowCircles(y, x, dir) {
  let id = piecesMatrix[y][x];
  let color = getColor(id);

  //y
  for (let i = 0; i < gridSize; i++) {
    let ny = y + i * dir;

    if (ny == y) continue; // case de depart

    if (ny < 0 || ny >= gridSize) break; // Vérifie que ny est dans la grille

    if (piecesMatrix[ny][x] == 0) {
      //pas de piece
      circlesMatrix[ny][x] = 1;
    } else if (getColor(piecesMatrix[ny][x]) != color) {
      //piece adverse
      circlesMatrix[ny][x] = 1;
      break;
    } else {
      //piece alliée
      circlesMatrix[ny][x] = 0;
      break;
    }
  }

  //x
  for (let i = 0; i < gridSize; i++) {
    let nx = x + i * dir;

    if (nx == x) continue; // case de depart

    if (nx < 0 || nx >= gridSize) break; // Vérifie que nx est dans la grille

    if (piecesMatrix[y][nx] == 0) {
      //pas de piece
      circlesMatrix[y][nx] = 1;
    } else if (getColor(piecesMatrix[y][nx]) != color) {
      //piece adverse
      circlesMatrix[y][nx] = 1;
      break;
    } else {
      //piece alliée
      circlesMatrix[y][nx] = 0;
      break;
    }
  }
}

function bishopShowCircles(y, x, dir) {
  let id = piecesMatrix[y][x];
  let color = getColor(id);

  //→↓
  for (let i = 0; i < gridSize; i++) {
    let ny = y + i * dir;
    let nx = x + i * dir;

    if (ny == y) continue; // case de depart

    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) break; // Vérifie que nx et ny sont dans la grille

    if (piecesMatrix[ny][nx] == 0) {
      //pas de piece
      circlesMatrix[ny][nx] = 1;
    } else if (getColor(piecesMatrix[ny][nx]) != color) {
      //piece adverse
      circlesMatrix[ny][nx] = 1;
      break;
    } else {
      //piece alliée
      circlesMatrix[ny][nx] = 0;
      break;
    }
  }

  //→↑
  for (let i = 0; i < gridSize; i++) {
    let ny = y - i * dir;
    let nx = x + i * dir;

    if (ny == y) continue; // case de depart

    if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) break; // Vérifie que nx et ny sont dans la grille

    if (piecesMatrix[ny][nx] == 0) {
      //pas de piece
      circlesMatrix[ny][nx] = 1;
    } else if (getColor(piecesMatrix[ny][nx]) != color) {
      //piece adverse
      circlesMatrix[ny][nx] = 1;
      break;
    } else {
      //piece alliée
      circlesMatrix[ny][nx] = 0;
      break;
    }
  }
}

function queenShowCircles(y, x, dir) {
  towerShowCircles(y, x, dir);
  bishopShowCircles(y, x, dir);
}

function knightShowCircles(y, x) {
  let id = piecesMatrix[y][x];
  let color = getColor(id);

  for (let i = -2; i < 3; i++) {
    for (let j = -2; j < 3; j++) {
      if (y + i < 0 || y + i >= gridSize || x + j < 0 || x + j >= gridSize)
        continue; // Vérifie que nx et ny sont dans la grille

      //check patern and color
      if (
        Math.abs(i) + Math.abs(j) == 3 &&
        getColor(piecesMatrix[y + i][x + j]) != color
      ) {
        circlesMatrix[y + i][x + j] = 1;
      }
    }
  }
}

function kingShowCircles(y, x) {
  let id = piecesMatrix[y][x];
  let color = getColor(id);

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (y + i < 0 || y + i >= gridSize || x + j < 0 || x + j >= gridSize)
        continue; // Vérifie que nx et ny sont dans la grille

      //check color
      if (getColor(piecesMatrix[y + i][x + j]) != color) {
        circlesMatrix[y + i][x + j] = 1;
      }
    }
  }
}

function pawnShowCircles(y, x) {
  let id = piecesMatrix[y][x];
  let color = getColor(id);

  let dir = 0;
  if (color == "white") dir = -1;
  else dir = 1;

  // avancer
  if (piecesMatrix[y + dir][x] == 0) {
    //pas de piece
    circlesMatrix[y + dir][x] = 1;
  } else {
    //il y a une piece
    circlesMatrix[y + dir][x] = 0;
  }

  //start move
  let wCond = y == 6 && color == "white";
  let bCond = y == 1 && color == "black";
  if (bCond || wCond) {
    if (piecesMatrix[y + 2 * dir][x] == 0) {
      //pas de piece
      circlesMatrix[y + 2 * dir][x] = 1;
    } else {
      //il y a une piece
      circlesMatrix[y + 2 * dir][x] = 0;
    }
  }

  // prendre en diagonale
  for (let i = -1; i < 2; i = i + 2) {
    if (
      getColor(piecesMatrix[y + dir][x + i]) != color &&
      getColor(piecesMatrix[y + dir][x + i]) != "empty"
    ) {
      //piece adverse
      circlesMatrix[y + dir][x + i] = 1;
    }
  }
}

function inChess(color) {
  let kingX;
  let kingY;

  let colorDif = 0;
  if (color == "black") {
    colorDif = 6;
  }

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (piecesMatrix[y][x] == 1 + colorDif) {
        kingX = x;
        kingY = y;
      }
    }
  }

  resetCircle();
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      //tower
      if (piecesMatrix[y][x] == 9 - colorDif) {
        towerShowCircles(y, x, 1);
        towerShowCircles(y, x, -1);
      }
      //bishop
      if (piecesMatrix[y][x] == 10 - colorDif) {
        bishopShowCircles(y, x, 1);
        bishopShowCircles(y, x, -1);
      }
      //queen
      if (piecesMatrix[y][x] == 8 - colorDif) {
        queenShowCircles(y, x, 1);
        queenShowCircles(y, x, -1);
      }
      //knight
      if (piecesMatrix[y][x] == 11 - colorDif) {
        knightShowCircles(y, x);
      }
      //king
      if (piecesMatrix[y][x] == 7 - colorDif) {
        kingShowCircles(y, x);
      }
      //pawn
      if (piecesMatrix[y][x] == 12 - colorDif) {
        pawnShowCircles(y, x);
      }
    }
  }

  if (circlesMatrix[kingY][kingX] == 1) {
    console.log("echec");
  }

  update();
}

//noir
piecesMatrix[0][0] = 9;
piecesMatrix[0][1] = 11;
piecesMatrix[0][2] = 10;
piecesMatrix[0][3] = 8;
piecesMatrix[0][4] = 7;
piecesMatrix[0][5] = 10;
piecesMatrix[0][6] = 11;
piecesMatrix[0][7] = 9;

piecesMatrix[1][0] = 12;
piecesMatrix[1][1] = 12;
piecesMatrix[1][2] = 12;
piecesMatrix[1][3] = 12;
piecesMatrix[1][4] = 12;
piecesMatrix[1][5] = 12;
piecesMatrix[1][6] = 12;
piecesMatrix[1][7] = 12;

//blanc
piecesMatrix[7][0] = 9 - 6;
piecesMatrix[7][1] = 11 - 6;
piecesMatrix[7][2] = 10 - 6;
piecesMatrix[7][3] = 8 - 6;
piecesMatrix[7][4] = 7 - 6;
piecesMatrix[7][5] = 10 - 6;
piecesMatrix[7][6] = 11 - 6;
piecesMatrix[7][7] = 9 - 6;

piecesMatrix[6][0] = 6;
piecesMatrix[6][1] = 6;
piecesMatrix[6][2] = 6;
piecesMatrix[6][3] = 6;
piecesMatrix[6][4] = 6;
piecesMatrix[6][5] = 6;
piecesMatrix[6][6] = 6;
piecesMatrix[6][7] = 6;

update();
