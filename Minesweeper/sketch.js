var screenX;
var screenY;
var firstClick = true;
var leftReleased = true;
var win = false;
var dead = false;

var gridX = 40;
var gridY = 30;
var boxSize = 23;
var bombChance = 0.12;
var numEmpty = 0;

var resetTimer = 0;

var grid = [];
const E = 0;
const B = 1;

var adjacentNumber = [];
var adjacentSpaces = [];
var flags = [];
var revealed = [];

var instructions = [
  "click to reveal a tile",
  "press 'f' to flag a tile"
];
var instructionParagraphs = [];

function setup() {
  screenX = gridX * boxSize;
  screenY = gridY * boxSize;
  createCanvas(screenX, screenY);

  setColors();

  createGrid();
  markadjacentNumber();
  getNumEmpty();

  if (instructionParagraphs.length <= 0){
    for (let i = 0; i < instructions.length; i++){
      instructionParagraphs.push(createP());
    }
  }
}

function reset() {
  adjacentNumber = [];
  adjacentSpaces = [];
  flags = [];
  revealed = [];

  numEmpty = 0;
  flashTimer = 0;
  resetTimer = 0;

  firstClick = true;
  win = false;
  dead = false;

  createGrid();
  markadjacentNumber();
  getNumEmpty();
}

function createGrid() {
  let rand;
  for (var x = 0; x < gridX; x++) {
    grid[x] = [];
    adjacentNumber[x] = [];
    revealed[x] = [];
    for (var y = 0; y < gridY; y++) {
      adjacentNumber[x][y] = 0;
      revealed[x][y] = false;

      rand = random();
      if (rand <= bombChance) {
        grid[x][y] = B;
      } else {
        grid[x][y] = E;
      }
    }
  }
}

function interactions() {
  if (mouseX < screenX && mouseY < screenY) {
    let boxX = int(mouseX / boxSize);
    let boxY = int(mouseY / boxSize);
    if (mouseButton == LEFT) {
      if (!firstClick || grid[boxX][boxY] != B) {
        firstClick = false;
        if (!revealed[boxX][boxY]) {
          revealed[boxX][boxY] = true;
          if (grid[boxX][boxY] != B) {
            floodReveal(boxX, boxY);
          }
          if (grid[boxX][boxY] == B) {
            dead = true;
          }
        }
      }
    }
    if (mouseButton == RIGHT) {
      if (leftReleased) {
        leftReleased = false;
        markFlag(boxX, boxY)
      }
    }
  }
  checkNumRevealed();
}

function keyTyped() {
  if (mouseX < screenX && mouseY < screenY) {
    let boxX = int(mouseX / boxSize);
    let boxY = int(mouseY / boxSize);
    markFlag(boxX, boxY)
  }
}

function markFlag(x, y) {
  let flagNum = -1;

  for (var i = 0; i < flags.length; i++) {
    if (x == flags[i][0] && y == flags[i][1]) {
      flagNum = i;
    }
  }

  if (flagNum > -1) {
    flags.splice(flagNum, 1);
  } else {
    append(flags, [x, y]);
  }
}

function floodReveal(xPos, yPos) {
  if (adjacentNumber[xPos][yPos] == 0) {
    append(adjacentSpaces, [xPos, yPos]);
    while (adjacentSpaces.length != 0) {
      let surroundings = getAdjacentList(adjacentSpaces[0][0], adjacentSpaces[0][1]);

      for (var i = 0; i < surroundings.length; i++) {
        let x = surroundings[i][0];
        let y = surroundings[i][1];

        if (adjacentNumber[x][y] == 0 && !revealed[x][y]) {
          append(adjacentSpaces, [x, y]);
        }
        revealed[x][y] = true;
      }
      adjacentSpaces.shift();
    }
  }
}

function drawGrid() {
  for (var x = 0; x < gridX; x++) {
    for (var y = 0; y < gridY; y++) {
      stroke(0);
      fill(cNonRevealed);

      if (revealed[x][y] || dead || win) {
        if (grid[x][y] == B) {
          fill(cBomb);
        }
      }

      if (revealed[x][y]) {
        if (grid[x][y] == E) {
          stroke(0);
          fill(cRevealedEmpty);
        }
      }
      rect(x * boxSize, y * boxSize, boxSize, boxSize);
      if (adjacentNumber[x][y] > 0 && revealed[x][y]) {
        textSize(boxSize - 3);
        textAlign(LEFT);
        fill(cNumbers[adjacentNumber[x][y] - 1]);
        text(adjacentNumber[x][y].toString(), x * boxSize + boxSize / 4, y * boxSize + (3 * boxSize / 4));
      }
    }
  }

  for (var i = 0; i < flags.length; i++) {
    let x = flags[i][0];
    let y = flags[i][1];
    if (!revealed[x][y]) {
      stroke(0);
      fill(cFlag);
      rect(x * boxSize, y * boxSize, boxSize, boxSize)
    }
  }
}

function winScreen() {
  resetTimer += 1;

  stroke(0);
  fill(124, 252, 0);
  textAlign(CENTER);
  textSize(50);
  text("YOU WIN!", screenX / 2, screenY / 2);

  if (resetTimer >= 250) {
    reset();
  }
}

function deathScreen() {
  resetTimer += 1;

  stroke(0);
  fill(107, 142, 35);

  textAlign(CENTER);
  textSize(50);
  text("YOU LOSE!", screenX / 2, screenY / 2);

  if (resetTimer >= 250) {
    reset();
  }
}

function draw() {
  drawGrid();
  if (!win && !dead && mouseIsPressed) {
    interactions();
  } else if (win) {
    winScreen();
  } else if (dead) {
    deathScreen();
  }

  if (!mouseIsPressed) {
    leftReleased = true;
  }

  for (let i = 0; i < instructionParagraphs.length; i++){
    instructionParagraphs[i].html(instructions[i]);
  }
}
