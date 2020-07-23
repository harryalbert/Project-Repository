var keysReleased = [true, true, true];

class Pill {
  constructor() {
    this.x = int(cols / 2) - 1;
    this.y = -1;

    this.type = [
      [pills[0][0], pills[0][1]],
      [E, E]
    ];
    pills.splice(0, 1);
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

    if (this.type[1][0] != E && this.type[1][1] != E) {
      this.type[0] = [...this.type[1]];
      this.type[1] = [E, E];
    }

    if (this.checkCollisions()) {
      this.type = typeCopy;

      let belowGround = false;
      if (this.type[1][0] != E || this.type[1][1] != E) {
        if (this.y + 1 >= rows) {
          belowGround = true;
        }
      }
      if (belowGround) {
        this.y -= 1;
      }
    }
  }

  move() {
    if (keyIsDown(UP_ARROW) && this.y >= 0) {
      if (keysReleased[0]) {
        this.rotate(true);
        keysReleased[0] = false;
      }
    } else {
      keysReleased[0] = true;
    }

    if (keyIsDown(RIGHT_ARROW) && this.y >= 0) {
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
    if (keyIsDown(LEFT_ARROW) && this.y >= 0) {
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
          let x = this.x + j;
          let y = this.y + i;
          if (placing) {
            y += 1;
          }

          if (y >= rows) {
            return true;
          }
          if (x < 0 || x >= cols) {
            return true;
          }
          if (grid[y][x] != E && this.type[i][j] != E) {
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
          let nX = j + this.x;
          let nY = i + this.y;

          grid[nY][nX] = new PlacedPill(nX, nY, this.type[i][j]);
          placedList.push([nY, nX]);

          let nP = grid[nY][nX];
          if (i == 0 && j == 0) {
            //left image
            nP.img = pillImgs[nP.col - 1];
            if (this.type[1][0] != E) {
              nP.rot = 90;
            }else{
              nP.rot = 0;
            }
          } else {
            //right image
            nP.img = pillImgs[nP.col + 2];
            if (i == 1) {
              nP.rot = 90;
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
          let pX = (this.x + j) * s;
          let pY = (this.y + i) * s;

          push();
          translate(pX + s / 2, pY + s / 2);

          let img;
          if (i == 0 && j == 0) {
            //left image
            img = pillImgs[this.type[i][j] - 1]
            if (this.type[1][0] != E) {
              rotate(90);
            }
          } else {
            //right image
            img = pillImgs[this.type[i][j] + 2];
            if (i == 1) {
              rotate(90);
            }
          }

          imageMode(CENTER);
          image(img, 0, 0);
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
    if (this.y + 1 < rows && grid[this.y + 1][this.x] == E) {
      return true;
    }
    return false;
  }

  checkDown() {
    if (this.connectedTo instanceof PlacedPill && this.connectedTo.x != this.x){
      if (this.emptyBelow() && this.connectedTo.emptyBelow()) {
        return true;
      }
    }else{
      if (this.emptyBelow() || (this.connectedTo instanceof PlacedPill && this.connectedTo.emptyBelow())) {
        return true;
      }
    }
  }

  show() {
    imageMode(CENTER);
    push();
    translate(this.x * s + s / 2, this.y * s + s / 2);
    rotate(this.rot);
    image(this.img, 0, 0);
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
    image(this.img, this.x * s + s / 2, this.y * s + s / 2);
  }
}
