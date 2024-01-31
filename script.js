const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let pick1 = '';
let pick2 = '';
let pickTotal = 0;
let set = 5;
let cardflipping = false;
let gameplaying = false;

// TODO: Implement this function!
function handleCardClick(event) {
  if (gameplaying === true) {
    if (!cardflipping) {
      if (event.target.style.background === '') {
        // you can use event.target to see which element was clicked
        let color = event.target.classList.value;
        event.target.style.background = color;
        pickTotal++;
        if (pick1 === '') {
          pick1 = color;
        } else {
          pick2 = color;
        }

        if (pickTotal === 2) {
          compare();
          pickTotal = 0;
        }
      }
    }
  }
}

function saveBestScore(score) {
  localStorage.setItem('score', score);
}

function getBestScore() {
  return localStorage.getItem('score') || 99999;
}

function updateBestScore(newScore) {
  const bestScore = getBestScore();
  let score = document.querySelector('.timer').innerText;
  let bestScoreMin = (Math.floor(bestScore / 60)).toString().padStart(2, '0');
  let bestScoreSec = (bestScore % 60).toString().padStart(2, '0');
  let bestScoreStr = `${bestScoreMin}:${bestScoreSec}`;
  if (newScore < bestScore) {
    saveBestScore(newScore);
    alert(`You Win!! The Best Time is ${score}`);
  } else if (newScore === bestScore) {
    alert(`Tie!! The Best Time is ${score}`)
  } else {
    alert(`You Lose!!  The Best Time is ${bestScoreStr}`)
  }
}

function compare() {
  if (pick1 === pick2) {
    pick1 = '';
    pick2 = '';
    set--;
    if (set === 0) {
      setTimeout(() => {
        clearInterval(intervalId);
        gameplaying = false;
        let scoreMin = Number(document.querySelector('#min').innerText);
        let scoreSec = Number(document.querySelector('#sec').innerText);
        let scoretotalSec = scoreMin * 60 + scoreSec;
        updateBestScore(scoretotalSec);
      }, 500);
    }
  } else {
    cardflipping = true;
    setTimeout(() => {
      let allcolor1 = document.querySelectorAll(`.${pick1}`);
      for (let color of allcolor1) {
        color.style.background = '';
      }
      let allcolor2 = document.querySelectorAll(`.${pick2}`);
      for (let color of allcolor2) {
        color.style.background = '';
      }
      pick1 = '';
      pick2 = '';
      cardflipping = false;
    }, 1000);
  }
}

const min = document.querySelector('#min');
const sec = document.querySelector('#sec');
let intervalId;

function timer() {
  let second = 0;
  let minute = 0;
  intervalId = setInterval(() => {
    second++;
    if (second === 60) {
      sec.innerText = '00';
      second = 0;
      minute++;
      min.innerText = minute.toString().padStart(2, '0');
    }
    sec.innerText = second.toString().padStart(2, '0');
  }, 1000)
}

createDivsForColors(shuffledColors);

function startGame() {
  gameplaying = true;
}

let startBtn = document.querySelector('.start');

startBtn.addEventListener('click', function () {
  if (gameplaying === false) {
    startGame();
    timer();
  }
})

let resetBtn = document.querySelector('.reset');

resetBtn.addEventListener('click', function () {
  gameContainer.innerHTML = '';
  clearInterval(intervalId);
  min.innerText = '00';
  sec.innerText = '00';
  gameplaying = false;
  createDivsForColors(shuffledColors);
  set = 5;
})