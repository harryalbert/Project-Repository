//sodoku board creator/solver

var grid = []; //game board
var constants = []; //marks the origonal numbers as permanent
var highlighted = []; //marks the numbers highlighted by the player

var offset = 3; //space between the edge of the screen and the edge of the board
var w, h; //width and height of each space
var screenW, screenH; //width and height of the screen (minus the offset)
var numBlanks = 45; //number of empty spaces at the start of the board

var createBoard = true; //marks when to create the board
var animate = false; //whether or not the board creation process is shown

function setup() {
  createCanvas(1000, 1000);

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

  createGrid();
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

function keyTyped() {
  if (key == 'c') { //creates board (if this is not set to automatically happen)
    createBoard = !createBoard;
  }
  if (key == 's') { //solves board
    initBoard = true;
    cSpace = false;
  }
  if (key == 'r') { //resets everything
    restart();
  }
  if (key == 'a') { //turns on/off animations
    animate = !animate;
  }
  if (key == 'q') { //checks player's answers
    checkAnswers();
  }
  if (key == 'h' && selected) { //highlights/unhighlights spaces
    let index = 100; //can't set index to false b/c false and 0 are seen as the same value
    for (let i = 0; i < highlighted.length; i++) {
      if (highlighted[i][0] == selected[0] && highlighted[i][1] == selected[1]) {
        index = i;
      }
    }
    if (index != 100) {
      highlighted.splice(index, 1);
    } else {
      highlighted.push(selected);
    }
  }
}

function keyPressed() {
  if (selected) { //sets space to number value (if keyboard input is a number)
    if (unchar(key) >= 49 && unchar(key) <= 57 && !inList(constants, selected)) {
      grid[selected[0]][selected[1]] = int(key);
    }
    if (keyCode == BACKSPACE && !inList(constants, selected)) { //erases a space's value (if it is not origonal)
      grid[selected[0]][selected[1]] = false;
    }
  }
}

function draw() {
  background(255);

  if (createBoard) {
    if (animate) { //animates process of creating/solving board
      if (initBoard) { //creates fully solved grid
        solveGrid();
      } else if (numBlanks > 0) { //erases a set amount of the spaces in this solved board
        let x = int(random(9));
        let y = int(random(9));
        if (grid[x][y]) {
          grid[x][y] = false;
          numBlanks--;
        }
      } else if (numBlanks == 0) { //marks the spaces with numbers left in them as constants (which can't be changed)
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (grid[i][j]) {
              constants.push([i, j]);
            }
          }
        }
        numBlanks--;
      }
    } else { //does the same thing as the previous code, just faster and without animations
      while (initBoard) {
        solveGrid();
      }
      while (numBlanks > 0) {
        let x = int(random(9));
        let y = int(random(9));
        if (grid[x][y]) {
          grid[x][y] = false;
          numBlanks--;
        }
      }
      if (numBlanks == 0) {
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            if (grid[i][j]) {
              constants.push([i, j]);
            }
          }
        }
        numBlanks--;
      }
    }
  }

  drawGrid();
}
