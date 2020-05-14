var gridX = 60;
var gridY = 60;
var grid = new Array(gridX);

var w, h;

var refreshRate;
var counter = 0;

//up arrow increases refresh rate, down arrow does opposite, click to kill a cell, click while holding down any key to revive a cell, scroll to zoom in/out
var instructions = [
  "press enter to start",
  "press 'r' to restart",
  "click while pressing nothing to kill a cell",
  "click while pressing anything to revive a cell",
  "move the slider to change the refresh rate"
];
var instructionParagraphs = [];

function setup() {
  createCanvas(windowWidth - 150, windowHeight - 200);

  w = width / gridX;
  h = height / gridY;

  createGrid();

  refreshRate = createSlider(1, 20, 5, 1);

  if (instructionParagraphs.length <= 0){
    for (let i = 0; i < instructions.length; i++){
      instructionParagraphs.push(createP());
    }
  }
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

  mouseInteractions();
  if (begin){
    counter += 1;
    if (counter >= refreshRate.value()) {
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

  for (let i = 0; i < instructionParagraphs.length; i++){
    instructionParagraphs[i].html(instructions[i]);
  }
}
