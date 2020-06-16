var grid = [];
var gX = 50;
var gY = 50;

var ruleSelect;
var fpsSlider;
var ruleInput;
var randomCheckbox;

var s;
var ruleset;

var running = false;
var randomStart = false;

const D = 0; //dead
const A = 1; //alive
const M = 2; //dying (for Brian's Brain)

function setup() {
  if (windowWidth / gX < windowHeight / gY) {
    s = (windowWidth - 5) / gX;
  } else {
    s = (windowHeight - 5) / gY;
  }
  createCanvas(s * gX, s * gY);

  ruleset = ECA;
  createGrid();

  fpsSlider = createSlider(1, 30, 5, 1);

  ruleSelect = createSelect();
  ruleSelect.option("Elementary Celular Automata (input to change rule)");
  ruleSelect.option("Game Of Life");
  ruleSelect.option("Brian's Brain");
  ruleSelect.changed(changeRuleset);

  ruleInput = createInput('');
  ruleInput.input(changeRuleNum);

  randomCheckbox = createCheckbox('random start', false);
  randomCheckbox.changed(changeRandom);
}

function reset() {
  createGrid();
  running = false;
}

function changeRuleset() {
  let selection = ruleSelect.value();
  if (selection == "Game Of Life") {
    ruleset = GOL;
  } else if (selection == "Brian's Brain") {
    ruleset = BB;
  } else {
    ruleset = ECA;
  }

  reset();
  mouseIsPressed = false;
}

function changeRandom() {
  randomStart = !randomStart;
  reset();
}

function createGrid() {
  let posStates = [A, D];
  if (ruleset == BB) {
    posStates.push(M);
  }

  grid = [];
  for (let i = 0; i < gX; i++) {
    grid[i] = [];
    for (let j = 0; j < gY; j++) {
      if (randomStart) {
        grid[i][j] = random(posStates);
      } else {
        grid[i][j] = D;
      }
    }
  }

  if (ruleset == ECA) {
    grid[Math.round(gX / 2)][0] = A;
    rules = getRules(ruleNum);
  }
}

function getNeighbors(cX, cY, simpleNeighbors = false) {
  let neighbors = [];
  if (!simpleNeighbors) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i != 0 || j != 0) {
          neighbors.push([cX + i, cY + j])
        }
      }
    }
  } else {
    for (let i = -1; i <= 1; i++) {
      neighbors.push([cX + i, cY - 1]);
    }
  }


  for (let c of neighbors) {
    if (!simpleNeighbors) {
      if (c[0] < 0) {
        c[0] = gX - 1;
      } else if (c[0] > gX - 1) {
        c[0] = 0;
      }
    }

    if (c[1] < 0) {
      c[1] = gY - 1;
    } else if (c[1] > gY - 1) {
      c[1] = 0;
    }
  }
  return neighbors;
}

function changeCells() {
  let gridCopy = [];
  let changed = false;

  let startRow = 0;
  if (ruleset == ECA) {
    startRow = 1;
  }

  for (let i = 0; i < grid.length; i++) {
    gridCopy[i] = [...grid[i]];
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = startRow; j < grid[i].length; j++) {
      grid[i][j] = ruleset(i, j, gridCopy);
      if (!changed) {
        if (grid[i][j] != gridCopy[i][j]) {
          changed = true;
        }
      }
    }
  }

  if (!changed) {
    running = false;
  }
}

function drawGrid() {
  stroke(100);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == A) {
        fill(255);
      } else if (grid[i][j] == M) {
        fill(0, 0, 255);
      } else {
        fill(0);
      }

      rect(i * s, j * s, s, s);
    }
  }
}

function draw() {
  background(180);

  if (running) {
    if (frameRate() != fpsSlider.value()) {
      frameRate(fpsSlider.value());
    }

    changeCells();
  } else {
    if (frameRate() != 60) {
      frameRate(60);
    }
    editCells();
  }

  drawGrid();
}

function editCells() {
  if (mouseIsPressed && !running) {
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
      let mX = int(mouseX / s);
      let mY = int(mouseY / s);
      if (ruleset == BB && keyIsDown(SHIFT)) {
        grid[mX][mY] = M
      } else {
        if (mouseButton == LEFT) {
          grid[mX][mY] = A;
        } else if (mouseButton == RIGHT) {
          grid[mX][mY] = D;

        } else if (ruleset == BB) {
          grid[mX][mY] = M;
        }
      }
    }
  }
}

function keyTyped() {
  if (key == 'p') {
    running = !running;
  }
  if (key == 'r') {
    reset();
  }
}
