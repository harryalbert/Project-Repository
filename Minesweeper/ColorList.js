var cNonRevealed;
var cRevealedEmpty;
var cBomb;
var cFlag;
var cNumbers;

function setColors() {
  cNonRevealed = color(150);
  cRevealedEmpty = color(200);
  cBomb = color(204, 0, 0);
  cFlag = color(51, 51, 255);

  cNumbers = [color(255, 153, 255), color(255, 102, 255), color(255, 51, 255),
    color(255, 0, 255), color(204, 0, 204), color(153, 0, 153),
    color(102, 0, 102), color(51, 0, 51)
  ]
}
