function BB(cX, cY, world){
  if (world[cX][cY] == A){
    return M;
  }
  if (world[cX][cY] == M){
    return D;
  }

  let neighbors = getNeighbors(cX, cY);
  let aliveCount = 0;
  for (let n of neighbors){
    if (world[n[0]][n[1]] == A){
      aliveCount += 1;
    }
  }

  if (aliveCount == 2){
    return A;
  }
}
