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
