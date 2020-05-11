var openSet = [];
var closedSet = [];
var path = [];
var start;
var end;

var done = false;

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.x, a.y, b.x, b.y);
  return d;
}

function printGrid(){
  let nGrid = [];
  for (var i = 0; i < cols; i++) {
    nGrid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      nGrid[i][j] = 0;
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (grid[i][j].wall){
        nGrid[i][j] = 1;
      }
    }
  }

  console.table(nGrid);
}

function Spot(x, y) {
  this.x = x;
  this.y = y;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (randomWalls) {
    if (random(1) < 0.4) {
      this.wall = true;
    }
  }

  this.show = function(c) {
    fill(c);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(this.x * w, this.y * h, w - 1, h - 1);
  }

  this.addNeighbors = function(grid) {
    var x = this.x;
    var y = this.y;

    if (x < cols - 1) {
      this.neighbors.push(grid[x + 1][y]);
    }
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y]);
    }
    if (y < rows - 1) {
      this.neighbors.push(grid[x][y + 1]);
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1]);
    }

    if (x > 0 && y > 0) {
      this.neighbors.push(grid[x - 1][y - 1]);
    }
    if (x < cols - 1 && y > 0) {
      this.neighbors.push(grid[x + 1][y - 1]);
    }
    if (x > 0 && y < rows - 1) {
      this.neighbors.push(grid[x - 1][y + 1]);
    }
    if (x < cols - 1 && y < rows - 1) {
      this.neighbors.push(grid[x + 1][y + 1]);
    }
  }
}



function aCycle() {
  if (openSet.length > 0) {
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    if (current == end) {

      done = true;
      console.log("done!");
    }


    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

  } else {
    console.log('no solution');
    done = true;
    return;
  }

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
}

function reset() {
  grid = undefined;
  grid = new Array(cols);
  openSet = [];
  closedSet = [];
  path = [];
  start;
  end;
  beginSearch = false;
  done = false;
  setup();
}
