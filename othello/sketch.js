var gridSize = 8;
var grid = [];

var posMoves = [];

const E = 0;
const B = 1;
const W = 2;

var w, h;

var turn = W;
var bs = 0;
var ws = 0;
var scoreP;

var done = false;

function setup() {
  createCanvas(670, 670);
  createGrid();

  w = width / gridSize;
  h = height / gridSize;

  scoreP = createP();

  getPosMoves();
  getScore();
}

function createGrid() {
  for (var i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (var j = 0; j < gridSize; j++) {
      grid[i][j] = E;
    }
  }
  grid[3][3] = B;
  grid[3][4] = W;
  grid[4][4] = B;
  grid[4][3] = W;
}

function drawGrid() {
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      stroke(0);
      fill(10, 108, 3);
      rect(i * w, j * h, w, h);
      if (grid[i][j] == B) {
        stroke(0);
        fill(0);
        ellipse(i * w + w / 2, j * h + h / 2, w - 7, h - 7);
      }
      if (grid[i][j] == W) {
        stroke(255);
        fill(255);
        ellipse(i * w + w / 2, j * h + h / 2, w - 7, h - 7);
      }
    }
  }

  push();
  noFill();
  for (let m of posMoves) {
    stroke(0);
    strokeWeight(2);
    ellipse(m[0] * w + w / 2, m[1] * h + h / 2, w - 7, h - 7);

    stroke(255, 0, 0);
    strokeWeight(5);
    point(m[0] * w + w / 2, m[1] * h + h / 2);
  }
  pop();

  if (!done) {
    if (turn == B) {
      stroke(0);
      fill(0);
    } else {
      stroke(255);
      fill(255);
    }
    ellipse(mouseX, mouseY, w - 7, h - 7);
  }
}

function mouseClicked() {
  if (mouseX < width && mouseX > 0) {
    if (mouseY < height && mouseY > 0) {
      placePiece(int(mouseX / w), int(mouseY / h));
    }
  }
}

function checkPiece(x, y, type) {
  let o;
  if (type == W) {
    o = B;
  } else {
    o = W;
  }

  if (grid[x][y] != E) {
    return false;
  }

  if (!checkFlips(x, y)) {
    return false;
  }

  if (x > 0) {
    if (grid[x - 1][y] == o) {
      return true;
    }
  }
  if (x < gridSize - 1) {
    if (grid[x + 1][y] == o) {
      return true;
    }
  }
  if (y > 0) {
    if (grid[x][y - 1] == o) {
      return true;
    }
  }
  if (y < gridSize - 1) {
    if (grid[x][y + 1] == o) {
      return true;
    }
  }

  return false;
}

function getPosMoves() {
  posMoves = [];
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      if (checkPiece(i, j, turn)) {
        posMoves.push([i, j]);
      }
    }
  }
}

function getScore() {
  bs = 0;
  ws = 0;
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      if (grid[i][j] == B) {
        ws += 1;
      }
      if (grid[i][j] == W) {
        bs += 1;
      }
    }
  }

  if (bs + ws >= gridSize * gridSize) {
    done = true;
  }
}

function draw() {
  background(10, 108, 3);
  drawGrid();

  if (!done) {
    scoreP.html("White Score: " + str(bs) + ", Black Score " + str(ws));
  } else {
    if (bs > ws) {
      scoreP.html("White Wins");
    } else {
      scoreP.html("Black Wins");
    }
  }
}
