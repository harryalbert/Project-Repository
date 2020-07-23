var grid = [];
var cols = 8;
var rows = 16;
var s;

var colors;
var numVirus = 10;
var virusLeft = 0;
var cPill;

var speed = 1;
var speedName;
var refreshRate = 13 + speed * 5;
var refreshCounter = 0;

var movePillsDown = false;
var paused = false;

var level = 1;
var score = 0;

function setup() {
  if (windowWidth < windowHeight){
    createCanvas(windowWidth - 5, windowWidth - 5);
  }else{
    createCanvas(windowHeight - 5, windowHeight - 5);
  }
  s = width / 32;

  resizeImgs();
  textFont(gameFont);

  createGrid();
  colors = [color(100), color(255, 0, 0), color(255, 255, 0), color(135, 206, 235)];

  cPill = new Pill();

  switch(speed){
    case 1:
      speedName = 'LOW';
      break;
    case 2:
      speedName = 'MED';
      break;
    case 3:
      speedName = 'HI';
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

  let killedVirus = 0;
  for (let pos of eraseList) {
    if (grid[pos[0]][pos[1]] instanceof Virus){
      killedVirus += 1;
    }

    for (let i = 0; i < grid.length; i++){
      for (let j = 0; j < grid[i].length; j++){
        if (grid[i][j] instanceof PlacedPill && grid[i][j].connectedTo == grid[pos[0]][pos[1]]){
          grid[i][j].connectedTo = undefined;
        }
      }
    }

    grid[pos[0]][pos[1]] = E;
  }

  if (killedVirus > 0){
    virusLeft -= killedVirus;
    if (killedVirus > 6){
      killedVirus = 6;
    }

    let scoreMult = Math.pow(2, killedVirus - 1);
    score += scoreMult * 100;
    return true;
  }
  return false;
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
    if (!erasePills()){
      movePillsDown = false;

      if (checkLevelDone()){
        nextLevel();
      }else{
        cPill = new Pill();
      }
    }
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

function checkLevelDone(){
  for (let i = 0; i < grid.length; i++){
    for (let j = 0; j < grid[i].length; j++){
      if (grid[i][j] instanceof Virus){
        return false;
      }
    }
  }

  return true;
}

function nextLevel(){
  level += 1;
  createGrid();
  cPill = new Pill();
}

function draw() {
  drawUI();

  push();
  translate(s * 12, s * 10);
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
