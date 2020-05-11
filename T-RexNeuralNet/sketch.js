var dinos = [];
var savedDinos = [];
const TOTAL = 150;

var obstacles = [];
var heights = [1, 2];
var widths = [1, 2, 3];

var counter = 0;
var stepSlider;
var score = 0;
var scoreP;

function setup() {
  createCanvas(1000, 300);
  tf.setBackend('cpu');

  for (let i = 0; i < TOTAL; i++) {
    dinos.push(new Dino());
  }
  stepSlider = createSlider(1, 15, 1);
  scoreP = createP();
}

function draw() {
  for (let z = 0; z < stepSlider.value(); z++) {
    counter--;
    if (counter <= 0) {
      obstacles.push(new Obstacle(random(widths), random(heights)));
      counter = int(random(20, 35));
      speed += 0.1;
      score++;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      let o = obstacles[i];
      if (o.x <= -o.w) {
        obstacles.splice(i, 1);
      } else {
        o.update();
      }
    }

    for (let j = dinos.length - 1; j >= 0; j--) {
      if (dinos[j].collide()) {
        savedDinos.push(dinos.splice(j, 1)[0]);
      }
    }

    for (let d of dinos) {
      d.think();
      d.update();
    }

    if (dinos.length === 0) {
      counter = 0;
      nextGeneration();
      obstacles = [];
    }
  }

  background(200);
  for (let o of obstacles) {
    o.show();
  }
  for (let d of dinos) {
    d.show();
  }
  scoreP.html('pipes spawned: ' + str(score));
}
