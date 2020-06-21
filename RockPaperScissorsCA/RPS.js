var randomThreshold = false;

function getNeighbors(cX, cY) {
  let neighbors = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i != 0 || j != 0) {
        neighbors.push([cX + i, cY + j]);
      }
    }
  }

  for (let n of neighbors) {
    if (n[0] < 0) {
      n[0] = 0;
    }
    if (n[0] > gX - 1) {
      n[0] = gX - 1;
    }

    if (n[1] < 0) {
      n[1] = 0;
    }
    if (n[1] > gY - 1) {
      n[1] = gY - 1;
    }
  }
  return neighbors;
}

function changeCell(cX, cY, world) {
  let killers = world[cX][cY][1]

  for (let killer of killers) {
    let kNum = 0;
    for (let n of getNeighbors(cX, cY)) {
      if (world[n[0]][n[1]][0] == killer) {
        kNum += 1;
      }
    }

    let threshold = 3;
    if (randomThreshold) {
      threshold += int(random(0, 4));
    }
    if (kNum >= threshold) {
      for (let i in types){
        if (types[i][0] == killer){
          return types[i];
        }
      }
    }
  }
  return world[cX][cY];
}

function updateGrid() {
  let saveGrid = [];
  for (let i = 0; i < grid.length; i++) {
    saveGrid[i] = [...grid[i]];
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = changeCell(i, j, saveGrid);
    }
  }
}
