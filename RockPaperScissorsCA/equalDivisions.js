var points = [];
var actualPoints = [];
var extendedPoint;

var zone;

function getPoints(numPoints){
  let lineCoords = [];
  let finalPoints = [];

  let dWidth = (width * 2 + height * 2) / (numPoints + 0.5);

  let x = 0;
  for (let i = 0; i < numPoints; i++){
    lineCoords.push(x);
    x += dWidth;
  }
  actualPoints = lineCoords;

  for (let pnt of lineCoords){
    nPnt = unCollapse(pnt);
    finalPoints.push(createVector(nPnt[0], nPnt[1]));
  }
  return finalPoints;
}

function unCollapse(pnt){
  let x, y;
  if (pnt <= width){
    x = pnt;
    y = 0;
  }else if (pnt <= width + height){
    x = width;
    y = pnt - width;
  }else if (pnt <= width * 2 + height){
    x = width - (pnt - (width + height));
    y = height;
  }else{
    x = 0;
    y = height - (pnt - (width * 2 + height));
  }
  return [x, y];
}

function collapse(x, y){
  if (y == 0){
    return x;
  }else if (x == width){
    return width + y
  }else if (y == height){
    return width + height + (width - x);
  }else{
    return width * 2 + height + (height - y);
  }
}

function getLine(tX, tY){
  let x = tX - (width / 2);
  let y = tY - (height / 2);
  let slope = y / x;
  let point;

  //none of this works
  if (slope > 1 || slope < -1){
    //check y
    if (y < 0){
      // console.log(1);
      pnt = [-height / (2 * slope), -height / 2];
    }else{
      // console.log(3);
      pnt = [height / (2 * slope), height / 2];
    }
  }else{
    //check x
    if (x < 0){
      // console.log(4);
      pnt = [-width / 2, (-width / 2) * slope]
    }else{
      // console.log(2);
      pnt = [width / 2, (width / 2) * slope]
    }
  }

  pnt[0] += (width / 2);
  pnt[1] += (height / 2);
  return createVector(pnt[0], pnt[1]);
}

function findZone(x){
  let z = 0;
  for (let i = 1; i < actualPoints.length; i++){
    if (x > actualPoints[i]){
      z += 1;
    }
  }
  return z;
}
