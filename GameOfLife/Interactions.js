var begin = false;

function keyTyped() {
  if (keyCode == ENTER) {
    begin = true;
  }
  if (keyCode == UP_ARROW) {
    refreshRate -= 1;
    console.log(refreshRate);
  }
  if (keyCode == DOWN_ARROW) {
    refreshRate += 1;
    console.log(refreshRate);
  }
}

function interactions() {
  if (!begin && mouseIsPressed && mouseX < screenX && mouseY < screenY) {
    let mousePos = mouseToBox(mouseX, mouseY);
    if (keyIsPressed) {
      grid[mousePos[0]][mousePos[1]].alive = false;
    } else {
      grid[mousePos[0]][mousePos[1]].alive = true;
    }
  }
}

function mouseWheel(event) {
  if (event.delta > 0) {
    w += 1;
    h += 1;
  }

  if (event.delta < 0) {
    if (w > minW || h > minH) {
      w -= 1;
      h -= 1;
    }
  }
}


function mouseToBox(x, y) {
  let newX = int(x / w);
  let newY = int(y / h);

  return [newX, newY];
}
