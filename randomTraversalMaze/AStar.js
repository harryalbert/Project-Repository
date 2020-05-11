var openList = [];
var closedList = [];
var route = [];
var goal;
var start;

var g = [cols - 1, 0];

function aStar() {
  let minF = 100000;
  let curCell;
  let curIndex;
  for (var i = 0; i < openList.length; i++) {
    let c = openList[i];
    if (c.f < minF) {
      curCell = c;
      minF = c.f;
      curIndex = i;
    }
  }

  openList.splice(curIndex, 1);
  curCell.getNeighbors();
  for (let neighbor of curCell.neighbors) {
    neighbor.par = curCell;
    if (neighbor.x == goal.x && neighbor.y == goal.y) {
      openList = [];
      closedList.push(neighbor);
      constructPath();
      break;
    }
    neighbor.g = curCell.g + 1;
    neighbor.f = neighbor.g + neighbor.h;

    let better = false;
    for (let node of openList) {
      if (node.x == neighbor.x && node.y == neighbor.y) {
        if (node.f <= neighbor.f) {
          better = true;
        }
      }
    }
    for (let node of closedList) {
      if (node.x == neighbor.x && node.y == neighbor.y) {
        if (node.f <= neighbor.f) {
          better = true;
        }
      }
    }

    if (!better) {
      openList.push(neighbor);
    }
  }
  closedList.push(curCell);
}

function constructPath() {
  route = [];
  if (openList.length == 0) {
    route = [goal];
  }
  let curCell = closedList[closedList.length - 1];
  route.push(curCell);
  while (curCell.par) {
    route.push(curCell.par);
    curCell = curCell.par;
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.h = dist(this.x, this.y, g[0], g[1]);
    this.g, this.f;
    this.par, this.neighbors;
  }

  getNeighbors() {
    let tempNeighbors = [];
    if (this.x > 0) {
      tempNeighbors.push(new Cell(this.x - 1, this.y));
      if (this.y > 0) {
        tempNeighbors.push(new Cell(this.x - 1, this.y - 1));
      }
      if (this.y < rows - 1) {
        tempNeighbors.push(new Cell(this.x - 1, this.y + 1));
      }
    }
    if (this.x < cols - 1) {
      tempNeighbors.push(new Cell(this.x + 1, this.y));
      if (this.y > 0) {
        tempNeighbors.push(new Cell(this.x + 1, this.y - 1));
      }
      if (this.y < rows - 1) {
        tempNeighbors.push(new Cell(this.x + 1, this.y + 1));
      }
    }
    if (this.y > 0) {
      tempNeighbors.push(new Cell(this.x, this.y - 1));
    }
    if (this.y < rows - 1) {
      tempNeighbors.push(new Cell(this.x, this.y + 1));
    }

    this.neighbors = [];
    for (let neighbor of tempNeighbors) {
      if (grid[neighbor.x][neighbor.y] == P) {
        this.neighbors.push(neighbor);
      }
    }
  }

  show(c) {
    stroke(c);
    fill(c);
    rect(this.x * w, this.y * w, w, w);
  }
}

function keyTyped() {
  if (key == 's') {
    if (!solve) {
      solve = true;
      goal = new Cell(g[0], g[1]);
      start = new Cell(0, rows - 1);
      start.g = 0;
      start.f = 0;
      openList.push(start);
    }
  }
}
