'use strict';

/**
* @description General declarations
*/
const table = document.getElementById('table');
let firstSelection, secondSelection, selections, previousTarget, moves;
let delay = 1200;

let timer = document.querySelector('.timer');
let second, minute, interval;

let counter = document.querySelector('.moves');
let starsList = document.querySelectorAll('.stars li');

let displayCongratulations = document.getElementById('congratulations');
let displayCredits = document.getElementById('credits');
let displayTutorial = document.getElementById('tutorial');

let modalContent = document.querySelector('.modal-content');
let restartBtn = document.querySelector('.restart').firstElementChild;

let btnCredits = document.querySelector('.credits');
let btnTutorial = document.querySelector('.tutorial');

/**
* @description Cards
*/
const cards = [{
  name: "bee",
  image: "media/bee.svg",
  },
  {
    name: "bird",
    image: "media/bird.svg",
  },
  {
    name: "chamelion",
    image: "media/chamelion.svg",
  },
  {
    name: "chick",
    image: "media/chick.svg",
  },
  {
    name: "chicken",
    image: "media/chicken.svg",
  },
  {
    name: "cow",
    image: "media/cow.svg",
  },
  {
    name: "dolphin",
    image: "media/dolphin.svg",
  },
  {
    name: "duck",
    image: "media/duck.svg",
  },
  {
    name: "elephant",
    image: "media/elephant.svg",
  },
  {
    name: "flamingo",
    image: "media/flamingo.svg",
  },
  {
    name: "fox",
    image: "media/fox.svg",
  },
  {
    name: "frog",
    image: "media/frog.svg",
  },
  {
    name: "monkey",
    image: "media/monkey.svg",
  },
  {
    name: "owl",
    image: "media/owl.svg",
  },
  {
    name: "pig",
    image: "media/pig.svg",
  },
  {
    name: "pigeon",
    image: "media/pigeon.svg",
  },
  {
    name: "redcardinal",
    image: "media/redcardinal.svg",
  },
  {
    name: "seahorse",
    image: "media/seahorse.svg",
  },
  {
    name: "snail",
    image: "media/snail.svg",
  },
  {
    name: "squirrel",
    image: "media/squirrel.svg",
  },
  {
    name: "tucan",
    image: "media/tucan.svg",
  },
  {
    name: "unicorn",
    image: "media/unicorn.svg",
  },
  {
    name: "whale",
    image: "media/whale.svg",
  }
];

/**
* @description Function executed as soon as the page is loaded
*/
document.body.onload = startGame();

/**
* @description Disable the context menu on the page
*/
document.oncontextmenu = function(event) {
 event.preventDefault();
}

/**
* @description Initializes the parameters of the game and calls a shuffle of the cards
*/
function startGame() {
  firstSelection = '';
  secondSelection = '';
  selections = 0;
  previousTarget = null;
  moves = 0;
  second = 0;
  minute = 0;
  counter.textContent = 0;
  timer.textContent = "- mins - secs";
  shuffle();
}

/**
* @description This function first shuffles the cards array then with the slice method reduces
*               it to 8 cards. Then doubles the new array and re-shuffles it.
*              Right after it builds the card front, retro and assigns a dataset
*               used to check if there is a correct match between 2 cards.
*              Last operation is to distribute the cards on the table.
*/
function shuffle() {
  cards.sort(function () {
    return 0.5 - Math.random();
  });
  let cardSlice = cards.slice(0, 8);
  let fullSet = cardSlice.concat(cardSlice).sort(function () {
    return 0.5 - Math.random();
});

fullSet.forEach(function (item) {
  const name = item.name;
  const image = item.image;

  const card = document.createElement('div'); // creates space for the card
  card.classList.add('card'); // adds the .card class
  card.dataset.name = name; // names the dataset, from the array

  const retro = document.createElement('div'); //creates the retro of the card
  retro.classList.add('retro'); // adds the .retro class

  const front = document.createElement('div');
  front.classList.add('front'); // adds the .front class
  front.style.backgroundImage = 'url(' + image + ')'; // adds the image to the front of the card

  table.appendChild(card); // the card is appended to the table
  card.appendChild(front); // front appended to the card
  card.appendChild(retro); // retro appended to the card
});
}

/**
* @description Main function of the script:
*              Firstly blocks unwanteded clicks on the page,
*               like on the table, on an already selected card, on matched cards.
*              If the click is allowed, it is called movesCounter() so moves and timer start counting.
*              The player is allowed to select no more than 2 cards, they receive the .selected class.
*              Their datasets are compared, if they are the same receive the .match class.
*              Both cards disappear from the table. The .selected class is removed.
*/
table.addEventListener('click', function (event) {

  let clicked = event.target;

  if (clicked.nodeName === 'SECTION' || clicked === previousTarget || clicked.parentNode.classList.contains('selected') || clicked.parentNode.classList.contains('match')) {
    return; // prevents these elements to be event.target
  }

  if (selections < 2) {
    if ( clicked.parentNode.classList.contains('card') && !(clicked.parentNode.classList.contains('selected')) && !(clicked.nodeName === 'SECTION') ) {
      movesCounter(); // starts counting moves if a first click is detected undere these conditions
    }
    selections++;
    previousTarget = clicked;
    if (selections === 1) {
      firstSelection = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');;
    } else {
      secondSelection = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    }

    if (firstSelection && secondSelection) { // if we have 2 selections
      if (firstSelection === secondSelection) { // if both dataset1 equals dataset2
        setTimeout(match, delay); // adds the .match class both of them
      }
      setTimeout(resetSelections, delay); // removes .selected class both cases match & nomatch
    }
  }
});

/**
* @description This function counts the moves and returns values for to rate the player.
*/
function movesCounter() {
  moves++;
  counter.textContent = moves;
  if (moves === 1) {
    timer.textContent = '0 mins 0 secs';
    startTimer(); //if there is a correct move the timer starts
  }
  if (moves > 32) {
    starsList[1].style.visibility = "hidden";
  } else if (moves > 28) {
    starsList[2].style.visibility = "hidden";
  }
}

/**
* @description The function of the timer. Since a player need no more than 1 minute to complete the
*               game, it is acceptable to count minutes only.
*              After 1 hour it will count from 61 minutes etc.
*/
function startTimer(){
  interval = setInterval(function() {
    timer.innerHTML = minute + ' mins ' + second + ' secs';
    second++;
    if (second === 60){
        minute++;
        second = 0;
    }
  }, 1000);
}

/**
* @description If 2 cards are correctly matched, this function adds the .match class to them.
*              It is called the matchCount() function counting and waiting for 16 cards matched.
*/
let match = function match() {
  const selected = document.querySelectorAll('.selected');
  selected.forEach(function (card) {
    card.classList.add('match');
  });
  matchCount();
};

/**
* @description Function counting how many cards are matched.
*              As soon as the count reaches 16 the timer is stopped, is displayed a congratulation *               message and all cards are revealed on the table.
*/
function matchCount() {
  const matchCount = document.getElementsByClassName('match');
  if (matchCount.length === 16) {
    clearInterval(interval);
    setTimeout(congratulations, delay);
    setTimeout(reveal, 0);
  }
}

/**
* @description If 2 cards are not correctly matched, this function removes the .selected class.
*/
let resetSelections = function resetSelections() {
  firstSelection = '';
  secondSelection = '';
  selections = 0;
  previousTarget = null;

  let selected = document.querySelectorAll('.selected');
  selected.forEach(function (card) {
    card.classList.remove('selected');
  });
};

/**
* @description Cleans the visibility of the stars.
*/
function resetStars() {
  starsList.forEach(function(item, i) {
    starsList[i].style.visibility = "initial";
  });
}

/**
* @description Event listener to restart the game.
*/
restartBtn.addEventListener('click', restart);

/**
* @description Function to restart the game
*/
function restart() {
  clearInterval(interval);
  resetStars();
  cleanTable();
  startGame();
}

/**
* @description Function to clean the table.
*/
function cleanTable() {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

/**
* @description Since matched cards disappear every matched couple, at the end of the game all the *               matched cards are shown instead of an empty table.
*/
function reveal() {
  for (let i = 0; i < 16; i++) {
    table.children[i].className = '' + 'card match selected';
  }
}

/**
* @description Congratulation message displayed when the player wins the game.
*/
function congratulations() {
  displayCongratulations.style.display = "block";
  modalContent.children[3].innerHTML = moves + ' moves';
  modalContent.children[5].textContent = timer.textContent;
  modalContent.children[7].innerHTML = document.querySelector('.stars').innerHTML;

  let playAgain = document.querySelector('.playAgain'); // button to play again
  playAgain.onclick = function() {
    restart();
    displayCongratulations.style.display = "none";
  }

  let span = document.getElementsByClassName('closeCongrats')[0]; // button to close the message
  span.onclick = function() {
    displayCongratulations.style.display = "none";
  }

  window.onclick = function(event) { // to close the message clicking elsewhere out of the message
    if (event.target === displayCongratulations) {
      displayCongratulations.style.display = 'none';
    }
  }
}

/**
* @description To display the credits.
*/
btnCredits.onclick = function credits() { // button to open the message
  displayCredits.style.display = "block";

  let span = document.getElementsByClassName('closeCredits')[0]; // button to close the message
  span.onclick = function() {
    displayCredits.style.display = "none";
  }

  window.onclick = function(event) { // to close the message clicking elsewhere out of the message
    if (event.target === displayCredits) {
      displayCredits.style.display = "none";
    }
  }
}

/**
* @description A simple tutorial.
*/
btnTutorial.onclick = function tutorial() { // button to open the message
  displayTutorial.style.display = "block";

  let span = document.getElementsByClassName('closeTutorial')[0]; // button to close the message
  span.onclick = function() {
    displayTutorial.style.display = "none";
  }

  window.onclick = function(event) { // to close the message clicking elsewhere out of the message
    if (event.target === displayTutorial) {
      displayTutorial.style.display = "none";
    }
  }
}
