var cols = 30;
var rows = 30;
var grid = [];

var w;
var h;

var curCell;
var stack = [];

var solve = false;
var instructions = ['click mouse to draw on maze, hold down any key while drawing to erase', 'press r to generate a new maze', 'press e to erase all', 'press enter to solve'];
var ps = [];

function setup() {
  createCanvas(windowHeight - 160, windowHeight - 160);
  w = (width - 1) / cols;
  h = (height - 1) / rows;

  createGrid();
  curCell = grid[0][rows - 1];
  stack.push(curCell);
  curCell.visited = true;

  cycle();
  startSolving();
  let thing;
  for (let instruction of instructions) {
    let thing = createP();
    ps.push(thing);
  }
}

function createGrid() {
  for (var i = 0; i < cols; i++) {
    grid[i] = [];
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new cell(i, j);
    }
  }
}

function drawGrid() {
  noStroke();
  fill(0, 255, 255);
  rect(start.x * w, start.y * h, w, h);
  rect(end.x * w, end.y * h, w, h);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }

  if (solve) {
    for (var i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(255, 0, 0));
    }
    for (var i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0, 255, 0));
    }
    for (var i = 0; i < path.length; i++) {
      path[i].show(color(0, 255, 255));
    }
  } else {
    for (var i = 0; i < path.length; i++) {
      path[i].show(color(0, 255, 0));
    }
  }

  push();
  strokeWeight(4);
  stroke(100);
  noFill();
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].x * w + (w / 2), path[i].y * h + (h / 2));
  }
  endShape();
  pop();
}

function cycle() {
  while (stack.length > 0) {
    let index = floor(random(stack.length));
    currentCell = stack[index];
    stack.splice(index, 1);

    let neighbors = currentCell.checkNeighbors();
    if (neighbors.length > 0) {
      stack.push(currentCell);

      let chosen = random(neighbors);
      removeWall(currentCell.x, currentCell.y, chosen.x, chosen.y);
      chosen.visited = true;
      stack.push(chosen);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].getNeighbors();
    }
  }
}

function startSolving() {
  openSet = [];
  closedSet = [];
  path = [];

  start = grid[0][rows - 1];
  end = grid[cols - 1][0];
  openSet.push(start);
}

function draw() {
  background(255);
  UI();
  if (solve) {
    aCycle();
  }
  drawGrid();
  for (var i = 0; i < instructions.length; i++) {
    ps[i].html(instructions[i]);
  }
}
