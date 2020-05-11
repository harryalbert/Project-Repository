function nextGeneration() {
  console.log('next generation');
  calculateFitness();
  for (let i = 0; i < TOTAL; i++) {
    dinos[i] = pickOne();
  }
  for (let i = 0; i < TOTAL; i++) {
    savedDinos[i].brain.dispose();
  }
  savedDinos = [];
  speed = 10;
  score = 0;
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedDinos[index].fitness;
    index++;
  }
  index--;
  let dino = savedDinos[index];
  let child = new Dino(dino.brain);
  child.brain.mutate(0.1);
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let d of savedDinos) {
    sum += d.score;
  }
  for (let d of savedDinos) {
    d.fitness = d.score / sum;
  }
}
