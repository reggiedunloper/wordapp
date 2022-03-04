function getCol(val) {
  const col = (val % 5) + 1;
  return col;
};

function getRow(val) {
  const row = Math.floor(val / 5);
  return row;
};

function randomLetter(letterList) {
  return letterList[Math.floor(Math.random() * 98)];
}

function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

function clearBoard(boardid) {
  while (boardid.firstChild) {
    boardid.removeChild(boardid.firstChild);
  }
}

function retrieveHighScore() {
  if (localStorage.getItem("highscore")) {
    return localStorage.getItem("highscore");
  }
  return 0;
}

function setHighScore(score) {
  if (score > retrieveHighScore()) {
    localStorage.setItem("highscore", score);
  }
  return localStorage.getItem("highscore");
}