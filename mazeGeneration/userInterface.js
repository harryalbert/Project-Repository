function UI() {
  if (mouseIsPressed) {
    if (mouseX < width && mouseY < height) {
      let x = floor(mouseX / w);
      let y = floor(mouseY / h);
      if (keyIsPressed) {
        grid[x][y].clicked = false;
      } else {
        grid[x][y].clicked = true;
      }
    }
  }
}

function keyTyped() {
  if (key == 'r') {
    createGrid();
    curCell = grid[0][rows - 1];
    stack.push(curCell);
    curCell.visited = true;
    cycle();
  }

  if (key == 'e') {
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].clicked = false;
      }
    }
  }
}
