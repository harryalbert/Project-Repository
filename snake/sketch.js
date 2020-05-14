var cols = 80;
var rows = 50;
var s;

var xOffset, yOffset;
var minOffset = 40;

const E = 0;
const F = 1;
const S = 2;

var updateDelay = 6;
var updateCounter = updateDelay;

var pause = false;

function setup() {
  createCanvas(windowWidth - 5, windowHeight - 5);

  let tempW = (width - minOffset) / cols;
  let tempH = (height - minOffset) / rows;
  if (tempW > tempH) {
    s = tempH;
  } else {
    s = tempW;
  }

  xOffset = (width - s * cols) / 2;
  yOffset = (height - s * rows) / 2;

  head = [0, 0];
  generateFood();
}

function generateFood() {
  foodPos = [];
  let possibilities = [];

  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      good = true;
      if (head[0] == i && head[1] == j){
        good = false;
      }else{
        for (let pos of tail){
          if (pos[0] == i && pos[1] == j){
            good = false;
          }
        }
      }
      if (good){
        possibilities.push([i, j]);
      }
    }
  }

  foodPos = random(possibilities);
}

function drawGrid() {
  push();
  translate(xOffset, yOffset);

  noStroke();
  fill(0, 0, 255);
  rect(0, 0, cols * s, rows * s);

  fill(255, 255, 0);
  rect(head[0] * s, head[1] * s, s, s);
  for (let pos of tail){
    rect(pos[0] * s, pos[1] * s, s, s);
  }

  fill(255, 0, 0);
  rect(foodPos[0] * s, foodPos[1] * s, s, s);
  pop();
}

function keyTyped() {
  if (key == 'p' && !dead) {
    pause = !pause;
  }
  if (key == 'r') {
    reset();
  }
}

function textBox(txt) {
  push();
  textAlign(CENTER, CENTER);
  textSize(30);

  noStroke();
  fill(215);
  rectMode(CENTER);
  rect(width / 2, height / 2, textWidth(txt) + 50, 150);

  stroke(0);
  fill(0);
  text(txt, width / 2, height / 2);
  pop();
}


function reset() {
  head = [0, 0];
  tail = [];
  len = 0;
  dir = [0, 0];
  tempDir = [0, 0];
  foodPos = [];
  speedIncrease = 0;
  dead = false;
  pause = false;

  generateFood();
}

function draw() {
  if (!pause && !dead) {
    background(255, 81, 29);

    updateCounter++;
    if (updateCounter % updateDelay == 0) {
      updateSnake();
      updateCounter = 0;
    }

    drawGrid();
    if (checkDead()) {
      dead = true;
    }

    if (dir[0] == 0 && dir[1] == 0) {
      textBox("Press 'p' to pause, 'r' to restart, and any arrow key to start");
    }
  } else if (pause) {
    textBox("Press 'p' to unpause");
  } else if (dead) {
    noStroke();
    fill(185);
    rect(head[0] * s + xOffset, head[1] * s + yOffset, s, s);

    textBox("Press 'r' to restart");
  }

  stroke(255);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(30);
  text("Score: " + str(len), 0, 0);
}
