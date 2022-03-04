const gameboard = document.getElementById("board");

function checkWords() {
  const gameList = Array.from(gameboard.children);
  for (i = 0; i < 25; i += 6) {
    // for now, we are separating out rows and cols, because we need to be able to track if the correct word was in a row/column to replace the proper letters

    // check rows
    const rowItems = gameList.filter((item, index) => {
      if (getRow(index) === getRow(i)) {
        return item;
      }
    });

    // check cols
    const colItems = gameList.filter((item, index) => {
      if (getCol(index) === getCol(i)) {
        return item;
      }
    });

    const wordRow = rowItems.map((item) => item.innerHTML).join("");
    const wordCol = colItems.map((item) => item.innerHTML).join("");
    // console.log(wordRow, wordCol);

    const correctWordsR = wordlist.filter((item) => {
      if (item === wordRow) {
        return item;
      }
    });

    const correctWordsC = wordlist.filter((item) => {
      if (item === wordCol) {
        return item;
      }
    });

    if (correctWordsR.length) {
      console.log(rowItems);
      updateScore(correctWordsR);

      // add win class to winning row/col
      const updGameList = gameList.map((item) => {
        if (rowItems.includes(item)) {
          item.classList.add("win");
          //remove letter so it doesn't duplicate a score
          item.innerHTML = '';
        }
      });

      // delay new letters added for animation
      setTimeout(() => {
        for (item of rowItems) {
          const letter = randomLetter(letterArray);
          item.id = letter;
          item.classList.remove("win");
          item.innerHTML = letter;
          checkWords();
        }
      }, 250);

    }

    if (correctWordsC.length) {
      console.log(colItems);
      updateScore(correctWordsC);

      // add win class to winning row/col
      const updGameList = gameList.map((item) => {
        if (colItems.includes(item)) {
          item.classList.add("win");
          //remove letter so it doesn't duplicate a score
          item.innerHTML = '';
        }
      });

      //set timeout to replace items.
      // having this timeout is allowing the row to score mulitple times.
      setTimeout(() => {
        for (item of colItems) {
          const letter = randomLetter(letterArray);
          item.id = letter;
          item.classList.remove("win");
          item.innerHTML = letter;
          checkWords();
        }
      }, 250);

    }
  }
}

function startTimer(duration) {
  let intervalid = setInterval(() => {
    if (duration <= 10) {
      document.getElementById("timer").classList.add("pulser");
      document.body.classList.add("pulser");
    }
    if (duration === 0) {
      document.getElementById("timer").classList.remove("pulser");
      document.body.classList.remove("pulser");
      endGame(intervalid);
    }
    duration = duration - 1;
    document.getElementById("timer").innerHTML = duration;
  }, 1000);
}

function stopTimer(id) {
  clearInterval(id);
}

function init() {
  document.getElementById("timer").innerHTML = "90";

  newmultiplier = 1;
  score = 0;

  let intervalid;
  let timer = 90;
  startTimer(timer);

  let gameitems = "";
  for (let i = 0; i < 25; i++) {
    // get random letter
    let letter = randomLetter(letterArray);
    // chance of double
    gameitems =
      gameitems +
      `
        <li id="${letter}">${letter}</li>
      `;
  }

  gameboard.innerHTML = gameitems;
}

const getArrayHandler = (tar, dir) => {
  const gameList = Array.from(gameboard.children);
  // remove any 'current' class
  // if win is still set, remove it.
  // if a letter is blank, add a new letter to it
  // I believe this is occuring because the stack is going to fast to update
  // from setTimeouts going on in the checkWord() function.
  gameList.forEach((element) => {
    element.classList.remove('curr');
    element.classList.remove('win');
    // if letter is blank
    if(element.innerHTML === '') {
      let letter = randomLetter(letterArray);
      element.id = letter;
      element.innerHTML = letter;
    }
  })
  if(window.navigator.vibrate) {
    window.navigator.vibrate(10);
  }
  const col = getCol(gameList.indexOf(tar));
  const row = getRow(gameList.indexOf(tar));

  const colItems = gameList.filter((item, index) => {
    if (getCol(index) === col) {
      return item;
    }
  });

  const rowItems = gameList.filter((item, index) => {
    if (getRow(index) === row) {
      return item;
    }
  });

  let indexReplace = 0;
  let indexStart = 0;
  // set current row or col
  if (dir === "left" || dir === "right") {
    rowItems.forEach((element) => {
      element.classList.add('curr');
    })
  }
  if (dir === "up" || dir === "down") {
    colItems.forEach((element) => {
      element.classList.add('curr');
    })
  }
  if (dir === "left") {
    indexStart = gameList.indexOf(rowItems[0]);
    indexReplace = gameList.indexOf(rowItems[rowItems.length - 1]);
    arraymove(gameList, indexStart, indexReplace);
  }
  if (dir === "right") {
    indexStart = gameList.indexOf(rowItems[rowItems.length - 1]);
    indexReplace = gameList.indexOf(rowItems[0]);
    arraymove(gameList, indexStart, indexReplace);
  }
  if (dir === "down") {
    for (const item of colItems) {
      indexStart = gameList.indexOf(item);
      if (indexStart + 5 >= gameList.length) {
        indexReplace = indexStart + 5 - gameList.length;
      } else {
        indexReplace = indexStart + 5;
      }
      arraymove(gameList, indexStart, indexReplace);
    }
  }
  if (dir === "up") {
    for (let i = 0; i < colItems.length; i++) {
      indexStart = gameList.indexOf(colItems[i]);
      if (indexStart + i - 5 < 0) {
        indexReplace = gameList.length - 5 + indexStart;
      } else {
        indexReplace = indexStart + 1 - 5;
      }
      arraymove(gameList, indexStart, indexReplace);
    }
  }

  let gameitems = "";
  for (item of gameList) {
    gameitems =
      gameitems +
      `<li id="${item.id}" class="${item.className}">${item.innerHTML}</li>`;
  }

  gameboard.innerHTML = gameitems;

  checkWords();
};

const leftMove = (event) => getArrayHandler(event, "left");
const rightMove = (event) => getArrayHandler(event, "right");
const downMove = (event) => getArrayHandler(event, "down");
const upMove = (event) => getArrayHandler(event, "up");

let currTarget = "";

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

// init
let score = 0;
let newmultiplier = 1;

function updateScore(wordArray) {
  let wordscore = 0;
  if(window.navigator.vibrate) {
    window.navigator.vibrate(100);
  }
  const word = wordArray[0];
  const letters = word.split("");
  letters.forEach((letter) => {
    const point = letterscore.filter((element) => {
      if (letter === element.letter) {
        return element;
      }
    });
    wordscore = wordscore + point[0].value;
  });
  //multiplier
  wordscore = wordscore * newmultiplier;
  highlightCorrectWord(word, wordscore);
  score = score + wordscore;
  document.getElementById("score").innerHTML = score;
  newmultiplier = newmultiplier + 1;
  document.getElementById("multiplier").innerHTML = `x${newmultiplier}`;
}

function handleGesture(
  currTarget,
  touchstartX,
  touchstartY,
  touchendX,
  touchendY
) {
  const delx = touchendX - touchstartX;
  const dely = touchendY - touchstartY;
  let dir = "";
  if (Math.abs(delx) > Math.abs(dely)) {
    if (delx > 0) getArrayHandler(currTarget, "right");
    else getArrayHandler(currTarget, "left");
  }
  if (Math.abs(delx) < Math.abs(dely)) {
    if (dely > 0) getArrayHandler(currTarget, "down");
    else getArrayHandler(currTarget, "up");
  }
}

gameboard.addEventListener(
  "touchstart",
  function (event) {
    event.preventDefault();
    currTarget = event.target;
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  },
  false
);

gameboard.addEventListener(
  "touchend",
  function (event) {
    event.preventDefault();
    // trying to prevent repeat submissions
    if (event.target.nodeName.toLowerCase() !== 'ul') {
      if (event.target.classList) {
        if (event.target.classList.contains('win')) {
        } else {
          touchendX = event.changedTouches[0].screenX;
          touchendY = event.changedTouches[0].screenY;
          handleGesture(currTarget, touchstartX, touchstartY, touchendX, touchendY);
        }
      } else {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture(currTarget, touchstartX, touchstartY, touchendX, touchendY);
      }
    }
  },
  false
);

function endGame(intervalID) {
  console.log(score);
  clearBoard(gameboard);
  stopTimer(intervalID);
  document.getElementById("finalscore").classList.add("show");
  document.getElementById("finalscore").innerHTML = 'Final Score: ' + score;

  //store score in localstorage
  document.querySelector("#highscore span").innerHTML = setHighScore(score);

  document.getElementById("timer").classList.remove("show");
  document.querySelector("header").classList.remove("show");
  document.getElementById("highscore").classList.add("show");
  document.getElementById("start").classList.add("show");
  document.getElementById("multiplier").innerHTML = 'x1';
  // disable new game button for a second before able to retry
  document.getElementById("start").disabled = true;
  setTimeout(() => {
    document.getElementById("start").disabled = false;
  }, 1000);
}

function startGame() {
  score = 0;
  document.getElementById("start").classList.remove("show");
  document.getElementById("highscore").classList.remove("show");
  document.getElementById("finalscore").classList.remove("show");
  document.querySelector("header").classList.add("show");
  document.getElementById("score").innerHTML = score;
  init();
}

document.querySelector("#highscore span").innerHTML = retrieveHighScore();
