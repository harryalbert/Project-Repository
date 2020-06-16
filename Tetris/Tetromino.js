var fallSpeed = 17;

var arrowKeys;
var arrowsReleased;
var pieceSwitched = false;

class Piece {
  constructor(shape) {
    this.permaShape = shape;

    let colIndex = getIndex(this.permaShape);
    this.col = [colors[colIndex]];

    this.shape = [];
    for (let i = 0; i < shape.length; i++) {
      this.shape[i] = [];
      for (let j = 0; j < shape[i].length; j++) {
        this.shape[i][j] = shape[i][j];
      }
    }

    this.x = Math.round((gridX / 2) - (this.shape.length / 2));
    this.y = -this.shape.length;

    this.falling = true;
    this.placeBuffer = 25;
    this.counter = 1;

    arrowKeys = [UP_ARROW, RIGHT_ARROW, LEFT_ARROW];
    arrowsReleased = [true, true, true];
  }

  rot() {
    let n = this.shape.length;
    let x = Math.floor(n / 2);
    let y = n - 1;

    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        let k = this.shape[i][j];
        this.shape[i][j] = this.shape[y - j][i];
        this.shape[y - j][i] = this.shape[y - i][y - j];
        this.shape[y - i][y - j] = this.shape[j][y - i]
        this.shape[j][y - i] = k
      }
    }

    this.boarderCollision();
    while (this.pieceCollision()) {
      this.y -= 1;
    }
  }

  movement() {
    for (let i = 0; i < arrowKeys.length; i++) {
      if (!keyIsDown(arrowKeys[i])) {
        arrowsReleased[i] = true;
      }
    }

    if (keyIsDown(UP_ARROW) && arrowsReleased[0]) {
      this.rot();
      arrowsReleased[0] = false;
    }

    if (keyIsDown(RIGHT_ARROW) && arrowsReleased[1]) {
      this.x += 1;
      this.boarderCollision();
      if (this.pieceCollision()) {
        this.x -= 1;
      }
      arrowsReleased[1] = false;
    }
    if (keyIsDown(LEFT_ARROW) && arrowsReleased[2]) {
      this.x -= 1;
      this.boarderCollision();
      if (this.pieceCollision()) {
        this.x += 1;
      }
      arrowsReleased[2] = false;
    }
    if (keyIsDown(DOWN_ARROW) && this.counter % fallSpeed != 0) {
      this.counter = fallSpeed - 1;
    }
  }

  boarderCollision() {
    let xShift = 0;
    let collided = false;

    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] == 1) {
          let xPos = j + this.x;
          let yPos = i + this.y;

          if (xPos < 0) {
            xShift = -xPos;
          } else if (xPos > gridX - 1) {
            xShift = (gridX - 1) - xPos;
          }

          if (this.y > 0 && i + this.y >= gridY - 1) {
            collided = true;
          }
          if (yPos >= 0 && yPos < gridY - 1 && xPos >= 0 && xPos < gridX) {
            if (grid[xPos][yPos + 1] != E) {
              collided = true;
            }
          }
        }
      }
    }

    this.x += xShift;
    return collided;
  }

  pieceCollision() {
    let xShift = 0;
    let collided = false;

    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] == 1) {
          let xPos = j + this.x;
          let yPos = i + this.y;
          if (yPos >= 0 && yPos < gridY) {
            if (grid[xPos][yPos] != E) {
              collided = true;
            }
          }
        }
      }
    }
    return collided;
  }


  place() {
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] == 1) {
          grid[j + this.x][i + this.y] = F;
          colorGrid[[j + this.x, i + this.y]] = [...this.col];
        }
      }
    }

    if (this.y < 0) {
      gameOver = true;
    } else {
      lineWipe();
      currentPiece = new Piece(nextPieces[0]);
      nextPieces.splice(0, 1);
      nextPieces.push(random(pieces));

      pieceSwitched = false;
    }
  }

  fall() {
    let stopped = false;
    while (!stopped) {
      if (this.pieceCollision() || this.boarderCollision()) {
        stopped = true;
      } else {
        this.y += 1;
        score += 1;
      }
    }
    this.place();
  }

  ghostPiece() {
    let stopped = false;
    let finalY = this.y - 1;
    while (!stopped) {
      for (let i = 0; i < this.shape.length; i++) {
        for (let j = 0; j < this.shape[i].length; j++) {
          if (this.shape[i][j] == 1) {
            if (finalY > 0 && i + finalY >= gridY - 2) {
              stopped = true;
            }

            let xPos = j + this.x;
            let yPos = i + finalY;
            if (yPos >= 0 && yPos < gridY - 1 && xPos >= 0 && xPos < gridX) {
              if (grid[xPos][yPos + 2] != E) {
                stopped = true;
              }
            }
          }
        }
      }
      finalY += 1;
    }

    push();
    strokeWeight(2);
    stroke(this.col[0], this.col[1], this.col[2]);
    noFill();
    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] == 1) {
          rect((j + this.x) * w, (i + finalY) * h, w, h);
        }
      }
    }
    pop();
  }

  show() {
    if (this.falling) {
      this.ghostPiece();
    }

    stroke(180);
    fill(this.col[0], this.col[1], this.col[2]);

    for (let i = 0; i < this.shape.length; i++) {
      for (let j = 0; j < this.shape[i].length; j++) {
        if (this.shape[i][j] == 1) {
          rect((j + this.x) * w, (i + this.y) * h, w, h);
        }
      }
    }
  }

  update() {
    let pc = this.pieceCollision();
    let bc = this.boarderCollision();
    if (pc || bc) {
      this.falling = false;
    } else {
      this.falling = true;
    }

    if (this.falling) {
      this.counter++;
      if (this.counter % fallSpeed == 0) {
        this.y += 1;
        score += 1;
      }
      this.movement();
    } else {
      this.movement();
      this.placeBuffer--;
      if (this.placeBuffer <= 0) {
        this.place();
      }
    }
    this.show();
  }
}

function holdPiece() {
  if (heldPiece) {
    placeHolder = currentPiece.permaShape;

    currentPiece = new Piece(heldPiece);
    heldPiece = placeHolder;
  } else {
    heldPiece = currentPiece.permaShape;

    currentPiece = new Piece(nextPieces[0]);
    nextPieces.splice(0, 1);
    nextPieces.push(random(pieces));
  }
}

function getIndex(shape) {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i] == shape) {
      return i;
    }
  }
}

function keyTyped() {
  if (key == ' ') {
    currentPiece.fall();
  }
  if (key == 'p') {
    pause = !pause;
  }
  if (key == 'r') {
    restart();
  }
}

function keyPressed() {
  if (key == 'A' && !pieceSwitched) {
    holdPiece();
    pieceSwitched = true;
  }
}

//all tetromino grid styles
const O = [
  [1, 1],
  [1, 1]
];
const I = [
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0]
];
const S = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0]
];
const Z = [
  [1, 1, 0],
  [0, 1, 1],
  [0, 0, 0]
];
const L = [
  [1, 0, 0],
  [1, 0, 0],
  [1, 1, 0]
];
const J = [
  [0, 1, 0],
  [0, 1, 0],
  [1, 1, 0]
];
const T = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 0]
];
const pieces = [O, I, S, Z, L, J, T];
var colors = [
  [255, 255, 0],
  [0, 255, 255],
  [0, 255, 0],
  [255, 0, 0],
  [255, 153, 51],
  [0, 0, 255],
  [127, 0, 255]
];
