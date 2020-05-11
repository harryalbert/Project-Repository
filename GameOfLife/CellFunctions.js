var randAlive = false;

function cell(x, y) {
  this.x = x;
  this.y = y;

  this.alive = false;
  this.neighbors = [];
  this.prox = 0;

  this.checkState = function() {
    this.prox = 0;

    for (var i = 0; i < this.neighbors.length; i++) {
      if (this.neighbors[i].alive) {
        this.prox += 1;
      }
    }
  }

  this.addNeighbors = function() {
    let x = this.x;
    let y = this.y;

    if (x < gridX - 1) {
      this.neighbors.push(grid[x + 1][y]);
    }
    if (x > 0) {
      this.neighbors.push(grid[x - 1][y]);
    }
    if (y < gridY - 1) {
      this.neighbors.push(grid[x][y + 1]);
    }
    if (y > 0) {
      this.neighbors.push(grid[x][y - 1]);
    }

    if (x > 0 && y > 0) {
      this.neighbors.push(grid[x - 1][y - 1]);
    }
    if (x < gridX - 1 && y > 0) {
      this.neighbors.push(grid[x + 1][y - 1]);
    }
    if (x > 0 && y < gridY - 1) {
      this.neighbors.push(grid[x - 1][y + 1]);
    }
    if (x < gridX - 1 && y < gridY - 1) {
      this.neighbors.push(grid[x + 1][y + 1]);
    }
  }

  this.draw = function() {
    stroke(150);
    fill(0);
    if (this.alive) {
      fill(255);
    }
    rect(this.x * w, this.y * h, w, h);
  }

  this.killOrBe = function(){
    if (this.prox < 2) {
      this.alive = false;
    }
    if (this.prox == 3) {
      this.alive = true;
    }
    if (this.prox > 3) {
      this.alive = false;
    }
  }

  this.update = function() {
    this.killOrBe();
    this.draw();
  }
}
