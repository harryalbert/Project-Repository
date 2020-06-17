//sodoku board creator/solver
//still need to implement detection if user inputted board is unsolvable (not obviously, but after trying everything)

var grid = []; //game board
var constants = []; //marks the origonal numbers as permanent
var highlighted = []; //marks the numbers highlighted by the player

var offset = 3; //space between the edge of the screen and the edge of the board
var w, h; //width and height of each space
var screenW, screenH; //width and height of the screen (minus the offset)
var numBlanks; //number of empty spaces at the start of the board

var animate = false; //whether or not the board creation process is shown

var instructions = [
  "adjust the slider to change the number of blank spaces at the start",
  "press s to solve",
  "press a to turn on/off animations",
  "press r to create a new board",
  "press q to check your answers (wrong answers are in the console, F12 to see them)",
  "press h while a space is selected to highlight it"
];
var instructionParagraphs = [];

var difficultySlider;
var createBoardBox;
var autoCreateBoard = true;

function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight - 250, windowHeight - 250);
  } else {
    createCanvas(windowWidth - 290, windowWidth - 290);
  }

  screenW = width - (offset * 2);
  screenH = height - (offset * 2);
  w = screenW / 9;
  h = screenH / 9;

  textAlign(CENTER, CENTER);
  //sets the text size to half of the smaller size paramater of each space
  if (w < h) {
    textSize(w / 2);
  } else {
    textSize(h / 2);
  }
  difficultySlider = createSlider(10, 60, 45, 1);
  numBlanks = difficultySlider.value();

  createBoardBox = createCheckbox('automatically create a board', true);
  createBoardBox.changed(changedEvent);

  createGrid();
  for (let i = 0; i < instructions.length; i++) {
    instructionParagraphs.push(createP());
  }
}

function changedEvent() {
  autoCreateBoard = this.checked();
  restart();
}

function createGrid() {
  //creates a blank grid
  for (let i = 0; i < 9; i++) {
    grid[i] = [];
    for (let j = 0; j < 9; j++) {
      grid[i][j] = false;
    }
  }
}

function drawGrid() {
  //shows grid
  push();

  //creates space around board
  translate(offset, offset);

  //draws the main layout of the board
  stroke(0);
  for (let i = 0; i <= 9; i++) {
    if (i % 3 == 0) {
      //bold lines to indicate squares
      strokeWeight(3);
    } else {
      strokeWeight(1);
    }
    line(0, i * w, screenW, i * w);
    line(i * h, 0, i * h, screenH);
  }

  //displays values of each space
  strokeWeight(1);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j]) {
        stroke(0);
        fill(0);
        //change text color based on if the number is origonal, highlighted, or neither
        if (inList(constants, [i, j])) {
          stroke(255, 0, 0);
          fill(255, 0, 0);
        } else if (inList(highlighted, [i, j])) {
          stroke(0, 255, 255);
          fill(0, 255, 255);
        }
        text(str(grid[i][j]), i * w + w / 2, j * h + h / 2);
      }
    }
  }

  //shows which space is currently selected by the player
  if (selected) {
    stroke(255, 0, 0);
    noFill();
    rect(selected[0] * w, selected[1] * h, w, h);
  }

  pop();
}

function eraseSpaces() {
  let x = int(random(9));
  let y = int(random(9));
  if (grid[x][y]) {
    grid[x][y] = false;
    numBlanks--;
  }
}

function markConstants() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j]) {
        constants.push([i, j]);
      }
    }
  }
}

function draw() {
  background(255);

  if (autoCreateBoard) {
    if (numBlanks == 0) {
      markConstants();
      numBlanks--;
    } else if (animate) { //animates process of creating/solving board
      if (initBoard) { //creates fully solved grid
        solveGrid();
      } else if (numBlanks > 0) { //erases a set amount of the spaces in this solved board
        eraseSpaces();
      }
    } else { //same as previous w/o animations
      while (initBoard) {
        solveGrid();
      }
      while (numBlanks > 0) {
        eraseSpaces();
      }
    }
  } else {
    if (initBoard) {
      if (!animate) {
        while (initBoard) {
          solveGrid();
        }
      } else {
        solveGird();
      }
    }
  }

  drawGrid();
  for (let i = 0; i < instructionParagraphs.length; i++) {
    instructionParagraphs[i].html(instructions[i]);
  }
}
