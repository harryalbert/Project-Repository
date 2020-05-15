var selected;

function mousePressed() {
  //selects space that was clicked
  if (!initBoard && numBlanks < 0) {
    let mX = int(mouseX / w);
    let mY = int(mouseY / h);
    selected = [mX, mY];
  }
}

function checkAnswers() {
  //checks if the user's answers are correct
  //really checks all answers, but the origonal ones are never wrong
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!checkIfLegal(i, j, grid[i][j]) && grid[i][j]) {
        console.log(str(i) + "," + str(j) + " is wrong");
      }
    }
  }
}

function keyTyped() {
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
