var keysReleased = [true, true, true];

class Pill {
  constructor() {
    this.x = int(gX / 2) - 1;
    this.y = -1;

    this.type = [
      [int(random(1, 4)), E],
      [int(random(1, 4)), E]
    ];
  }

  rotate(clockwise) {
    let typeCopy = [];
    typeCopy[0] = [...this.type[0]];
    typeCopy[1] = [...this.type[1]];

    if (clockwise) { //clockwise
      this.type[0][0] = typeCopy[0][1];
      this.type[1][0] = typeCopy[0][0];
      this.type[1][1] = typeCopy[1][0];
      this.type[0][1] = typeCopy[1][1];
    } else { //counter clockwise
      this.type[0][0] = typeCopy[1][0];
      this.type[1][0] = typeCopy[1][1];
      this.type[1][1] = typeCopy[0][1];
      this.type[0][1] = typeCopy[0][0];
    }

    if (this.type[0][1] != E && this.type[1][1] != E) {
      this.type[0][0] = this.type[0][1];
      this.type[1][0] = this.type[1][1];
      this.type[0][1] = this.type[1][1] = E;
    }

    if (this.checkCollisions()) {
      this.type = typeCopy;

      let belowGround = false;
      for (let i = 0; i < 2; i++) {
        if (this.type[i][1] != E) {
          if (this.y + 1 >= gY) {
            belowGround = true;
          }
        }
      }
      if (belowGround) {
        this.y -= 1;
      }
    }
  }

  move() {
    if (keyIsDown(UP_ARROW)) {
      if (keysReleased[0]) {
        this.rotate(true);
        keysReleased[0] = false;
      }
    } else {
      keysReleased[0] = true;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      if (keysReleased[1]) {
        this.x += 1;
        keysReleased[1] = false;

        if (this.checkCollisions()) {
          this.x -= 1;
        }
      }
    } else {
      keysReleased[1] = true;
    }
    if (keyIsDown(LEFT_ARROW)) {
      if (keysReleased[2]) {
        this.x -= 1;
        keysReleased[2] = false;

        if (this.checkCollisions()) {
          this.x += 1;
        }
      }
    } else {
      keysReleased[2] = true;
    }

    if (keyIsDown(DOWN_ARROW)) {
      refreshCounter += refreshRate / 8;
    }
  }

  checkCollisions(placing = false) {
    for (let i = 0; i < this.type.length; i++) {
      for (let j = 0; j < this.type[i].length; j++) {
        if (this.type[i][j] != E) {
          let x = this.x + i;
          let y = this.y + j;
          if (placing) {
            y += 1;
          }

          if (y >= gY) {
            return true;
          }
          if (x < 0 || x >= gX) {
            return true;
          }
          if (grid[x][y] != E && this.type[i][j] != E) {
            return true;
          }
        }
      }
    }
    return false;
  }

  place() {
    let placedList = [];
    for (let i = 0; i < this.type.length; i++) {
      for (let j = 0; j < this.type[i].length; j++) {
        if (this.type[i][j] != E) {
          let nX = i + this.x;
          let nY = j + this.y;

          grid[nX][nY] = new PlacedPill(nX, nY, this.type[i][j]);
          placedList.push([nX, nY]);

          let nP = grid[nX][nY];
          if (i == 1 && j == 0) {
            nP.img = pillImgs[nP.col + 2];
            if (this.type[0][0] == E) {
              nP.rot = 270;
            }else{
              nP.rot = 0;
            }
          } else {
            nP.img = pillImgs[nP.col - 1];
            if (i == 1) {
              nP.rot = 270;
            }else{
              nP.rot = 0;
            }
          }
        }
      }
    }

    let p1 = grid[placedList[0][0]][placedList[0][1]];
    let p2 = grid[placedList[1][0]][placedList[1][1]];
    p1.connectedTo = p2;
    p2.connectedTo = p1;
  }

  update() {
    if (this.checkCollisions(true)) {
      this.place();
      erasePills();
      movePillsDown = true;
    } else {
      this.y += 1;
    }
  }

  show() {
    this.move();
    for (let i = 0; i < this.type.length; i++) {
      for (let j = 0; j < this.type[i].length; j++) {
        if (this.type[i][j] != E) {
          let pX = (this.x + i) * s;
          let pY = (this.y + j) * s;

          push();
          translate(pX + s / 2, pY + s / 2);

          let img;
          if (i == 1 && j == 0) {
            img = pillImgs[this.type[i][j] + 2]
            if (this.type[0][0] == E) {
              rotate(270);
            }
          } else {
            img = pillImgs[this.type[i][j] - 1];
            if (i == 1) {
              rotate(270);
            }
          }

          imageMode(CENTER);
          image(img, 0, 0, s, s);
          pop();
        }
      }
    }
  }
}


class PlacedPill {
  constructor(x, y, col, rot) {
    this.connectedTo;
    this.x = x;
    this.y = y;
    this.col = col;
    this.img;
    this.rot = rot;
  }

  emptyBelow() {
    if (this.y + 1 < gY && grid[this.x][this.y + 1] == E) {
      return true;
    }
    if (this.connectedTo.y == this.y + 1) {
      return true;
    }
    return false;
  }

  checkDown() {
    if (this.emptyBelow() && this.connectedTo instanceof PlacedPill && this.connectedTo.emptyBelow()) {
      return true;
    }
  }

  show() {
    imageMode(CENTER);
    push();
    translate(this.x * s + s / 2, this.y * s + s / 2);
    rotate(this.rot);
    image(this.img, 0, 0, s, s);
    pop();
  }
}


class Virus {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.img = virusImgs[this.col - 1];
  }

  show() {
    imageMode(CENTER);
    image(this.img, this.x * s + s / 2, this.y * s + s / 2, s, s);
  }
}
