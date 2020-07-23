var pillImgs = [];
var virusImgs = [];
var backgroundImg, pillBottleImg, clipboardImg1, clipboardImg2, magnifyingGlassImg, pillBottleImg, titleImg, marioWindowImg;
var gameFont;

var clipboard1Y, clipboard2X, clipboard2Y, magnifyingGlassY, pillBottleX, pillBottleY, titleX, titleY, marioWindowX, marioWindowY;

function preload() {
  //L = left, R = Right
  //R = Red, Y = yellow, B = blue
  pillImgs.push(loadImage('assets/LY.png'));
  pillImgs.push(loadImage('assets/LR.png'));
  pillImgs.push(loadImage('assets/LB.png'));
  pillImgs.push(loadImage('assets/RY.png'));
  pillImgs.push(loadImage('assets/RR.png'));
  pillImgs.push(loadImage('assets/RB.png'));

  virusImgs.push(loadImage('assets/YellowVirus.png'));
  virusImgs.push(loadImage('assets/RedVirus.png'));
  virusImgs.push(loadImage('assets/BlueVirus.png'));

  backgroundImg = loadImage('assets/background.png');
  pillBottleImg = loadImage('assets/PillBottle.png');
  clipboardImg1 = loadImage('assets/clipboard1.png');
  clipboardImg2 = loadImage('assets/clipboard2.png');

  magnifyingGlassImg = loadImage('assets/MagnifyingGlass.png');
  pillBottleImg = loadImage('assets/PillBottle.png');
  titleImg = loadImage('assets/title.png');
  marioWindowImg = loadImage('assets/marioWindow.png');

  gameFont = loadFont('assets/gameFont.ttf');

  angleMode(DEGREES);
}

function resizeImgs(){
  backgroundImg.resize(0, height);

  for (let img of pillImgs){
    img.resize(s, s);
  }
  for (let img of virusImgs){
    img.resize(s, s);
  }

  clipboardImg1.resize(s * 9, 0);
  clipboardImg2.resize(s * 8, 0);
  magnifyingGlassImg.resize(s * 10, s * 10);
  pillBottleImg.resize(s * 10, s * 22);
  titleImg.resize(s * 11, s * 4);
  marioWindowImg.resize(s * 7, s * 7);

  clipboard1Y = (s * 5) - (clipboardImg1.height - s * 9);
  clipboard2X = s * 22;
  clipboard2Y = (s * 12) - (clipboardImg1.height - s * 15);
  magnifyingGlassY = width / 2;
  pillBottleX = s * 11;
  pillBottleY = s * 5;
  titleX = s *  21;
  titleY = s * 3;
  marioWindowX = s * 23;
  marioWindowY = s * 8;
}

function drawUI(){
  image(backgroundImg, 0, 0);
  image(magnifyingGlassImg, 0, magnifyingGlassY);
  image(pillBottleImg, pillBottleX, pillBottleY);
  image(titleImg, titleX, titleY);
  image(marioWindowImg, marioWindowX, marioWindowY);

  image(clipboardImg1, s, clipboard1Y);
  stroke(0);
  fill(0);
  textSize(s * 5);
  text('SCORE', s * 2, clipboard1Y + (4 * s));
  text(str(score), s * 2, clipboard1Y + (6 * s));

  image(clipboardImg2, clipboard2X, clipboard2Y);
  textSize(s * 3);
  text('LEVEL', clipboard2X + s, clipboard2Y + 3 * s);
  text(str(level), clipboard2X + 7 * s - textWidth(str(level)), clipboard2Y + 4 * s);

  text('SPEED', clipboard2X + s, clipboard2Y + 6 * s);
  text(speedName, clipboard2X + 7 * s - textWidth(speedName), clipboard2Y + 7 * s);

  text('VIRUS', clipboard2X + s, clipboard2Y + 9 * s);
  text(str(virusLeft), clipboard2X + 7 * s - textWidth(str(virusLeft)), clipboard2Y + 10 * s);
}

function drawGrid() {
  stroke(0);
  fill(0);
  rect(0, 0, s * cols, s * rows);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != E) {
        grid[i][j].show();
      }
    }
  }
}
