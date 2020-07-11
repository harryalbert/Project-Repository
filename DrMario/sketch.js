var grid = [];
var gX = 8;
var gY = 16;
var s;

var colors;
var numVirus = 5;
var cPill;

var refreshRate = 23;
var refreshCounter = 0;

var movePillsDown = false;
var paused = false;

const E = 0;

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
  s = (windowHeight - 5) / gY;
  while (s * gX * 3 > windowWidth - 5){
    s -= 1;
  }

  createCanvas(s * gX * 3, s * gY);
  backgroundImg.resize(width, height);

  createGrid();
  colors = [color(100), color(255, 0, 0), color(255, 255, 0), color(135, 206, 235)];

  cPill = new Pill();
}

function createGrid() {
  grid = [];
  for (let i = 0; i < gX; i++) {
    grid[i] = [];
    for (let j = 0; j < gY; j++) {
      grid[i][j] = E;
    }
  }

  for (let i = 0; i < numVirus; i++) {
    let x = int(random(gX));
    let y = int(random(6, gY));
    grid[x][y] = new Virus(x, y, int(random(1, 4)));
  }
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
  if (x >= gX) {
    return false;
  }
  if (y < 0) {
    return false;
  }
  if (y >= gY) {
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
          let nX = i + dir[0];
          let nY = j + dir[1];

          while (inBounds(nX, nY) && grid[nX][nY] != E && grid[nX][nY].col == grid[i][j].col) {
            lineList.push([nX, nY]);
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
  for (let i = grid.length - 1; i >= 0; i--) {
    for (let j = 0; j < grid[i].length; j++) {
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
      let x = pos[0];
      let y = pos[1] + 1;

      grid[x][y] = grid[x][y - 1];
      grid[x][y].x = x;
      grid[x][y].y = y;
      grid[x][y - 1] = E;
    }
  }
}

function drawGrid() {
  stroke(0);
  fill(0);
  rect(0, 0, s * gX, s * gY);

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
