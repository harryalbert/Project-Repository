class cell {
  constructor(x, y) {
    //walls start at top, then go clockwise
    this.walls = [true, true, true, true];
    this.x = x;
    this.y = y;
    this.visited = false;
    this.clicked = false;
  }

  checkNeighbors() {
    let x = this.x;
    let y = this.y;
    let neighbors = [];

    if (this.x > 0) {
      if (!grid[x - 1][y].visited) {
        neighbors.push(grid[x - 1][y]);
      }
    }
    if (this.x < cols - 1) {
      if (!grid[x + 1][y].visited) {
        neighbors.push(grid[x + 1][y]);
      }
    }
    if (this.y > 0) {
      if (!grid[x][y - 1].visited) {
        neighbors.push(grid[x][y - 1]);
      }
    }
    if (this.y < rows - 1) {
      if (!grid[x][y + 1].visited) {
        neighbors.push(grid[x][y + 1]);
      }
    }

    return neighbors;
  }

  show() {
    let x1 = this.x * w;
    let y1 = this.y * h;
    let x2 = x1 + w;
    let y2 = y1 + h;

    if (this.clicked){
      noStroke();
      fill(200, 0, 200);
      rect(x1, y1, w, h);
    }

    stroke(0);
    if (this.walls[0]) {
      line(x1, y1, x2, y1);
    }
    if (this.walls[1]) {
      line(x2, y1, x2, y2);
    }
    if (this.walls[2]) {
      line(x2, y2, x1, y2);
    }
    if (this.walls[3]) {
      line(x1, y2, x1, y1);
    }
  }
}

function removeWall(x1, y1, x2, y2) {
  let cell1 = grid[x1][y1];
  let cell2 = grid[x2][y2];
  if (x1 - x2 == 1) {
    cell1.walls[3] = false;
    cell2.walls[1] = false;
  }
  if (x1 - x2 == -1) {
    cell1.walls[1] = false;
    cell2.walls[3] = false;
  }
  if (y1 - y2 == 1) {
    cell1.walls[0] = false;
    cell2.walls[2] = false;
  }
  if (y1 - y2 == -1) {
    cell1.walls[2] = false;
    cell2.walls[0] = false;
  }
}
