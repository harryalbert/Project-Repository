function markadjacentNumber() {
  for (var x = 0; x < gridX; x++) {
    for (var y = 0; y < gridY; y++) {
      let num = adjacentNum(x, y);
      if (num > 0 && grid[x][y] != B) {
        adjacentNumber[x][y] = num;
      }
    }
  }
}

function adjacentNum(xPos, yPos) {
  let num = 0;

  if (xPos > 0) {
    if (yPos > 0) {
      if (grid[xPos - 1][yPos - 1] == B) {
        num += 1;
      }
    }
    if (yPos < gridY - 1) {
      if (grid[xPos - 1][yPos + 1] == B) {
        num += 1;
      }
    }
    if (grid[xPos - 1][yPos] == B) {
      num += 1;
    }
  }

  if (xPos < gridX - 1) {
    if (yPos > 0) {
      if (grid[xPos + 1][yPos - 1] == B) {
        num += 1;
      }
    }
    if (yPos < gridY - 1) {
      if (grid[xPos + 1][yPos + 1] == B) {
        num += 1;
      }
    }
    if (grid[xPos + 1][yPos] == B) {
      num += 1;
    }
  }

  if (yPos > 0) {
    if (grid[xPos][yPos - 1] == B) {
      num += 1;
    }
  }

  if (yPos < gridY - 1) {
    if (grid[xPos][yPos + 1] == B) {
      num += 1;
    }
  }

  return num;
}

function getAdjacentList(xPos, yPos) {
  let adjacentList = [];

  if (xPos > 0) {
    if (yPos > 0) {
      append(adjacentList, [xPos - 1, yPos - 1])
    }
    if (yPos < gridY - 1) {
      append(adjacentList, [xPos - 1, yPos + 1])
    }
    append(adjacentList, [xPos - 1, yPos])
  }

  if (xPos < gridX - 1) {
    if (yPos > 0) {
      append(adjacentList, [xPos + 1, yPos - 1])
    }
    if (yPos < gridY - 1) {
      append(adjacentList, [xPos + 1, yPos + 1])
    }
    append(adjacentList, [xPos + 1, yPos])
  }

  if (yPos > 0) {
    append(adjacentList, [xPos, yPos - 1])
  }

  if (yPos < gridY - 1) {
    append(adjacentList, [xPos, yPos + 1])
  }

  return adjacentList;
}

function getNumEmpty(){
  for (var x = 0; x < gridX; x++){
    for (var y = 0; y < gridY; y++){
      if (grid[x][y] == E){
        numEmpty += 1;
      }
    }
  }
}

function checkNumRevealed(){
  let numRevealed = 0;
  for (var x = 0; x < gridX; x++){
    for (var y = 0; y < gridY; y++){
      if (grid[x][y] == E && revealed[x][y]){
        numRevealed += 1;
      }
    }
  }
  if (numRevealed == numEmpty){
    win = true;
  }
}
