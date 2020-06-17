var grid = [];
var colorGrid = {};

var gridX = 10;
var gridY = 20;

var w, h;
var screenX, screenY;
var boarderX;

var currentPiece;

const E = 0;
const F = 1;

var nextPieces = [];
var piecesToSpawn = [];
var heldPiece = undefined;

var linesCleared = 0;
var score = 0;
var level = 0;

var scoreAdditions = [40, 100, 300, 1200];
var scoreDisplay;

var pause = false;
var gameOver = false;

function setup() {
  createCanvas((windowHeight - 55) / 1.2, windowHeight - 55);
  screenY = height;
  screenX = screenY / 2;
  boarderX = width - screenX;

  w = screenX / gridX;
  h = screenY / gridY;

  piecesToSpawn = [...pieces];
  shuffle(piecesToSpawn, true);

  createGrid();
  currentPiece = new Piece(choosePiece());

  scoreDisplay = createP();
}

function restart() {
  heldPiece = undefined;
  pieceSwitched = false;

  linesCleared = 0;
  score = 0;
  level = 0;

  createGrid();
  colorGrid = {};
  piecesToSpawn = [...pieces];
  shuffle(piecesToSpawn, true);

  currentPiece = new Piece(choosePiece());
  gameOver = false;
}

function createGrid() {
  grid = [];

  for (let i = 0; i < gridX; i++) {
    grid[i] = [];
    for (let j = 0; j < gridY; j++) {
      grid[i][j] = E;
    }
  }

  nextPieces = [];
  for (let i = 0; i < 3; i++) {
    nextPieces.push(choosePiece());
  }
}

function choosePiece(){
  if (piecesToSpawn.length == 0){
    piecesToSpawn = [...pieces];
    shuffle(piecesToSpawn, true);
  }

  let chosen = piecesToSpawn[0];
  piecesToSpawn.splice(0, 1);

  
  return chosen;
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

function addToScore(numLines) {
  linesCleared += numLines;
  score += scoreAdditions[numLines - 1] * (level + 1);

  if (linesCleared >= 10) {
    linesCleared -= 10;
    level += 1;

    if (fallSpeed > 12) {
      fallSpeed -= 1;
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
      for (let j = i + 1; j < linesToWipe.length; j++) {
        linesToWipe[j] += 1;
      }
    }
  }
}

function showNextPieces() {
  stroke(180);

  let x = screenX + 50;
  let y = 80;
  for (let p of nextPieces) {
    let col = colors[getIndex(p)];
    fill(col[0], col[1], col[2]);

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

  if (heldPiece) {
    let col = colors[getIndex(heldPiece)];
    fill(col[0], col[1], col[2]);

    y += 80;
    for (let i = 0; i < heldPiece.length; i++) {
      for (let j = 0; j < heldPiece[i].length; j++) {
        if (heldPiece[i][j] == 1) {
          rect(j * w + x, i * h + y, w, h);
        }
      }
    }
    noFill();
    rect(screenX + 25, y - 20, (4 * w), h * heldPiece.length + 40);
  }
}

function textBox(msg) {
  textSize(w);
  let txtWidth = textWidth(msg);
  textAlign(CENTER, CENTER);

  stroke(255);
  fill(0);
  rect((width / 2) - ((txtWidth / 2) + 25), (height / 2) - w, txtWidth + 50, w * 2);

  fill(255);
  text(msg, width / 2, height / 2);
}

function drawGrid() {
  stroke(180)
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == E) {
        fill(50);
      } else {
        fill(colorGrid[[i, j]][0], colorGrid[[i, j]][1], colorGrid[[i, j]][2]);
      }

      rect(i * w, j * h, w, h);
    }
  }
}

function draw() {
  background(65);

  drawGrid();
  showNextPieces();

  if (!gameOver) {
    if (!pause) {
      currentPiece.update();
    } else {
      currentPiece.show();
      textBox('press p to unpause');
    }
  } else {
    textBox('Game over, press r to restart');
  }

  scoreDisplay.html("Score: " + str(score));
}
