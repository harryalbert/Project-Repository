var tail = [];
var head;
var len = 0;
var dir = [0, 0];
var tempDir = [0, 0];

var foodPos = [];

var speedIncrease = 0;

var dead = false;

function keyPressed() {
  if (!pause && !dead){
    if (keyCode == UP_ARROW) {
      if (dir[1] != 1 || len == 0) {
        tempDir = [0, -1];
      }
    }
    if (keyCode == RIGHT_ARROW) {
      if (dir[0] != -1 || len == 0) {
        tempDir = [1, 0];
      }
    }
    if (keyCode == DOWN_ARROW) {
      if (dir[1] != -1 || len == 0) {
        tempDir = [0, 1];
      }
    }
    if (keyCode == LEFT_ARROW) {
      if (dir[0] != 1 || len == 0) {
        tempDir = [-1, 0];
      }
    }
  }
}

function checkDead(){
  for (let pos of tail){
    if (pos[0] == head[0] && pos[1] == head[1]){
      return true;
    }
  }

  if (head[0] < 0 || head[0] >= cols || head[1] < 0 || head[1] >= rows){
    return true;
  }

  return false;
}

function updateSnake() {
  tail.push([...head]);
  dir = [...tempDir];
  head[0] += dir[0];
  head[1] += dir[1];

  if (head[0] == foodPos[0] && head[1] == foodPos[1]) {
    len += 3;
    generateFood();

    speedIncrease += 1;
    if (speedIncrease >= 3 && updateDelay > 2) {
      updateDelay -= 1;
      speedIncrease = 0;
    }
  }


  while (tail.length > len) {
    tail.splice(0, 1);
  }
}
