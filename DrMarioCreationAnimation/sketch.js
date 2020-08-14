//Dr Mario Level Creation Animation (using game accurate Algorithm)
//by Harry Albert

var grid = [];
var cols = 8;
var rows = 16;


var s; //size of one box in grid
var offset = 0; //translation for pill scrolling

var numVirus = 10;
var level = 0;
var creatingLevel = true;

var virusImgs = [];
var pillImgs = [];

var displayPills = []; //list of vitamins
var virColors = [
  [255, 255, 0],
  [255, 0, 0],
  [0, 0, 255]
];//rgb colors for each virus

var seedInput1, seedInput2, seedButton, explanationP; //variables for user seed input
var seed1, seed2;

var levelSlider; //slider for level number
var speedSlider; //slider to change frame rate

function preload() {
  pillImgs = [loadImage('assets/yellowPill.png'), loadImage('assets/redPill.png'), loadImage('assets/bluePill.png')];
  virusImgs = [loadImage('assets/YellowVirus.png'), loadImage('assets/RedVirus.png'), loadImage('assets/BlueVirus.png')]
}

function setup() {
  //set max box size, then set window size based on that
  s = (windowHeight - 100) / rows;
  while (s * cols > (windowWidth - 100)) {
    s -= 1;
  }
  createCanvas(s * cols + (4 * s), s * rows);

  resizeImgs(); //resize images to correct size (based on s)
  textSize(s);
  textAlign(LEFT, TOP);

  seed1 = int(random(255));
  seed2 = int(random(255));

  explanationP = createP(); //blurb explaining seed input
  seedButton = createButton('increment seed');
  seedButton.mousePressed(incrementSeed)

  seedInput1 = createInput(seed1);
  seedInput2 = createInput(seed2);
  seedInput1.input(input1);
  seedInput2.input(input2);

  levelSlider = createSlider(0, 20, 0, 1);
  speedSlider = createSlider(1, 40, 30, 1);

  resetGrid();
}

function input1() {
  //changes seed1 to user inputted seed
  let newValue = int(this.value());
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 255) {
    seed1 = newValue;
  }
  creatingLevel = true;
  resetGrid();
}

function input2() {
  //changes seed2 to user inputted seed
  let newValue = int(this.value());
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 255) {
    seed2 = newValue;
  }
  creatingLevel = true;
  resetGrid();
}

let added1 = false;
function incrementSeed() {
  //adds 1 to alternating seeds
  if (!added1) {
    seed1 += 1;
    seedInput1.value(seed1);
    added1 = true;
  } else {
    seed2 += 1;
    seedInput2.value(seed2);
    added1 = false;
  }
  creatingLevel = true;
  resetGrid();
}

function resizeImgs() {
  //resize images to proper size
  for (let v of virusImgs) {
    v.resize(s, s);
  }
  for (let p of pillImgs) {
    p.resize(s, s);
  }
}

function drawGrid() {
  stroke(0);
  fill(0);
  rect(0, 0, s * cols, s * rows);

  //display each virus on grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != E) {
        image(virusImgs[grid[i][j] - 1], j * s, (rows - i - 1) * s);
      }
    }
  }

  //for displaying all of the info the alg is checking
  if (selectedBox.length != 0) {
    //display current color/position being considered
    let c = virColors[orderedCols[0] - 1];
    stroke(c[0], c[1], c[2]);
    fill(c[0], c[1], c[2], 100);
    strokeWeight(2);
    rect(selectedBox[0] * s, (rows - selectedBox[1] - 1) * s, s, s);

    //display the 4 spaces being checked as problems
    stroke(255);
    fill(100, 100);
    for (let c of checking) {
      //checks if specific space is a problem (meaning we need to switch colors b/c of it)
      //if so, highlights that specific space purple.
      push();

      let problematic = false;
      if (c[0] == problemSpace[0] && c[1] == problemSpace[1]) {
        stroke(255, 0, 255);
        fill(255, 0, 255, 100);
        problematic = true;
      }
      rect(c[0] * s, (rows - c[1] - 1) * s, s, s);
      pop();
    }

    strokeWeight(1);
  }
}

function draw() {
  background(50);
  explanationP.html("level: " + level.toString() + ", Speed: " + (41 - updateDelay).toString());

  //changes refresh rate if slider is changed
  if (speedSlider.value() != updateDelay) updateDelay = speedSlider.value();

  //pauses alg for the first switch in color for a new space
  if (colorDelay && !colorDelayed){
    colorDelay = false;
    colorDelayed = true;
    sleep(300);
  }

  //switches level num when slider is changed
  if (level != levelSlider.value()) {
    level = levelSlider.value();
    creatingLevel = true;
    resetGrid();
  }

  //progresses algorithm when refresh threshold is hit
  updateCounter += 1;
  if (creatingLevel && updateCounter >= updateDelay) {
    updateCounter = 0;
    creatingLevel = generateGrid();
  }

  drawGrid();
  for (let i = displayPills.length - 1; i >= 0; i--) {
    displayPills[i].show();
  }

  //if alg had to switch space's color, delay the program for a bit
  //have to do this at the beggining of the next draw cycle, or the display won't refresh
  if (problemSpace.length > 0){
    colorDelay = true;
  }
}

class displayPill {
  //vitamins displayed on side
  constructor(y, l, r, num) {
    this.y = y;
    this.num = num; //place in vitamin order

    //left and right color
    this.left = l;
    this.right = r;
  }

  show() {
    //show self if not off-screen (w/ scrolling offset)
    if (this.y + offset < height && this.y + offset > -s){
      stroke(255);
      fill(255);
      text(str(this.num), s * cols, this.y + offset);
      image(pillImgs[this.left - 1], s * cols + s + textWidth(str(this.num)) / 2, this.y + offset);
      image(pillImgs[this.right - 1], s * cols + 2 * s + textWidth(str(this.num)) / 2, this.y + offset);
    }
  }
}

function mouseWheel(event) {
  //scrolls pills down if mouse is in the vitamin area
  if (mouseX >= 2 * width / 3 && mouseX <= width) {
    offset -= event.delta;

    //stops scrolling when final pill is at the bottom
    if ((offset / height) < (-10326 / 937)) {
      offset = (-10326 / 937) * height;
    }

    if (offset > 0) {
      offset = 0;
    }

    return false; //stops scrolling action in actual window
  }
}
