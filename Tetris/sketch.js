var grid = [];
var gridX = 10;
var gridY = 20;

var w, h;
var screenX, screenY;
var boarderX;

var currentPiece;

const E = 0;
const F = 1;

var nextPieces = [];
var heldPiece = undefined;

function setup() {
  createCanvas((windowHeight - 5) / 1.2, windowHeight - 5);
  screenY = height;
  screenX = screenY / 2;
  boarderX = width - screenX;

  w = screenX / gridX;
  h = screenY / gridY;

  createGrid();
  currentPiece = new Piece(random(pieces));
}

function createGrid() {
  grid = [];

  for (let i = 0; i < gridX; i++) {
    grid[i] = [];
    for (let j = 0; j < gridY; j++) {
      grid[i][j] = E;
    }
  }
  for (let i = 0; i < 3; i++) {
    nextPieces.push(random(pieces));
  }
}

function deleteLine(ln) {
  for (let i = 0; i < grid.length; i++) {
    grid[i][ln] = E;
  }
}

function moveDown(ln) {
  for (let i = ln - 1; i >= 0; i--) {
    for (let j = 0; j < grid.length; j++) {
      grid[j][i + 1] = grid[j][i];
      grid[j][i] = 0;
    }
  }
}

function lineWipe() {
  let linesToWipe = [];

  for (let i = grid[0].length - 1; i >= 0; i--) {
    let full = true;
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] == E) {
        full = false;
      }
    }
    if (full) {
      linesToWipe.push(i);
    }
  }

  if (linesToWipe.length > 0) {
    linesToWipe.sort((a, b) => b - a);
    for (let i = 0; i < linesToWipe.length; i++) {
      deleteLine(linesToWipe[i]);
      moveDown(linesToWipe[i]);
      for (let j = i + 1; j < linesToWipe.length; j++){
        linesToWipe[j] += 1;
      }
    }
  }
}

function showNextPieces() {
  stroke(255);
  fill(255);

  let x = screenX + 50;
  let y = 80;
  for (let p of nextPieces) {
    for (let i = 0; i < p.length; i++) {
      for (let j = 0; j < p[i].length; j++) {
        if (p[i][j] == 1) {
          rect(j * w + x, i * h + y, w, h);
        }
      }
    }
    y += h * p.length + 20;
  }

  noFill();
  rect(screenX + 25, 55, (4 * w), y - 60);

  if (heldPiece){
    y += 80;
    fill(255);

    for (let i = 0; i < heldPiece.length; i++){
      for (let j = 0; j < heldPiece[i].length; j++){
        if (heldPiece[i][j] == 1) {
          rect(j * w + x, i * h + y, w, h);
        }
      }
    }
    noFill();
    rect(screenX + 25, y - 20, (4 * w), h * heldPiece.length + 40);
  }
}

function drawGrid() {
  stroke(180)
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == E) {
        fill(50);
      } else {
        fill(125, 125, 225);
      }

      rect(i * w, j * h, w, h);
    }
  }
}

function draw() {
  background(65);

  drawGrid();
  showNextPieces();

  currentPiece.update();
}
