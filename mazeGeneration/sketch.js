var cols = 40;
var rows = 40;
var grid = [];

var w;
var h;

var curCell;
var stack = [];

var instructions = [
  'click the mouse to draw on the maze',
  'hold down any key while clicking to erase',
  'press r to generate a new maze',
  'press e to erase all'
];
var instructionParagraphs = [];

function setup() {
  createCanvas(windowHeight - 180, windowHeight - 180);
  w = (width - 1) / cols;
  h = (height - 1) / rows;

  createGrid();
  curCell = grid[0][rows - 1];
  stack.push(curCell);
  curCell.visited = true;

  cycle();

  if (instructionParagraphs.length <= 0){
    for (let i = 0; i < instructions.length; i++){
      instructionParagraphs.push(createP());
    }
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

  for (let i = 0; i < instructionParagraphs.length; i++){
    instructionParagraphs[i].html(instructions[i]);
  }
}
