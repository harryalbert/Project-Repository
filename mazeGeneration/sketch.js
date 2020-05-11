var cols = 40;
var rows = 40;
var grid = [];

var w;
var h;

var curCell;
var stack = [];

function setup() {
  createCanvas(601, 601);
  w = (width - 1) / cols;
  h = (height - 1) / rows;

  createGrid();
  curCell = grid[0][rows - 1];
  stack.push(curCell);
  curCell.visited = true;

  cycle();

  console.log('click mouse to draw on maze');
  console.log('hold down any key while drawing to erase');
  console.log('press r to generate a new maze');
  console.log('press e to erase all');
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
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
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
}

function draw() {
  background(255);
  UI();
  drawGrid();
}
