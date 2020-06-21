var s;
var randomStart = false;
var divisions = [];

var minG = 60;
var gX, gY;
var grid = [];

const R = 0;
const P = 1;
const S = 2;
var types = [R, P, S];
var colors;

function setup() {
  if (windowWidth < windowHeight) {
    s = (windowWidth - 5) / minG;
  } else {
    s = (windowHeight - 5) / minG;
  }
  gX = int((windowWidth - 5) / s);
  gY = int((windowHeight - 5) / s)
  createCanvas(gX * s, gY * s);

  createGrid();
  colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];
}

function createGrid() {
  grid = [];

  if (!randomStart){
    points = getPoints(types.length);
  }

  for (let i = 0; i < gX; i++) {
    grid[i] = [];
    for (let j = 0; j < gY; j++) {
      if (randomStart) {
        grid[i][j] = random(types);
      }else{
        let extendedPoint = getLine(i * s, j * s);
        let zone = findZone(collapse(extendedPoint.x, extendedPoint.y));
        grid[i][j] = types[zone];
      }
    }
  }
}

function drawGrid() {
  for (let i = 0; i < gX; i++) {
    for (let j = 0; j < gY; j++) {
      stroke(colors[grid[i][j]]);
      fill(colors[grid[i][j]]);
      rect(i * s, j * s, s, s);
    }
  }
}

function draw() {
  background(180);

  updateGrid();
  drawGrid();
}
