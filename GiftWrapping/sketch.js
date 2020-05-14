var points = [];
var hull = [];

var leftMost;
var currentVertex;
var index = 0;
var nextVertex;
let nextIndex = -1;
var checking;

var done = false;

function setup() {
  createCanvas(windowWidth - 5, windowHeight - 5);
  let buffer = 20;
  for (var i = 0; i < 200; i++) {
    points.push(createVector(random(buffer, width - buffer), random(buffer, height - buffer)));
  }

  points.sort((a, b) => a.x - b.x);
  leftMost = points[0];
  currentVertex = leftMost;
  hull.push(currentVertex);

  nextVertex = points[1];
  index = 2;
}

function drawPoints() {
  stroke(255);
  strokeWeight(8);
  for (let p of points) {
    point(p.x, p.y);
  }

  if (!done) {
    stroke(0, 255, 0);
    strokeWeight(2);
    line(currentVertex.x, currentVertex.y, nextVertex.x, nextVertex.y);

    checking = points[index];
    stroke(255);
    line(currentVertex.x, currentVertex.y, checking.x, checking.y);

    stroke(200, 0, 255);
    strokeWeight(20);
    point(currentVertex.x, currentVertex.y);
  }
}

function drawHull(){
  stroke(0, 0, 255);
  if (done) {
    fill(0, 0, 255, 50);
  }else{
    noFill();
  }
  strokeWeight(3);
  beginShape();
  for (let p of hull) {
    vertex(p.x, p.y);
  }
  if (done) {
    endShape(CLOSE);
    for (let p of hull) {
      strokeWeight(8);
      stroke(0, 255, 0);
      point(p.x, p.y);
    }
  } else {
    endShape();
  }
}

function checkPoints() {
  var a = p5.Vector.sub(nextVertex, currentVertex);
  var b = p5.Vector.sub(checking, currentVertex);
  var cross = a.cross(b);

  if (cross.z < 0) {
    nextVertex = checking;
    nextIndex = index;
  }
  index = index + 1;

  if (index == points.length) {
    if (nextVertex == leftMost) {
      console.log('done');
      done = true;
    } else {
      hull.push(nextVertex);
      currentVertex = nextVertex;
      index = 0;
      nextVertex = leftMost;
    }
  }
}

function draw() {
  background(0);

  drawPoints();
  drawHull();
  if (!done) {
    checkPoints();
  }
}
