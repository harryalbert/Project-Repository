var state;
var bottle, rows, cols, virRows, virGoal, pills, level;

const E = 0;
const Y = 1;
const R = 2;
const B = 3;
const Colors = [Y, R, B];

function randomInit(seed) {
  bin = seed.toString(2);

  state = [];
  for (let num of bin) {
    state.push(Number(num));
  }

  let numZeros = 16 - state.length;
  for (let i = 0; i < numZeros; i++) {
    state.unshift(0);
  }
}

function randomIncrement() {
  let bit9 = state[6];
  let bit1 = state[14];

  let newBit;
  if (bit9 != bit1) {
    newBit = 1;
  } else {
    newBit = 0;
  }

  state.unshift(newBit);
  state.splice(state.length - 1, 1);
}

function randomRow(maxValue = 15) {
  randomIncrement();
  let value = 8 * state[4] + 4 * state[5] + 2 * state[6] + state[7];
  while (value > maxValue) {
    randomIncrement();
    value = 8 * state[4] + 4 * state[5] + 2 * state[6] + state[7];
  }
  return value;
}

function randomCol() {
  let value = 4 * state[13] + 2 * state[14] + state[15]
  return value;
}

function randomIndex() {
  randomIncrement();
  value = 8 * state[12] + 4 * state[13] + 2 * state[14] + state[15]
  return value;
}

function initBottle(levelNum) {
  setGlobals(levelNum);
  bottle = [];
  for (let i = 0; i < rows; i++) {
    bottle[i] = [];
    for (let j = 0; j < cols; j++) {
      bottle[i][j] = E;
    }
  }
}

function setGlobals(levelNum) {
  rows = 16;
  cols = 8;

  virRows = 10;
  if (levelNum >= 15) virRows+= 1;
  if (levelNum >= 17) virRows+= 1;
  if (levelNum >= 19) virRows+= 1;

  virGoal = (levelNum + 1) * 4;
}

function isMaximal(){
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      if (available(j, i)) return false;
    }
  }

  return true;
}

function available(x, y){
  for (let c of Colors){
    if (colorIsAvailable(x, y, c)) return true;
  }

  return false;
}

function colorIsAvailable(x, y, c){
  if (bottle[y][x] != E) return false;

  if (x - 2 >= 0 && bottle[y][x - 2] == c) return false;
  if (x + 2 < cols && bottle[y][x + 2] == c) return false;

  if (y - 2 >= 0 && bottle[y - 2][x] == c) return false;
  if (y + 2 < rows && bottle[y + 2][x] == c) return false;

  return true;
}

function addVirus(y, x, preferredCol){
  let curCol = 0;
  if (!available(x, y)){
    return curCol;
  }

  let orderedCols;

  if (preferredCol == 0) orderedCols = [1, 3, 2];
  else if (preferredCol == 1) orderedCols = [2, 1, 3];
  else orderedCols = [3, 2, 1];

  for (let i = 0; i < orderedCols.length; i++){
    if (colorIsAvailable(x, y, orderedCols[i])){
      bottle[y][x] = orderedCols[i];
      curCol = orderedCols[i];
      i = Infinity;
    }
  }

  return curCol;
}


function fillBottle(){
  let numRemaining = virGoal;
  let counter = 0;
  while (numRemaining > 0 && counter < 1000){
    counter += 1;
    if (isMaximal()) break;

    row = randomRow(virRows - 1);
    col = randomCol();

    let preferredCol = numRemaining % 4;
    if (preferredCol == 3){
      colorTable = [0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,1]
      let i = randomIndex()
      preferredCol = colorTable[i]
    }

    while (true){
      let colorAdded = addVirus(row, col, preferredCol);

      if (colorAdded != E){
        numRemaining --;
        break;
      }

      if (row == 0 && col == cols - 1){
        break;
      }

      col ++;
      if (col == cols){
        row --;
        col = 0;
      }
    }
  }

  return numRemaining;
}

function initPills(){
  pills = [];
}

function generatePills(){
  pillTypes = [[Y, Y], [Y, R], [Y, B], [R, Y], [R, B], [R, B], [B, Y], [B, R], [B, B]];

  let type = 0;
  for (let i = 0; i < 128; i++){
    randomIncrement();
    type += 8*state[4] + 4*state[5] + 2*state[6] + 1*state[7]
    type %= 9;

    pill = pillTypes[type];
    pills.unshift(pill);
  }

  pills.push(pills[0]);
  pills.splice(0, 1);

  return pills;
}

function randomGeneration(){
  level = 5;

  let seed0 = str(int(random(0, 255)));
  let seed1 = str(int(random(0, 255)));

  let seed = 256 * parseInt(seed0, 16) + parseInt(seed1, 16);

  randomInit(seed);

  initPills();
  generatePills();

  initBottle(level);
  fillBottle();
}

function createGrid(){
  randomGeneration();

  grid = []
  for (let i = 0; i < bottle.length; i++){
    grid[i] = [];
    for (let j = 0; j < bottle[i].length; j++){
      if (bottle[i][j] == E){
        grid[i][j] = E;
      }else{
        grid[i][j] = new Virus(j, rows - i - 1, bottle[i][j]);
      }
    }
  }
  grid.reverse();
}

// function printPills(){
//   for (let pill of pills){
//     let left = pill[0];
//     let right = pill[1];
//     let pillString;
//
//     if (left == Y) pillString = "Y";
//     if (left == R) pillString = "R";
//     if (left == B) pillString = "B";
//     if (right == Y) pillString += "Y";
//     if (right == R) pillString += "R";
//     if (right == B) pillString += "B";
//
//     console.log(pillString);
//   }
// }
//
// function printRandomState() {
//   let upper1 = 8 * state[0] + 4 * state[1] + 2 * state[2] + state[3];
//   let upper2 = 8 * state[4] + 4 * state[5] + 2 * state[6] + 1 * state[7];
//
//   let lower1 = 8 * state[8] + 4 * state[9] + 2 * state[10] + state[11];
//   let lower2 = 8 * state[12] + 4 * state[13] + 2 * state[14] + 1 * state[15];
//
//   let hexState = upper1.toString(16) + upper2.toString(16) + ", " + lower1.toString(16) + lower2.toString(16);
//   console.log(hexState.toUpperCase());
// }
//
// function printBottle(){
//   for (let i = bottle.length - 1; i >= 0; i--){
//     let lineString = '';
//     for (let j = 0; j < bottle[i].length; j++){
//       if (bottle[i][j] == 0){
//         lineString += '-'
//       }else if (bottle[i][j] == Y){
//         lineString += 'Y'
//       }else if (bottle[i][j] == R){
//         lineString += 'R'
//       }else if (bottle[i][j] == B){
//         lineString += 'B'
//       }
//     }
//     console.log(lineString);
//   }
// }
