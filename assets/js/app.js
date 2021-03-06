const gameboard = document.getElementById('board');

function setMultiplier() {
  let multiplierClass = '';
  let randomNum = Math.floor(Math.random() * 100);
  if (randomNum < 5) {
    multiplierClass = 'double';
  }
  if (randomNum > 85) {
    multiplierClass = 'triple';
  }
  return multiplierClass;
}

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

    const wordRow = rowItems.map(item => item.innerHTML).join('');
    const wordCol = colItems.map(item => item.innerHTML).join('');
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
      let multiplier = 1
      rowItems.forEach(letter => {
        if (letter.className === 'double') {
          multiplier = multiplier * 2;
        }
        if (letter.className === 'triple') {
          multiplier = multiplier * 3;
        }
      });
      // update score ..add 1
      updateScore(correctWordsR, multiplier);

      // add win class to winning row/col
      const updGameList = gameList.map((item) => {
        if (rowItems.includes(item)) {
          item.classList.add('win');
        }
      })

      //set timeout to replace items.
      setTimeout(() => {
        for (item of rowItems) {
          item.classList.remove('win');
        }
      }, 250)

      setTimeout(() => {
        for (item of rowItems) {
          randomLetter = letterArray[Math.floor(Math.random() * 98)];

          item.id = randomLetter;
          item.className = setMultiplier();
          item.innerHTML = randomLetter;
        }
        checkWords();
      }, 250)

    }

    if (correctWordsC.length) {
      console.log(colItems);
      let multiplier = 1
      colItems.forEach(letter => {
        if (letter.className === 'double') {
          multiplier = multiplier * 2;
        }
        if (letter.className === 'triple') {
          multiplier = multiplier * 3;
        }
      });
      // update score ..add 1
      updateScore(correctWordsC, multiplier);

      // add win class to winning row/col
      const updGameList = gameList.map((item) => {
        if (colItems.includes(item)) {
          item.classList.add('win');
        }
      })

      //set timeout to replace items.
      setTimeout(() => {
        for (item of colItems) {
          item.classList.remove('win');
        }
      }, 250)

      setTimeout(() => {
        for (item of colItems) {
          randomLetter = letterArray[Math.floor(Math.random() * 98)];
          item.id = randomLetter;
          item.className = setMultiplier();
          item.innerHTML = randomLetter;
        }
        checkWords();
      }, 250)

    }

  }
}

function startTimer(duration) {
  let intervalid = setInterval(() => {
    if (duration <= 10) {
      document.getElementById("timer").classList.add('pulser');
      document.body.classList.add('pulser');
    }
    if (duration === 0) {
      document.getElementById("timer").classList.remove('pulser');
      document.body.classList.remove('pulser');
      endGame(intervalid);
    }
    duration = duration - 1;
    document.getElementById("timer").innerHTML = duration;
  }, 1000);
}

function stopTimer(id) {
  clearInterval(id)
}

function init() {

  document.getElementById("timer").innerHTML = "1:00";

  score = 0;
  console.log(score);

  let intervalid;
  let timer = 60;
  startTimer(timer);


  let gameitems = '';
  for (let i = 0; i < 25; i++) {
    // get random letter
    randomLetter = letterArray[Math.floor(Math.random() * 98)];
    // chance of double
    gameitems = gameitems + `
        <li id="${randomLetter}" class="${setMultiplier()}">${randomLetter}</li>
      `;
  }

  gameboard.innerHTML = gameitems;
}

const getCol = (val) => {
  const col = (val % 5) + 1;
  return col;
}

const getRow = (val) => {
  const row = Math.floor(val / 5);
  return row;
}

function arraymove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

const getArrayHandler = (tar, dir) => {
  const gameList = Array.from(gameboard.children);

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
  if (dir === 'left') {
    indexStart = gameList.indexOf(rowItems[0])
    indexReplace = gameList.indexOf(rowItems[rowItems.length - 1])
    arraymove(gameList, indexStart, indexReplace);
  }
  if (dir === 'right') {
    indexStart = gameList.indexOf(rowItems[rowItems.length - 1])
    indexReplace = gameList.indexOf(rowItems[0])
    arraymove(gameList, indexStart, indexReplace);
  }
  if (dir === 'down') {
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
  if (dir === 'up') {
    for (let i = 0; i < colItems.length; i++) {
      indexStart = gameList.indexOf(colItems[i]);
      if ((indexStart + i - 5) < 0) {
        indexReplace = gameList.length - 5 + indexStart;
      } else {
        indexReplace = indexStart + 1 - 5;
      }
      arraymove(gameList, indexStart, indexReplace);
    }
  }

  let gameitems = '';
  for (item of gameList) {
    gameitems = gameitems + `<li id="${item.id}" class="${item.className}">${item.innerHTML}</li>`;
  }

  gameboard.innerHTML = gameitems;

  checkWords();

}

const leftMove = (event) => getArrayHandler(event, "left");
const rightMove = (event) => getArrayHandler(event, "right");
const downMove = (event) => getArrayHandler(event, "down");
const upMove = (event) => getArrayHandler(event, "up");

let currTarget = '';

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

// init
let score = 0;

function updateScore(wordArray, multiplier) {
  let wordscore = 0;
  console.log(multiplier);
  const word = wordArray[0];
  const letters = word.split('');
  letters.forEach(letter => {
    const point = letterscore.filter((element) => {
      if (letter === element.letter) {
        return element;
      }
    });
    wordscore = wordscore + point[0].value;
  });
  //multiplier
  wordscore = wordscore * multiplier;
  score = score + wordscore;
  console.log(wordscore);
  document.getElementById("score").innerHTML = score;
}

function handleGesture(currTarget, touchstartX, touchstartY, touchendX, touchendY) {
  const delx = touchendX - touchstartX;
  const dely = touchendY - touchstartY;
  let dir = ''
  if (Math.abs(delx) > Math.abs(dely)) {
    if (delx > 0) getArrayHandler(currTarget, "right");
    else getArrayHandler(currTarget, "left");
  }
  if (Math.abs(delx) < Math.abs(dely)) {
    if (dely > 0) getArrayHandler(currTarget, "down");
    else getArrayHandler(currTarget, "up");
  }
}

gameboard.addEventListener('touchstart', function (event) {
  event.preventDefault();
  currTarget = event.target;
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
}, false);

gameboard.addEventListener('touchend', function (event) {
  event.preventDefault();
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleGesture(currTarget, touchstartX, touchstartY, touchendX, touchendY)
}, false);


function endGame(intervalID) {
  console.log(score);
  clearBoard(gameboard);
  stopTimer(intervalID);
  document.getElementById("score").innerHTML = "Final Score: " + score;

  //store score in localstorage
  document.querySelector('#highscore span').innerHTML = setHighScore(score);

  document.getElementById("timer").classList.remove('show');
  document.getElementById("highscore").classList.add('show');
  document.getElementById("start").classList.add('show');
  // disable new game button for a second before able to retry
  document.getElementById("start").disabled = true;
  setTimeout(() => {
    document.getElementById("start").disabled = false;
  }, 1000)
}

function clearBoard(boardid) {
  while (boardid.firstChild) {
    boardid.removeChild(boardid.firstChild);
  }
}

function retrieveHighScore() {
  if (localStorage.getItem('highscore')) {
    return localStorage.getItem('highscore');
  }
  return 0;
}

function setHighScore(score) {
  if (score > retrieveHighScore()) {
    localStorage.setItem('highscore', score);
  }
  return localStorage.getItem('highscore');
}

function startGame() {
  score = 0;
  document.getElementById("start").classList.remove('show');
  document.getElementById("highscore").classList.remove('show');
  document.getElementById("timer").classList.add('show');
  document.getElementById("score").innerHTML = score;
  document.getElementById("score").classList.add('show');
  init();
}

document.querySelector('#highscore span').innerHTML = retrieveHighScore();
