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

function highlightCorrectWord(word, points) {
  console.log(word, points);
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = `<div class="toast-content">${word} <span>+${points}</span></div>`;
  document.getElementById("gamearea").appendChild(toast);

  // add pop class to show toast
  setTimeout(function() {
    console.log(toast);
    toast.classList.add('pop');
  },0);
  // remove pop claass to hide toast
  setTimeout(function() {
    toast.classList.remove('pop');
  },1000);
  // remove toast to clear from DOM (timeout is set to 200ms for animation)
  setTimeout(function() {
    document.body.removeChild(toast);
  },1200);
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