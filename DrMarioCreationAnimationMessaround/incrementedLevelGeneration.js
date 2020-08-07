var selectedBox = [];
var checking = [];
var orderedCols, orderedColsCopy, curCol, numRemaining;

function generateGrid() {
  if (pills.length == 0) {
    randomInit(256 * parseInt(seed1, 16) + parseInt(seed2, 16));
    setGlobals();
    numRemaining = virGoal;

    generatePills();
  }

  if (isMaximal()) return false;
  if (numRemaining <= 0) return false;

  if (selectedBox.length == 0) {
    let row = randomRow(virRows - 1);
    let col = randomCol()
    selectedBox = [col, row];
    getChecking();
    getColOrder();

    return true;
  }

  if (grid[selectedBox[1]][selectedBox[0]] != E) {
    return shiftBox();
  }

  curCol = orderedCols[0];
  if (colorIsAvailable(selectedBox[0], selectedBox[1], curCol)) {
    grid[selectedBox[1]][selectedBox[0]] = curCol;
    selectedBox = [];
    numRemaining -= 1;

    return true;
  } else {
    orderedCols.splice(0, 1);
    if (orderedCols.length == 0) {
      orderedCols = [...orderedColsCopy];
      return shiftBox();
    }

    return true;
  }
}

function shiftBox() {
  if (selectedBox[1] == 0 && selectedBox[0] == cols - 1) {
    selectedBox = [];
    return true;
  }

  selectedBox[0] += 1;
  if (selectedBox[0] == cols) {
    selectedBox[1] -= 1;
    selectedBox[0] = 0;
  }

  getChecking();
  return true;
}

function getChecking() {
  checking = [];

  let x = selectedBox[0];
  let y = selectedBox[1];
  if (x - 2 >= 0) {
    checking.push([x - 2, y]);
  }
  if (x + 2 < cols) {
    checking.push([x + 2, y]);
  }
  if (y - 2 >= 0) {
    checking.push([x, y - 2]);
  }
  if (y + 2 < rows) {
    checking.push([x, y + 2]);
  }
}

function getColOrder() {
  let preferredCol = numRemaining % 4;
  if (preferredCol == 3) {
    colorTable = [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 1]
    let i = randomIndex()
    preferredCol = colorTable[i]
  }

  if (preferredCol == 0) orderedCols = [1, 3, 2];
  else if (preferredCol == 1) orderedCols = [2, 1, 3];
  else orderedCols = [3, 2, 1];
  orderedColsCopy = [...orderedCols];
}
