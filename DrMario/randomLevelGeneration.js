var virRows = 13;

const E = 0;
const R = 1;
const Y = 2;
const B = 3;
const Colors = [R, Y, B];

function createGrid(){
  bottle = [];
  grid = [];

  setBottle();
  fillBottle();
  for (let i = 0; i < bottle.length; i++){
    grid[i] = [];
    for (let j = 0; j < bottle[i].length; j++){
      if (bottle[i][j] == E){
        grid[i][j] = E;
      }else{
        grid[i][j] = new Virus(j, i, bottle[i][j]);
      }
    }
  }
}

var bottle = [];
function setBottle(){
  bottle = [];
  for (let i = 0; i < rows; i++){
    bottle[i] = [];
    for (let j = 0; j < cols; j++){
      bottle[i][j] = E;
    }
  }
}

function colorIsBlocked(x, y, c){
  if (bottle[y][x] != E) return true;

  if (x - 2 >= 0 && bottle[y][x - 2] == c) return true;
  if (x + 2 < cols && bottle[y][x + 2] == c) return true;

  if (y - 2 >= 0 && bottle[y - 2][x] == c) return true;
  if (y + 2 < rows && bottle[y + 2][x] == c) return true;

  return false;
}

function positionIsBlocked(x, y){
  for (let c of Colors){
    if (!colorIsBlocked(x, y, c)) return false;
  }

  return true;
}

function bottleIsBlocked(){
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      if (!positionIsBlocked(j, i)) {return false}
    }
  }

  return true;
}


function addVirus(x, y, preferedCol){
  let curCol = 0;
  if (positionIsBlocked(x, y)){
    return curCol;
  }

  let orderedCols;

  if (preferedCol == 0) orderedCols = [1, 3, 2];
  else if (preferedCol == 1) orderedCols = [2, 1, 3];
  else orderedCols = [3, 2, 1];

  for (let i = 0; i < orderedCols.length; i++){
    if (!colorIsBlocked(x, y, orderedCols[i])){
      bottle[y][x] = orderedCols[i];
      curCol = orderedCols[i];
      i = Infinity;
    }
  }

  return curCol;
}

function getRandomInt(max) {
  //random int up to (but not including) the max
  return Math.floor(Math.random() * Math.floor(max));
}

function fillBottle(){
  let i = 0;
  let virusAdded = false;
  for (i = 0; i < numVirus; i++){
    if (bottleIsBlocked()) break;

    let cIndex;
    if (i % 4 == 3){
      let j = getRandomInt(16);
      cIndex = [0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,1][j]
    }else{
      cIndex = i % 4;
    }

    virusAdded = false;
    while (!virusAdded){
      let row = getRandomInt(virRows) + 3;
      let col = getRandomInt(cols);

      colorAdded = 0;
      while (colorAdded == 0){
        colorAdded = addVirus(col, row, cIndex);

        col ++;
        if (col == cols){
          col = 0;
          row --;
        }

        if (row < 0) break;
      }
      if (colorAdded > 0){
        virusAdded = true;
      }
    }
  }

  return i;
}
