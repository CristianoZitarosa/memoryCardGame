'use strict';

/**
* @description Declarations that can be separated from functions without loose meaning.
*/
const table = document.getElementById('table');
const fragment = document.createDocumentFragment();

let firstSelection = '';
let secondSelection = '';
let selections = 0;
let previousTarget = null;
let delay = 1200;
let moves = 0;
let counter = document.querySelector('.moves');
let starsList = document.querySelectorAll('.stars li');

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
    name: "chicken",
    image: "media/chicken.svg",
  },
  {
    name: "duck",
    image: "media/duck.svg",
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
    name: "snail",
    image: "media/snail.svg",
  },
];

/**
* @description Function to call as soon as the page is loaded
*/
document.body.onload = startGame();

/**
* @description This function first doubles the cards array and shuffles them.
*              Then builds the card front, retro and assigns a dataset used to check the match.
*              Last operation is to distribute the cards on the table.
*/
function shuffle() {
let fullSet = cards.concat(cards).sort(function () {
  return 0.5 - Math.random();
});

fullSet.forEach(function (item) {
  const name = item.name;
  const image = item.image;

  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.name = item.name;

  const retro = document.createElement('div');
  retro.classList.add('retro');

  const front = document.createElement('div');
  front.classList.add('front');
  front.style.backgroundImage = 'url(' + image + ')';

  fragment.appendChild(card);
  card.appendChild(front);
  card.appendChild(retro);
});
table.appendChild(fragment);
}

/**
* @description This function is called to add the class .match for 2 cards correctly paired.
*/
let match = function match() {
  const selected = document.querySelectorAll('.selected');
  selected.forEach(function (card) {
    card.classList.add('match');
  });
  matched();
};

/**
* @description This function remove the class .selected to 2 cards not correctly paired.
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
* @description This function resets the status of the cards and related parameter for the checks.
*/
let resetCardStatus = function resetCardStatus() {
  firstSelection = '';
  secondSelection = '';
  selections = 0;
  previousTarget = null;

  let selected = document.querySelectorAll('.selected, .match');
  selected.forEach(function (card) {
    card.classList.remove('selected, .match');
  });
};

/**
* @description This function counts the moves and returns values for the rating.
*/
function movesCounter() {
  moves++;
  counter.textContent = moves;
  if (moves === 1) {
    timer.textContent = '0 mins 0 secs';
    startTimer();
  }
  if (moves > 32) {
    starsList[1].style.visibility = "hidden";
  } else if (moves > 26) {
    starsList[2].style.visibility = "hidden";
  }
}

/**
* @description Main function of the script:
*              Firstly blocks unwanteded clicks on the page,
*              like on the table, on a card already selected, on matched cards.
*              If the click is allowed, movesCounter is called so moves and timer start counting.
*              The player is allowed to select no more than 2 cards, they receive the .selected class.
*              If their datasets are the same they are matched and receive the .match class.
*              Both cards disappear from the table. The class .selected is cleaned.
*/
table.addEventListener('click', function (event) {

  let clicked = event.target;

  if (clicked.nodeName === 'SECTION' || clicked === previousTarget || clicked.parentNode.classList.contains('selected') || clicked.parentNode.classList.contains('match')) {
    return;
  }

  if (selections < 2) {
    if ( clicked.parentNode.classList.contains('card') && !(clicked.parentNode.classList.contains('selected')) && !(clicked.nodeName === 'SECTION') ) {
      movesCounter();
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

    if (firstSelection && secondSelection) {
      if (firstSelection === secondSelection) {
        setTimeout(match, delay);
      }
      setTimeout(resetSelections, delay);
    }
  }
});

/**
* @description Disable the context menu on the page.
*/
document.oncontextmenu = function(event) {
 event.preventDefault();
}

/**
* @description The function of the timer. Since a player need no more than 1 minute to complete the
*              game, it is acceptable to count minutes only even after 1 hour rather than add an hours *              counter.
*/

let timer = document.querySelector('.timer');
let second = 0, minute = 0;
let interval;
function startTimer(){
  interval = setInterval(function(){
    timer.innerHTML = minute + ' mins ' + second + ' secs';
    second++;
    if(second === 60){
        minute++;
        second = 0;
    }
  }, 1000);
}

/**
* @description Since matched cards disappear every matched couple, at the end of the game, after the
*              congratulations message, if the player does not play again, closing the modal
*              will show all the matched cards instead of a white table.
*/
function reveal() {
  for (let i = 0; i < 16; i++) {
    table.children[i].className = '' + 'card match selected';
  }
}

/**
* @description DFunction to display the congratulations message when all cards are paired.
*/
function matched() {
  const matched = document.getElementsByClassName('match');
  if (matched.length === 16) {
    clearInterval(interval);
    congratulations();
  }
}

/**
* @description Function to clean everything not related to cards like table, moves, scores.
*              It is also called the resetCardStatus() to clean status of cards.
*              The game starts again calling startGame().
*/
function generalReset() {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  clearInterval(interval);
  moves = 0;
  second = 0;
  minute = 0;
  counter.textContent = 0;
  timer.textContent = "- mins - secs"
  for(let i=0; i < 3; i++) {
    starsList[i].style.visibility = "initial";
  }
  resetCardStatus();
  startGame();
}

/**
* @description Event listener to restart the game.
*/
let restart = document.querySelector('.restart').firstElementChild;
restart.addEventListener('click', () => {
  generalReset();
});

/**
* @description Congratulation message displayed when the player wins the game.
*/
let displayCongratulations = document.getElementById('congratulations');
let modalContent = document.querySelector('.modal-content');
function congratulations() {
  displayCongratulations.style.display = "block";
  modalContent.children[3].innerHTML = moves + ' moves';
  modalContent.children[5].textContent = timer.textContent;
  modalContent.children[7].innerHTML = document.querySelector('.stars').innerHTML;

  let playAgain = document.querySelector('.playAgain');
  playAgain.onclick = function() {
    generalReset();
    displayCongratulations.style.display = "none";
  }

  let span = document.getElementsByClassName('closeCongrats')[0];
  span.onclick = function() {
    displayCongratulations.style.display = "none";
    reveal();
  }

  window.onclick = function(event) {
    if (event.target === displayCongratulations) {
      displayCongratulations.style.display = 'none';
      reveal();
    }
  }
}

/**
* @description To display the credits.
*/
let displayCredits = document.getElementById('credits');
let btnCredits = document.querySelector('.credits');
btnCredits.onclick = function credits() {
  displayCredits.style.display = "block";

  let span = document.getElementsByClassName('closeCredits')[0];
  span.onclick = function() {
    displayCredits.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target === displayCredits) {
      displayCredits.style.display = "none";
    }
  }
}

/**
* @description A simple tutorial.
*/
let displayTutorial = document.getElementById('tutorial');
let btnTutorial = document.querySelector('.tutorial');
btnTutorial.onclick = function tutorial() {
  displayTutorial.style.display = "block";

  let span = document.getElementsByClassName('closeTutorial')[0];
  span.onclick = function() {
    displayTutorial.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target === displayTutorial) {
      displayTutorial.style.display = "none";
    }
  }
}
