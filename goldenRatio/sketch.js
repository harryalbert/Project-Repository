// golden ratio = (sqrt(5) - 1) / 2

var seeds = [];
var numSeeds = 1000;
var turnRate;

var seedSize = 10;
var increment = seedSize / 15;
var centerRadius = seedSize;

var change = false;
var changeRate = 0.00005;
var gRatio;

function setup() {
  gRatio = (sqrt(5) - 1) / 2

  createCanvas(750, 750);
  turnRate = gRatio;
  createSeeds(turnRate);
}

function createSeeds(rate) {
  turnRate = rate;
  seeds = [];
  let angle = 0;
  let x, y;
  let radius = centerRadius;
  for (var i = 0; i < numSeeds; i++) {
    x = (width / 2) + (cos(angle) * radius / 2);
    y = (height / 2) + (sin(angle) * radius / 2);
    seeds.push([x, y]);

    angle += (rate * (2 * PI));
    radius += increment;
  }
}

function drawSeeds() {
  for (let seed of seeds) {
    fill(255);
    ellipse(seed[0], seed[1], seedSize, seedSize);
  }
}

function draw() {
  background(0);
  if (change) {
    if (turnRate >= 1){
      turnRate = 0;
    }
    turnRate += changeRate;
    createSeeds(turnRate);
  }
  drawSeeds();
}
