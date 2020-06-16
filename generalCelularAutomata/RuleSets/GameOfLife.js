function GOL(cX, cY, world) {
  let neighbors = getNeighbors(cX, cY);
  let aCount = 0;

  for (let n of neighbors) {
    if (world[n[0]][n[1]] == A) {
      aCount += 1;
    }
  }

  if (aCount == 3 || (aCount == 2 && world[cX][cY] == A)) {
    return A;
  } else {
    return D;
  }
}
