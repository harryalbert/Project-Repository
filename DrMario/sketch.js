//Web based Dr Mario game (using NES accurate randomization)
//by Harry Albert
var grid = [];
var cols = 8;
var rows = 16;
var s; //size of one box in grid

var numVirus = 10;
var virusLeft = 0;
var numKilled = 0;
var cPill;

//table to show how quickly to drop pills (vitamins)
var speedTable = [40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 10, 9, 9, 8, 8, 7, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1];
var speedTypes = [
  [0, 49],
  [10, 59],
  [16, 65]
];
var speed = 2;
var speedName, speedIndex;
var refreshCounter = 0;

var mainMenu = true;
var movePillsDown = false;
var paused = false;

var level = 0;
var score = 0;

function setup() {
  console.log("Press 's' to input your own seed");
  if (windowWidth < windowHeight) {
    createCanvas(windowWidth - 5, windowWidth - 5);
  } else {
    createCanvas(windowHeight - 5, windowHeight - 5);
  }
  s = width / 32;

  resizeImgs();
  textFont(gameFont);
}

function setupLevel() {
  createGrid();
  cPill = new Pill();
  speedIndex = speedTypes[speed - 1][0];

  switch (speed) {
    case 1:
      speedName = 'LOW';
      break;
    case 2:
      speedName = 'MED';
      break;
    case 3:
      speedName = 'HI';
  }
  textAlign(LEFT, BOTTOM);
  playSound(1 + (musicType - 1) * 2, true, true);
}

function inList(l, pos) {
  //tells if a given position is in a given list
  for (let p of l) {
    if (p[0] == pos[0] && p[1] == pos[1]) {
      return true;
    }
  }
  return false;
}

function inBounds(x, y) {
  //is position inbounds
  if (x < 0) {
    return false;
  }
  if (x >= cols) {
    return false;
  }
  if (y < 0) {
    return false;
  }
  if (y >= rows) {
    return false;
  }

  return true;
}

function erasePills() {
  //function to erase all pills/virus in a line
  let eraseList = [];

  //directions to check
  let dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] != E && !inList(eraseList, [i, j])) { //if location is not empty and has not already been marked to erase
        for (let dir of dirs) {
          let lineList = [
            [i, j]
          ];
          let nX = j + dir[0];
          let nY = i + dir[1];

          while (inBounds(nX, nY) && grid[nY][nX] != E && grid[nY][nX].col == grid[i][j].col) {
            lineList.push([nY, nX]);
            nX += dir[0];
            nY += dir[1];
          }

          if (lineList.length >= 4) {
            eraseList.push([i, j]);
            for (let pos of lineList) {
              eraseList.push(pos);
            }
          }
        }
      }
    }
  }

  let killedNow = 0;
  for (let pos of eraseList) {
    if (grid[pos[0]][pos[1]] instanceof Virus) {
      killedNow += 1;
    }

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] instanceof PlacedPill && grid[i][j].connectedTo == grid[pos[0]][pos[1]]) {
          grid[i][j].connectedTo = undefined;
        }
      }
    }

    grid[pos[0]][pos[1]] = E;
  }

  if (killedNow > 0) {
    virusLeft -= killedNow;
    numKilled += killedNow;
    return true;
  }
  return false;
}

function dropPills() {
  //goes through and drops every pill that is able to be dropped
  let dropList = [];
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof PlacedPill && grid[i][j].checkDown()) {
        dropList.push([i, j]);
      }
    }
  }

  if (dropList.length == 0) {
    if (!erasePills()) {
      movePillsDown = false;

      if (numKilled > 0) {
        if (numKilled > 6) {
          numKilled = 6;
        }

        let scoreMult = Math.pow(2, numKilled - 1);
        score += scoreMult * 100;
      }
      numKilled = 0;

      if (checkLevelDone()) {
        nextLevel();
      } else {
        cPill = new Pill();
      }
    }
  } else {
    for (let pos of dropList) {
      let y = pos[0] + 1;
      let x = pos[1];

      grid[y][x] = grid[y - 1][x];
      grid[y][x].y = y;
      grid[y][x].x = x;
      grid[y - 1][x] = E;
    }
  }
}

function checkLevelDone() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] instanceof Virus) {
        return false;
      }
    }
  }

  return true;
}

function nextLevel() {
  level += 1;
  setupLevel();
}

function draw() {
  if (mainMenu) {
    menuUI();
  } else {
    drawUI();

    push();
    translate(s * 12, s * 10);
    drawGrid();

    if (!paused) {
      refreshCounter += 1;
      if (refreshCounter >= speedTable[speedIndex]) {
        if (movePillsDown) {
          dropPills();
        } else {
          cPill.update();
        }
        refreshCounter = 0;
      }
    }

    if (!movePillsDown) {
      cPill.show();
    }
    pop();
  }
}

function playSound(soundIndex, stop) {
  if (musicType == 0) return;

  if (stop) {
    for (let i = 0; i < sounds.length; i++) {
      if (sounds[i].isLooping() || sounds[i].isPlaying()) {
        sounds[i].stop();
      }
    }
  }

  if (sounds[soundIndex].isLooping() || sounds[soundIndex].isPlaying()){
    sounds[soundIndex].stop();
  }
  if (loop) {
    sounds[soundIndex].loop();
  } else {
    sounds[soundIndex].play();
  }
}

function keyTyped() {
  if (key == 'p') {
    paused = !paused;
  }
  if (key == 's' && !manualSeeds && mainMenu){
    seedInput1 = createInput();
    seedInput2 = createInput();

    seedInput1.input(input1);
    seedInput2.input(input2);
    userSeeds[0] = int(random(255));
    userSeeds[1] = int(random(255));
    seedInput1.value(userSeeds[0]);
    seedInput2.value(userSeeds[1]);
    manualSeeds = true;
  }
}
