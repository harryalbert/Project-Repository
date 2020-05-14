const E = 0;
const X = 1;
const O = 2;

var s;
var lineLen;

var grid = [];

var turn = X;
var winner = undefined;

var b1, b2;
var compTurns = [false, false]; //X = 0, O = 1

var winner = false;
var stalemate = false;

function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight - 30, windowHeight - 30);
  } else {
    createCanvas(windowWidth - 30, windowWidth - 30);
  }
  s = width / 3;
  lineLen = (3 * s / 5) / 2;

  createGrid();
  winnerP = createP();

  b1 = createCheckbox('X = AI', false);
  b2 = createCheckbox('O = AI', false);
  b1.changed(button1);
  b2.changed(button2);

  b1.position(0, 0);
  b2.position(0, 20);
}

function button1(){
  compTurns[0] = !compTurns[0];
  restart();
}

function button2(){
  compTurns[1] = !compTurns[1];
  restart();
}

function createGrid() {
  grid = [];
  for (let i = 0; i < 3; i++) {
    grid[i] = [];
    for (let j = 0; j < 3; j++) {
      grid[i][j] = E;
    }
  }
}

function drawBoard() {
  push();
  stroke(85);
  strokeWeight(6);
  line(s, 20, s, height - 20);
  line(2 * s, 20, 2 * s, height - 20);
  line(20, s, width - 20, s);
  line(20, 2 * s, width - 20, 2 * s);

  strokeWeight(3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] == X) {
        let cX = i * s + s / 2;
        let cY = j * s + s / 2;

        stroke(255, 0, 0);
        line(cX - lineLen, cY - lineLen, cX + lineLen, cY + lineLen);
        line(cX + lineLen, cY - lineLen, cX - lineLen, cY + lineLen);
      } else if (grid[i][j] == O) {
        stroke(0, 0, 255);
        noFill();

        ellipseMode(CENTER);
        ellipse(i * s + s / 2, j * s + s / 2, lineLen * 2, lineLen * 2);
      }
    }
  }
  pop();
}

function switchTurn(t) {
  if (t == X) {
    return O;
  } else {
    return X;
  }
}

function mouseClicked() {
  if (!compTurns[turn - 1] && !winner && !stalemate) {
    let bX = int(mouseX / s);
    let bY = int(mouseY / s);

    if (grid[bX][bY] == E) {
      grid[bX][bY] = turn;
      turn = switchTurn(turn);
      stalemate = checkStalemate();

      winner = checkWin(grid);
    }
  }
}

function checkWin(board){
  for (let i = 0; i < 3; i++){
    if (board[i][0] != E && board[i][0] == board[i][1] && board[i][1] == board[i][2]){
      return board[i][0];
    }
    if (board[0][i] != E && board[0][i] == board[1][i] && board[1][i] == board[2][i]){
      return board[0][i];
    }
  }

  if (board[1][1] != E){
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]){
      return board[0][0];
    }
    if (board[2][0] == board[1][1] && board[1][1] == board[0][2]){
      return board[2][0];
    }
  }
}

function checkStalemate(){
  for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
      if (grid[i][j] == E){
        return false;
      }
    }
  }

  return true;
}

function restart(){
  turn = X;
  createGrid();
  winner = false;
  stalemate = false;
}

function keyTyped(){
  if (key == 'r'){
    restart();
  }
}

function draw() {
  background(225);

  if (compTurns[turn - 1] && !winner && !stalemate){
    let move = startAI(turn, grid);
    grid[move[0]][move[1]] = turn;
    turn = switchTurn(turn);
    stalemate = checkStalemate();

    winner = checkWin(grid);
  }
  drawBoard();

  if (winner || stalemate){
    stroke(0);
    textAlign(CENTER, CENTER);
    textSize(60);
    if (winner == 1){
      text("X wins, press 'r' to restart", width / 2, height / 2);
    }else if (winner == 2){
      text("Y wins, press 'r' to restart", width / 2, height / 2);
    }else{
      text("Stalemate, press 'r' to restart", width / 2, height / 2);
    }
  }
}
