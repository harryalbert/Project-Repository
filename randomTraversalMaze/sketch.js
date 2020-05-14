var cols = 80;
var rows = 40;
var w;

var grid = new Array(cols);
var path = [];
var neighbors = [];

var done = false;
var solve = false;

const W = 0;
const P = 1;

var instructionP;

function setup() {
  w = (windowHeight - 60) / rows;
  createCanvas(cols * w, windowHeight - 60);
  createGrid();

  instructionP = createP();
}

function createGrid() {
  for (var i = 0; i < cols; i++) {
    grid[i] = [];
    for (var j = 0; j < rows; j++) {
      grid[i][j] = W;
    }
  }

  grid[0][rows - 1] = P;
  grid[cols - 1][0] = P;
  path.push([0, rows - 1]);
  path.push([cols - 1, 0]);
}

function getNeighbors(x, y, limit) {
  let n = [];
  let final = [];

  if (x > 0) {
    n.push([x - 1, y]);
  }
  if (x < cols - 1) {
    n.push([x + 1, y]);
  }
  if (y > 0) {
    n.push([x, y - 1]);
  }
  if (y < rows - 1) {
    n.push([x, y + 1]);
  }

  if (limit) {
    for (let spot of n) {
      if (grid[spot[0]][spot[1]] == W) {
        final.push(spot);
      }
    }
    return final;
  } else {
    return n;
  }
}

function checkSpot(spot) {
  let nNeighbors = getNeighbors(spot[0], spot[1], false);
  let numAdjacent = 0;

  for (let n of nNeighbors) {
    if (grid[n[0]][n[1]] == P) {
      numAdjacent += 1;
    }
  }

  if (numAdjacent > 1) {
    return false;
  }
  return true;
}

function newPath() {
  while (!done) {
    neighbors = [];
    for (let spot of path) {
      let n = getNeighbors(spot[0], spot[1], true);
      for (let s of n) {
        neighbors.push(s);
      }
    }

    let nNeighbors = [];
    for (let neighbor of neighbors) {
      if (checkSpot(neighbor)) {
        nNeighbors.push(neighbor);
      }
    }
    neighbors = nNeighbors;

    if (neighbors.length <= 0) {
      done = true;
      console.log('done');
      break;
    }
    nSpot = random(neighbors);
    path.push(nSpot);
    grid[nSpot[0]][nSpot[1]] = P;
  }
}

function drawGrid() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      stroke(0);
      fill(0);
      if (grid[i][j] == P) {
        stroke(200);
        fill(200);
      }
      rect(i * w, j * w, w, w);
    }
  }

  for (let node of openList) {
    node.show(color(0, 255, 0));
  }
  for (let node of closedList) {
    node.show(color(255, 0, 0));
  }

  push();
  beginShape();
  for (let node of route) {
    node.show(color(255, 0, 255));
    vertex(node.x * w + w / 2, node.y * w + w / 2);
  }
  stroke(255);
  strokeWeight(3);
  noFill();
  endShape();
  pop();
}

function draw() {
  background(0);
  if (!done) {
    newPath();
  }
  if (openList.length > 0) {
    aStar();
    constructPath();
  }
  drawGrid();
  if (goal && start){
    goal.show(255);
    start.show(255);
  }

  instructionP.html("Press Enter to solve the maze");
}
