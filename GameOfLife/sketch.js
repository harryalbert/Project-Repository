var gridX = 60;
var gridY = 60;

var screenX = 1000;
var screenY = 700;

var w = 20;
var h = 20;
var grid = new Array(gridX);

var minW;
var minH;

var refreshRate = 10;
var counter = 0;

function setup() {
  createCanvas(screenX, screenY);

  minW = screenX / gridX;
  minH = screenY / gridY;

  createGrid();
}

function createGrid() {
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(gridY);
  }

  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      grid[x][y] = new cell(x, y);
      if (random(1) > 0.4 && randAlive) {
        grid[x][y].alive = true;
      }
    }
  }

  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      grid[x][y].addNeighbors();
    }
  }
}

function draw() {
  background(200);
  if (!begin) {
    interactions();
  } else {
    counter += 1;
    if (counter >= refreshRate) {
      counter = 0;
      for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
          grid[x][y].checkState();
        }
      }
      for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
          grid[x][y].update();
        }
      }
    }
  }

  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      grid[x][y].draw();
    }
  }
}
