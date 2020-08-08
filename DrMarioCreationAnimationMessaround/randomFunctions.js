var state;
var grid, rows, cols, virRows, virGoal;
var pills = [];

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

function setGlobals() {
  rows = 16;
  cols = 8;

  virRows = 10;
  if (level >= 15) virRows+= 1;
  if (level >= 17) virRows+= 1;
  if (level >= 19) virRows+= 1;

  virGoal = (level + 1) * 4;
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
    if (!colorIsAvailable(x, y, c)) return true;
  }

  return false;
}

function colorIsAvailable(x, y, c){
  if (x - 2 >= 0 && grid[y][x - 2] == c) return [x - 2, y];
  if (x + 2 < cols && grid[y][x + 2] == c) return [x + 2, y];

  if (y - 2 >= 0 && grid[y - 2][x] == c) return [x, y - 2];
  if (y + 2 < rows && grid[y + 2][x] == c) return [x, y + 2];

  return false;
}

function initPills(){
  pills = [];
}

function generatePills(){
  pillTypes = [[Y, Y], [Y, R], [Y, B], [R, Y], [R, B], [R, B], [B, Y], [B, R], [B, B]];
  pills = [];

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

  displayPills = [];
  let y = s / 2;
  for (i = 0; i < pills.length; i++){
    displayPills.push(new displayPill(y, pills[i][0], pills[i][1], i));
    y += s * (3 / 2);
  }

  return pills;
}

function resetGrid(){
  grid = [];
  pills = [];
  selectedBox = [];
  numVirus = virGoal;

  for (let i = 0; i < rows; i++){
    grid[i] = [];
    for (let j = 0; j < cols; j++){
      grid[i][j] = E;
    }
  }
}
