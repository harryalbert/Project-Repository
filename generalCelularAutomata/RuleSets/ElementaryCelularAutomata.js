var states = [
  [A, A, A],
  [A, A, D],
  [A, D, A],
  [A, D, D],
  [D, A, A],
  [D, A, D],
  [D, D, A],
  [D, D, D]
];

var ruleNum = 30;
var rules = [];

function changeRuleNum(){
  let newNum = int(this.value());

  if (newNum >= 0 && newNum <= 255){
    ruleNum = newNum;
  }
  reset();
}

function getRules(ruleNum) {
  let bin = (ruleNum >>> 0).toString(2);
  let ruleList = [];

  if (bin.length < 8) {
    let oString = '';
    for (let i = 0; i < 8 - bin.length; i++) {
      oString += '0';
    }
    bin = oString + bin;
  }

  for (let num of bin) {
    ruleList.push(int(num));
  }

  return ruleList;
}

function ECA(cX, cY, world) {
  let neighbors = getNeighbors(cX, cY, simpleNeighbors = true);
  let neighborStates = [];
  for (let i = 0; i < neighbors.length; i++) {
    if (neighbors[i][0] >= 0 && neighbors[i][0] <= gX - 1) {
      neighborStates[i] = world[neighbors[i][0]][neighbors[i][1]];
    } else {
      neighborStates[i] = D;
    }
  }

  for (let i = 0; i < states.length; i++) {
    if (states[i][0] == neighborStates[0] && states[i][1] == neighborStates[1] && states[i][2] == neighborStates[2]) {
      return rules[i];
    }
  }
}
