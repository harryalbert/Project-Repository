let g = 2;

class Dino {
  constructor(brain) {
    this.w = 20;
    this.h = 50;
    this.x = 60;
    this.y = height;
    this.v = 0;
    this.score = 0;
    this.fitness = 0;

    if (brain){
      this.brain = brain.copy();
    }else{
      this.brain = new NeuralNetwork(4, 8, 3);
    }
  }

  jump(size) {
    if (this.onGround()) {
      this.v -= 17 + 5 * size;
    }
  }

  onGround() {
    if (this.y >= height) {
      return true;
    }
    return false;
  }

  collide() {
    for (let o of obstacles) {
      if (this.x - this.w > o.x + o.w || o.x > this.x){
        return false;
      }

      // If one rectangle is above other
      if (this.y < height - o.h){
        return false;
      }

      return true;
    }
  }

  update() {
    this.score++;
    this.y += this.v;
    this.v += g;

    if (this.onGround()) {
      this.y = height;
      this.v = 0;
    }
  }

  think(){
    let closest = null;
    let closestD = Infinity;
    for (let o of obstacles){
      let d = o.x - this.x;
      if (d < closestD && d > 0){
        closest = o;
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = closest.w;
    inputs[1] = closest.h;
    inputs[2] = closestD;
    inputs[3] = this.onGround();

    let output = this.brain.predict(inputs);
    if (output[0] > output[1] && output[0] > output[2]){
      this.jump(0);
    }else if (output[1] > output[2]){
      this.jump(1);
    }
  }

  show() {
    noStroke(0);
    fill(0, 100);
    rect(this.x - this.w, this.y - this.h, this.w, this.h);
  }
}

// function keyPressed() {
//   if (key == ' ') {
//     for (let d of dinos) {
//       d.jump(0);
//     }
//   } else if (keyCode == UP_ARROW) {
//     for (let d of dinos) {
//       d.jump(1);
//     }
//   }
// }
