var selectedOption = [true, false, false];
var musicType = 0;

var manualSeeds = false;
var seedInput1, seedInput2;
var userSeeds = [];

function menuUI() {
  background(menuImg);

  textAlign(CENTER, TOP);
  textSize(s * 3.5);

  stroke(255);
  fill(255);
  text("1  PLAYER  GAME", width / 2, s * 4);

  textAlign(LEFT, TOP);

  virusLevelSelector(selectedOption[0]);
  speedSelector(selectedOption[1])
  musicSelector(selectedOption[2]);
}

function virusLevelSelector(selected) {
  outlinedText("VIRUS  LEVEL", s * 6, s * 7, selected);
  stroke(255);

  strokeWeight(2);
  line(s * 11, s * 11, s * 21, s * 11);

  strokeWeight(3);
  line(s * 11, s * 10.5, s * 11, s * 11.5);
  line(s * 21, s * 10.5, s * 21, s * 11.5);

  let x = s * 11.5;
  for (let i = 0; i < 19; i++) {
    if ((i + 1) % 5 == 0) {
      strokeWeight(2);
      line(x, s * 10.5, x, s * 11.5);
    } else {
      strokeWeight(1);
      line(x, s * 10.75, x, s * 11.25);
    }
    x += s / 2;
  }

  strokeWeight(1);
  stroke(238, 131, 83);
  fill(238, 131, 83);

  x = s * 11 + ((s / 2) * level);
  let y = s * 10.5;
  triangle(x - s / 2, y - s, x + s / 2, y - s, x, y);

  stroke(57, 255, 20);
  noFill();
  strokeWeight(3);
  rect(s * 23.5, s * 8.5, s * 2, s * 2);

  stroke(255);
  fill(255);
  strokeWeight(1);
  let txtLevel = str(level);
  if (level < 10) {
    txtLevel = str(0) + str(level);
  }
  push();
  textAlign(CENTER);
  text(txtLevel, s * 24.5, s * 8.5);
  pop();
}

function speedSelector(selected) {
  outlinedText("SPEED", s * 6, s * 14, selected);

  stroke(255);
  fill(255);
  text("LOW", s * 11, s * 17);
  text("MED", s * 16, s * 17);
  text("HI", s * 21, s * 17);

  stroke(238, 131, 83);
  fill(238, 131, 83);
  if (speed == 1) {
    triangle(s * 11, s * 16, s * 11 + textWidth("LOW"), s * 16, s * 11 + textWidth("LOW") / 2, s * 17);
  } else if (speed == 2) {
    triangle(s * 16, s * 16, s * 16 + textWidth("MED"), s * 16, s * 16 + textWidth("MED") / 2, s * 17);
  } else {
    triangle(s * 21, s * 16, s * 21 + textWidth("HI"), s * 16, s * 21 + textWidth("HI") / 2, s * 17);
  }
}

function musicSelector(selected) {
  outlinedText("MUSIC TYPE", s * 6, s * 21, selected);

  stroke(255);
  fill(255);
  text("OFF", s * 7.5, s * 25);
  text("FEVER", s * 13.5, s * 25);
  text("CHILL", s * 21, s * 25);

  stroke(238, 131, 83);
  fill(238, 131, 83);
  if (musicType == 0) {
    triangle(s * 7.5, s * 24, s * 7.5 + textWidth("OFF"), s * 24, s * 7.5 + textWidth("OFF") / 2, s * 25);
  } else if (musicType == 1) {
    triangle(s * 13.5, s * 24, s * 13.5 + textWidth("FEVER"), s * 24, s * 13.5 + textWidth("FEVER") / 2, s * 25);
  } else {
    triangle(s * 21, s * 24, s * 21 + textWidth("CHILL"), s * 24, s * 21 + textWidth("CHILL") / 2, s * 25);
  }
}

function outlinedText(t, x, y, selected) {
  stroke(255);
  fill(255);
  text(t, x, y);

  noFill();
  if (!selected) {
    stroke(238, 131, 83);
    rect(x, y, textWidth(t), s * 2, 9);
  } else {
    push();
    strokeWeight(5);
    stroke(235, 63, 68);
    rect(x - 4, y - 4, textWidth(t) + 7, s * 2 + 7, 9);

    strokeWeight(2);
    stroke(238, 131, 83);
    rect(x, y, textWidth(t), s * 2, 5);

    pop();
  }
}

function keyPressed() {
  if (mainMenu) {
    if (keyCode == 40 || keyCode == 38) {
      let selectedIndex;
      for (let i = 0; i < selectedOption.length; i++) {
        if (selectedOption[i]) selectedIndex = i;
      }

      if (keyCode == 40) selectedIndex += 1;
      else selectedIndex -= 1;


      if (selectedIndex > 2) selectedIndex = 2;
      if (selectedIndex < 0) selectedIndex = 0;

      for (let i = 0; i < selectedOption.length; i++) {
        if (i == selectedIndex) selectedOption[i] = true;
        else selectedOption[i] = false;
      }
    } else if (keyCode == 37 || keyCode == 39) {
      if (selectedOption[0]) {
        if (keyCode == 37) level -= 1;
        else level += 1;

        if (level < 0) level = 0;
        if (level > 20) level = 20;
      } else if (selectedOption[1]) {
        if (keyCode == 37) speed -= 1;
        else speed += 1;

        if (speed < 1) speed = 1;
        if (speed > 3) speed = 3;
      } else {
        if (keyCode == 37){
          musicType -= 1;
          if (musicType == 0){
            for (let s of sounds){
              s.stop();
            }
          }
        }
        else {
          musicType += 1;
          if (musicType == 1){
            playSound(0,  true, true);
          }
        }

        if (musicType < 0) musicType = 0;
        if (musicType > 2) musicType = 2;
      }
    } else if (keyCode == 13) {
      mainMenu = false;
      setupLevel();
    }
  }
}

function input1(){
  let newValue = int(this.value());
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 255){
    userSeeds[0] = newValue
  }
}

function input2(){
  let newValue = int(this.value());
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 255){
    userSeeds[1] = newValue;
  }
}
