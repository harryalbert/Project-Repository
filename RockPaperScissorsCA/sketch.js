var s;
var randomStart = false;
var divisions = [];

var minG = 80;
var gX, gY;
var grid = [];

const R = 0;
const P = 1;
const S = 2;
var colors;

var types = rules[0];

var ruleSelect;
var randCheck;
var randThresholdCheck;

function setup() {
  if (windowWidth < windowHeight) {
    s = (windowWidth - 70) / minG;
  } else {
    s = (windowHeight - 70) / minG;
  }
  gX = int((windowWidth - 70) / s);
  gY = int((windowHeight - 70) / s)
  createCanvas(gX * s, gY * s);

  ruleSelect = createSelect();
  ruleSelect.option('Rock, Paper, Scissors');
  ruleSelect.option('Rock, Paper, Scissors, Lizard, Spock');
  ruleSelect.changed(changeRule);

  randCheck = createCheckbox('random start', false);
  randCheck.changed(changeStart);

  randThresholdCheck = createCheckbox('randomly change threshold (less predictable patterns)', false);
  randThresholdCheck.changed(changeThreshold);

  createGrid();
}

function reset(){
  createGrid();
}

function changeRule(){
  if (ruleSelect.value() == 'Rock, Paper, Scissors'){
    types = rules[0];
  }else if (ruleSelect.value() == 'Rock, Paper, Scissors, Lizard, Spock'){
    types = rules[1];
  }

  reset();
}

function changeStart(){
  randomStart = !randomStart;
  reset();
}

function changeThreshold(){
  randomThreshold = !randomThreshold;
  reset();
}

function createGrid() {
  grid = [];

  if (!randomStart){
    points = getPoints(Object.keys(types).length);
  }

  for (let i = 0; i < gX; i++) {
    grid[i] = [];
    for (let j = 0; j < gY; j++) {
      if (randomStart) {
        grid[i][j] = types[int(random(Object.keys(types).length))];
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
      let c = grid[i][j][2];
      stroke(c[0], c[1], c[2]);
      fill(c[0], c[1], c[2]);
      rect(i * s, j * s, s, s);
    }
  }
}

function keyTyped(){
  if (key == 'r'){
    reset();
  }
}

function draw() {
  background(180);

  updateGrid();
  drawGrid();
}
