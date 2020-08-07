//Web based Dr Mario game (using NES accurate randomization)
//by Harry Albert
var grid = [];
var cols = 8;
var rows = 16;
var s; //size of one box in grid
var offset = 0;

var numVirus = 10;
var level = 0;
var creatingLevel = true;
var numRemaining;

var virusImgs = [];
var pillImgs = [];
var displayPills = [];
var seedInput1, seedInput2, seedButton, seedExplainP;
var seed1, seed2;
var levelSlider;

function preload() {
  pillImgs = [loadImage('assets/yellowPill.png'), loadImage('assets/redPill.png'), loadImage('assets/bluePill.png')];
  virusImgs = [loadImage('assets/yellowVirus.png'), loadImage('assets/redVirus.png'), loadImage('assets/blueVirus.png')]
  frameRate(3);
}

function setup() {
  s = (windowHeight - 80) / rows;
  while (s * cols > (windowWidth - 80)){
    s -= 1;
  }
  createCanvas(s * cols + (4 * s), s * rows);

  seed1 = int(random(255));
  seed2 = int(random(255));

  resizeImgs();
  textSize(s);
  textAlign(LEFT, TOP);

  seedExplainP = createP();
  seedButton = createButton('increment seed');
  seedInput1 = createInput(seed1);
  seedInput2 = createInput(seed2);
  seedButton.mousePressed(incrementSeed)
  seedInput1.input(input1);
  seedInput2.input(input2);
  levelSlider = createSlider(0, 20, 0, 1);

  resetGrid();
}

function input1(){
  let newValue = int(this.value());
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 255){
    seed1 = newValue
  }
  creatingLevel = true;
  resetGrid();
}

function input2(){
  let newValue = int(this.value());
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 255){
    seed2 = newValue;
  }
  creatingLevel = true;
  resetGrid();
}

var added1 = false;
function incrementSeed(){
  if (!added1){
    seed1 += 1;
    seedInput1.value(seed1);
    added1 = true;
  }else{
    seed2 += 1;
    seedInput2.value(seed2);
    added1 = false;
  }
  creatingLevel = true;
  resetGrid();
}

function resizeImgs(){
  for (let v of virusImgs){
    v.resize(s, s);
  }
  for (let p of pillImgs){
    p.resize(s, s);
  }
}

function nextLevel() {
  level += 1;
  creatingLevel = true;
  resetGrid();
}

var virColors = [[255, 255, 0], [255, 0, 0], [0, 0, 255]];
function drawGrid() {
  stroke(0);
  fill(0);
  rect(0, 0, s * cols, s * rows);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != E) {
        image(virusImgs[grid[i][j] - 1], j * s, (rows - i - 1) * s);
      }
    }
  }

  if (selectedBox.length != 0){
    let c = virColors[orderedCols[0] - 1];
    stroke(c[0], c[1], c[2]);
    fill(c[0], c[1], c[2], 100);
    strokeWeight(2);
    rect(selectedBox[0] * s, (rows - selectedBox[1] - 1) * s, s, s);
    strokeWeight(1);
  }
}

function draw() {
  background(50);
  seedExplainP.html("Input to change starting seed");
  if (level != levelSlider.value()){
    level = levelSlider.value();
    creatingLevel = true;
    resetGrid();
  }

  if (creatingLevel){
    creatingLevel = generateGrid();
  }
  drawGrid();
  for (let i = displayPills.length - 1; i >= 0; i--){
    displayPills[i].show();
  }
}

class displayPill{
  constructor(y, l, r, num){
    this.y = y;
    this.num = num;
    this.left = l;
    this.right = r;
  }

  show(){
    stroke(255);
    fill(255);
    text(str(this.num), s * cols, this.y + offset);
    image(pillImgs[this.left - 1], s * cols + s + textWidth(str(this.num)) / 2, this.y + offset);
    image(pillImgs[this.right - 1], s * cols + 2 * s + textWidth(str(this.num)) / 2, this.y + offset);
  }
}

function mouseWheel(event){
  offset -= event.delta;

  if ((offset / height) < (-10326 / 937)){
    offset = (-10326 / 937) * height;
  }

  if (offset > 0){
    offset = 0;
  }

  return false;
}