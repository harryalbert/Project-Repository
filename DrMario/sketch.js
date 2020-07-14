var grid = [];
var cols = 8;
var rows = 16;
var s;

var colors;
var numVirus = 10;
var cPill;

var refreshRate = 23;
var refreshCounter = 0;

var movePillsDown = false;
var paused = false;

var pillImgs = [];
var virusImgs = [];
var backgroundImg;

function preload() {
  //L = left, R = Right
  //R = Red, Y = yellow, B = blue
  pillImgs.push(loadImage('Images/LR.png'));
  pillImgs.push(loadImage('Images/LY.png'));
  pillImgs.push(loadImage('Images/LB.png'));
  pillImgs.push(loadImage('Images/RR.png'));
  pillImgs.push(loadImage('Images/RY.png'));
  pillImgs.push(loadImage('Images/RB.png'));

  virusImgs.push(loadImage('Images/RedVirus.png'));
  virusImgs.push(loadImage('Images/YellowVirus.png'));
  virusImgs.push(loadImage('Images/BlueVirus.png'));

  backgroundImg = loadImage('Images/background.png');

  angleMode(DEGREES);
}

function setup() {
  s = (windowHeight - 5) / rows;
  while (s * cols * 3 > windowWidth - 5){
    s -= 1;
  }

  createCanvas(s * cols * 3, s * rows);
  backgroundImg.resize(width, height);

  createGrid();
  colors = [color(100), color(255, 0, 0), color(255, 255, 0), color(135, 206, 235)];

  cPill = new Pill();
}

function inList(l, pos) {
  for (let p of l) {
    if (p[0] == pos[0] && p[1] == pos[1]) {
      return true;
    }
  }
  return false;
}

function inBounds(x, y) {
  if (x < 0) {
    return false;
  }
  if (x >= cols) {
    return false;
  }
  if (y < 0) {
    return false;
  }
  if (y >= rows) {
    return false;
  }

  return true;
}

function erasePills() {
  let eraseList = [];

  let dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != E && !inList(eraseList, [i, j])) {
        for (let dir of dirs) {
          let lineList = [[i, j]];
          let nX = j + dir[0];
          let nY = i + dir[1];

          while (inBounds(nX, nY) && grid[nY][nX] != E && grid[nY][nX].col == grid[i][j].col) {
            lineList.push([nY, nX]);
            nX += dir[0];
            nY += dir[1];
          }

          if (lineList.length >= 4) {
            eraseList.push([i, j]);
            for (let pos of lineList) {
              eraseList.push(pos);
            }
          }
        }
      }
    }
  }

  for (let pos of eraseList) {
    grid[pos[0]][pos[1]] = E;
  }
}

function dropPills() {
  let dropList = [];
  for (let i = rows - 1; i >= 0; i --){
    for (let j = 0; j < grid[i].length; j++){
      if (grid[i][j] instanceof PlacedPill && grid[i][j].checkDown()) {
        dropList.push([i, j]);
      }
    }
  }

  if (dropList.length == 0) {
    movePillsDown = false;
    cPill = new Pill();
  } else {
    for (let pos of dropList) {
      let y = pos[0] + 1;
      let x = pos[1];

      grid[y][x] = grid[y - 1][x];
      grid[y][x].y = y;
      grid[y][x].x = x;
      grid[y - 1][x] = E;
    }
  }
}

function drawGrid() {
  stroke(0);
  fill(0);
  rect(0, 0, s * cols, s * rows);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != E) {
        grid[i][j].show();
      }
    }
  }
}

function printGrid(){
  let cGrid = [];
  for (let i = 0; i < grid.length; i++){
    cGrid[i] = [];
    for (let j = 0; j < grid[i].length; j++){
      if (grid[i][j] == E){
        cGrid[i][j] = E;
      }else{
        cGrid[i][j] = grid[i][j].col;
      }
    }
  }

  console.table(cGrid);
}

function draw() {
  image(backgroundImg, 0, 0);

  push();
  translate(width / 3, 0);
  drawGrid();

  if (!paused){
    refreshCounter += 1;
    if (refreshCounter >= refreshRate) {
      if (movePillsDown) {
        dropPills();
      } else {
        cPill.update();
      }
      refreshCounter = 0;
    }
  }

  if (!movePillsDown) {
    cPill.show();
  }
  pop();
}

function keyTyped(){
  if (key == 'p'){
    paused = !paused;
  }
}
