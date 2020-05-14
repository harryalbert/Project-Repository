var begin = false;

function keyTyped() {
  if (keyCode == ENTER) {
    begin = true;
  }
  if (key == 'r'){
    restart();
  }
}

function mouseInteractions(){
  if (!begin && mouseIsPressed && mouseX < width && mouseY < height) {
    let mousePos = mouseToBox(mouseX, mouseY);
    if (keyIsPressed) {
      grid[mousePos[0]][mousePos[1]].alive = false;
    } else {
      grid[mousePos[0]][mousePos[1]].alive = true;
    }
  }
}

function mouseToBox(x, y) {
  let newX = int(x / w);
  let newY = int(y / h);

  return [newX, newY];
}

function restart(){
  createGrid();
  begin = false;
}
