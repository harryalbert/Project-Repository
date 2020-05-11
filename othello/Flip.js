function placePiece(x, y) {
  if (checkPiece(x, y, turn)) {
    let o;
    if (turn == W) {
      o = B;
    } else {
      o = W;
    }
    grid[x][y] = turn;

    let cX = x;
    let cY = y;

    //left
    cX -= 1;
    while (cX >= 0) {
      if (grid[cX][y] == turn) {
        for (var i = cX; i < x; i++) {
          grid[i][y] = turn;
        }
        break;
      }
      if (grid[cX][y] == E) {
        break;
      }
      cX -= 1;
    }

    //right
    cX = x + 1;
    cY = y;
    while (cX < gridSize - 1) {
      if (grid[cX][y] == turn) {
        for (var i = x; i < cX; i++) {
          grid[i][y] = turn;
        }
        break;
      }
      if (grid[cX][y] == E) {
        break;
      }
      cX += 1;
    }

    //up
    cX = x;
    cY = y - 1;
    while (cY >= 0) {
      if (grid[x][cY] == turn) {
        for (var i = cY; i < y; i++) {
          grid[x][i] = turn;
        }
        break;
      }
      if (grid[x][cY] == E) {
        break;
      }
      cY -= 1;
    }

    //down
    cX = x;
    cY = y + 1;
    while (cY < gridSize - 1) {
      if (grid[x][cY] == turn) {
        for (var i = y; i < cY; i++) {
          grid[x][i] = turn;
        }
        break;
      }
      if (grid[x][cY] == E) {
        break;
      }
      cY += 1;
    }

    //up, right
    cX = x + 1;
    cY = y + 1;
    while (cX < gridSize - 1 && cY < gridSize - 1) {
      if (grid[cX][cY] == turn) {
        for (i = 0; i <= abs(cX - x); i++) {
          grid[x + i][y + i] = turn;
        }
        break;
      }
      if (grid[cX][cY] == E) {
        break;
      }
      cX += 1;
      cY += 1;
    }

    //up, left
    cX = x - 1;
    cY = y + 1;
    while (cX >= 0 && cY < gridSize - 1) {
      if (grid[cX][cY] == turn) {
        for (i = 0; i <= abs(cX - x); i++) {
          grid[x - i][y + i] = turn;
        }
        break;
      }
      if (grid[cX][cY] == E) {
        break;
      }
      cX -= 1;
      cY += 1;
    }

    //down, right
    cX = x + 1;
    cY = y - 1;
    while (cX < gridSize - 1 && cY >= 0) {
      if (grid[cX][cY] == turn) {
        for (i = 0; i <= abs(cX - x); i++) {
          grid[x + i][y - i] = turn;
        }
        break;
      }
      if (grid[cX][cY] == E) {
        break;
      }
      cX += 1;
      cY -= 1;
    }

    //down, left
    cX = x - 1;
    cY = y - 1;
    while (cX >= 0 && cY >= 0) {
      if (grid[cX][cY] == turn) {
        for (i = 0; i <= abs(cX - x); i++) {
          grid[x - i][y - i] = turn;
        }
        break;
      }
      if (grid[cX][cY] == E) {
        break;
      }
      cX -= 1;
      cY -= 1;
    }

    turn = o;
    getPosMoves();
    getScore();
  }
}

function checkFlips(x, y) {
  let o;
  if (turn == W) {
    o = B;
  } else {
    o = W;
  }

  let cX = x;
  let cY = y;

  //left
  cX -= 1;
  while (cX >= 0) {
    if (grid[cX][y] == turn) {
      for (var i = cX; i < x; i++) {
        if (grid[i][y] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[cX][y] == E) {
      break;
    }
    cX -= 1;
  }

  //right
  cX = x + 1;
  cY = y;
  while (cX < gridSize - 1) {
    if (grid[cX][y] == turn) {
      for (var i = x; i < cX; i++) {
        if (grid[i][y] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[cX][y] == E) {
      break;
    }
    cX += 1;
  }

  //up
  cX = x;
  cY = y - 1;
  while (cY >= 0) {
    if (grid[x][cY] == turn) {
      for (var i = cY; i < y; i++) {
        if (grid[x][i] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[x][cY] == E) {
      break;
    }
    cY -= 1;
  }

  //down
  cX = x;
  cY = y + 1;
  while (cY < gridSize - 1) {
    if (grid[x][cY] == turn) {
      for (var i = y; i < cY; i++) {
        if (grid[x][i] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[x][cY] == E) {
      break;
    }
    cY += 1;
  }

  //up, right
  cX = x + 1;
  cY = y + 1;
  while (cX < gridSize - 1 && cY < gridSize - 1) {
    if (grid[cX][cY] == turn) {
      for (i = 0; i <= abs(cX - x); i++) {
        if (grid[x + i][y + i] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[cX][cY] == E) {
      break;
    }
    cX += 1;
    cY += 1;
  }

  //up, left
  cX = x - 1;
  cY = y + 1;
  while (cX >= 0 && cY < gridSize - 1) {
    if (grid[cX][cY] == turn) {
      for (i = 0; i <= abs(cX - x); i++) {
        if (grid[x - i][y + i] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[cX][cY] == E) {
      break;
    }
    cX -= 1;
    cY += 1;
  }

  //down, right
  cX = x + 1;
  cY = y - 1;
  while (cX < gridSize - 1 && cY >= 0) {
    if (grid[cX][cY] == turn) {
      for (i = 0; i <= abs(cX - x); i++) {
        if (grid[x + i][y - i] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[cX][cY] == E) {
      break;
    }
    cX += 1;
    cY -= 1;
  }

  //down, left
  cX = x - 1;
  cY = y - 1;
  while (cX >= 0 && cY >= 0) {
    if (grid[cX][cY] == turn) {
      for (i = 0; i <= abs(cX - x); i++) {
        if (grid[x - i][y - i] == o) {
          return true;
        }
      }
      break;
    }
    if (grid[cX][cY] == E) {
      break;
    }
    cX -= 1;
    cY -= 1;
  }
}
