var cols = 28;
var rows = 31;
var grid = new Array(cols);

var screenX = 600;
var screenY = 600;

var star = true;
var dijkstra = false;

var w, h;


function setup() {
  createCanvas(screenX, screenY);

  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
}

function drawGrid() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }

  fill(255, 105, 0);
  rect(end.x * w, end.y * h, w, h)

  fill(220, 0, 220);
  rect(start.x * w, start.y * h, w, h)

  noFill();
  stroke(255);
  strokeWeight(4);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].x * w + w / 2, path[i].y * h + h / 2)
  }
  endShape();
}


function draw() {
  background(0);
  if (done == false) {
    if (beginSearch) {
      aCycle();
    } else {
      interactions();
    }
  }

  if (startOver) {
    startOver = false;
    reset();
  }
  drawGrid();
}
