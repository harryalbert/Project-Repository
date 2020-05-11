var beginSearch = false;
var randomWalls = false;
var startOver = false;

function keyTyped() {
  if (keyCode == ENTER && !beginSearch) {
    openSet.push(start);
    beginSearch = true;
  }
  if (key == 'r') {
    startOver = true;
  }
}

function interactions() {
  if (keyIsPressed) {
    if (keyCode == SHIFT) {
      if (mouseX < screenX && mouseY < screenY) {
        let mousePos = mouseToBox(mouseX, mouseY);
        grid[mousePos[0]][mousePos[1]].wall = false;
      }
    }
  }

  if (mouseIsPressed) {
    if (mouseX < screenX && mouseY < screenY) {
      let mousePos = mouseToBox(mouseX, mouseY);
      if (keyIsPressed) {
        if (key == 's'){
          start = grid[mousePos[0]][mousePos[1]];
        }
        if (key == 'e'){
          end = grid[mousePos[0]][mousePos[1]];
        }else{
          grid[mousePos[0]][mousePos[1]].wall = false;
        }
      } else {
        grid[mousePos[0]][mousePos[1]].wall = true;
      }
    }
  }
}

function mouseToBox(x, y) {
  let newX = int(x / w);
  let newY = int(y / h);

  return [newX, newY];
}
