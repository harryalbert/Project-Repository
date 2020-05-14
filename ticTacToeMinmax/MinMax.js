function startAI(cTurn, board) {
  let move = -1;
  let score = 100;

  let oTurn = switchTurn(cTurn);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == E) {
        let nBoard = clone(board);
        nBoard[i][j] = cTurn;
        let nScore = minMax(oTurn, nBoard);
        if (nScore < score) {
          move = [i, j];
          score = nScore;
        }
      }
    }
  }

  return move;
}

function minMax(cTurn, board) {
  let oTurn = switchTurn(cTurn);
  let winner = checkWin(board);

  if (winner == cTurn) {
    return 1;
  } else if (winner == oTurn) {
    return -1;
  }

  let move = -1;
  let score = -2;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == E) {
        let newBoard = clone(board);
        newBoard[i][j] = cTurn;
        let nScore = -minMax(oTurn, newBoard);

        if (nScore > score) {
          score = nScore;
          move = [i, j];
        }
      }
    }
  }

  if (move == -1) {
    return 0;
  }

  if (score < 0){
     score += 0.05;
  }else if (score > 0){
     score -= 0.05;
  }
  return score;
}

function clone(arr) {
  let newArr = [];
  for (let i = 0; i < 3; i++) {
    newArr[i] = [];
    for (let j = 0; j < 3; j++) {
      newArr[i][j] = arr[i][j];
    }
  }
  return newArr;
}
