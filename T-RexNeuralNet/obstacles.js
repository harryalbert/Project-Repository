var speed = 10;

class Obstacle{
  constructor(num, height){
    this.x = width;
    this.h = 25 * (1 + height);
    this.w = 22 * num;
  }

  update(){
    this.x -= speed;
  }

  show(){
    noStroke();
    fill(255, 0, 0);
    rect(this.x, height - this.h, this.w, this.h);
  }
}
