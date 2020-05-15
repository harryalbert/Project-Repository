var possibilities = {}; //list of all possible numbers for each space
var cSpace; //marks current space to work on

var allNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //list of all possible numbers for copying
var initBoard = true; //indicates whether or not the board is being created

function inList(list, item) {
  //checks if a tupple is in a list (for some reason couldn't use the ".includes()" function)
  for (var i = 0; i < list.length; i++) {
    if (list[i][0] == item[0] && list[i][1] == item[1]) {
      return true;
    }
  }

  return false;
}

function findEmpty() {
  //finds first empty space in the board
  for (let j = 0; j < 9; j++) {
    for (let i = 0; i < 9; i++) {
      if (!inList(constants, [i, j])) {
        return ([i, j]);
      }
    }
  }

  return false;
}

function checkIfLegal(x, y, num) {
  //checks if a move is legal
  for (let i = 0; i < 9; i++) {
    if (i != y && grid[x][i] == num){ //checking the move's column
      return false;
    }
    if (i != x && grid[i][y] == num){ //checking the move's row
      return false;
    }
  }

  //find the top right corner of the move's box
  let bX = x;
  let bY = y;
  while (bX % 3 != 0) {
    bX -= 1;
  }
  while (bY % 3 != 0) {
    bY -= 1;
  }

  //checks the move's box
  for (let i = bX; i < bX + 3; i++) {
    for (let j = bY; j < bY + 3; j++) {
      if (i != x || j != y) {
        if (grid[i][j] == num) {
          return false
        }
      }
    }
  }

  return true;
}

function shiftCurrent(x, y, dir) {
  //shifts current space either forward or backward (if dir = 1 or -1)

  x += dir;

  //if x goes past row's boundaries, move y either up or down, reset x
  if (x < 0) {
    x = 8;
    y -= 1;
  }
  if (x > 8) {
    x = 0;
    y += 1;
  }

  //if board is either finished or run out of possibilities, stop creating board
  if (y < 0 || y > 8) {
    initBoard = false;
  }

  newSpace = [x, y];
  if (inList(constants, [x, y])) {
    //for when the computer is solving a board, makes sure the computer is not changing an origonal space
    //if it is, we just keep going forward/backward until we hit an empty space
    newSpace = shiftCurrent(newSpace[0], newSpace[1], dir);
  }

  return newSpace;
}

function solveGrid() {
  //solves grid (either to create a new grid, or solve a created grid)
  if (!cSpace) {
    //for starting up, finds the first empty space
    cSpace = findEmpty();
    if (!cSpace) {
      //if there is no empty space, we're done
      initBoard = false;
      return;
    }

    //marks first space's possibilities as all numbers
    possibilities[cSpace] = [...allNumbers];
  }

  //shifts space forward if it is already full
  if (grid[cSpace[0]][cSpace[1]]) {
    cSpace = shiftCurrent(cSpace[0], cSpace[1], 1);
    return;
  }

  //if there are no possible numbers to use, goes back to the previous space
  if (possibilities[cSpace].length == 0) {
    grid[cSpace[0]][cSpace[1]] = false;
    cSpace = shiftCurrent(cSpace[0], cSpace[1], -1);
    grid[cSpace[0]][cSpace[1]] = false;
  } else {
    //chooses a random possibility for the space
    let cIndex = int(random(possibilities[cSpace].length));
    let cChoice = possibilities[cSpace][cIndex];
    possibilities[cSpace].splice(cIndex, 1);

    //if the chosen possibility is wrong, choses another one
    while (!checkIfLegal(cSpace[0], cSpace[1], cChoice)) {
      //if we run out of possibilites, shift back one space
      if (possibilities[cSpace].length <= 0) {
        grid[cSpace[0]][cSpace[1]] = false;
        cSpace = shiftCurrent(cSpace[0], cSpace[1], -1);
        grid[cSpace[0]][cSpace[1]] = false;
        return;
      }

      cIndex = int(random(possibilities[cSpace].length));
      cChoice = possibilities[cSpace][cIndex];
      possibilities[cSpace].splice(cIndex, 1);
    }
    grid[cSpace[0]][cSpace[1]] = cChoice;

    //shifts space forward, sets that space to have all possible numbers
    cSpace = shiftCurrent(cSpace[0], cSpace[1], 1);
    possibilities[cSpace] = [...allNumbers];
  }
}

function restart() {
  //resets everything
  possibilities = {};
  cSpace = undefined;
  initBoard = true;
  constants = [];
  numBlanks = 45;
  createBoard = true;
  selected = undefined;

  grid = [];
  createGrid();
}
