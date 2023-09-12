import { words } from "./words.js";

const button = document.querySelector(".btn-enter");
const rows = document.querySelectorAll(".row");
const input = document.querySelector(".input");
const popup = document.querySelector(".pop-up");
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal__text");
const overlay = document.querySelector(".overlay");
const btnModal = document.querySelector(".btn-modal");

let attempt = 1;

// generating a random number, which will be used to get random word out of the words array
const randomNumber = function () {
  return Math.floor(Math.random() * words.length + 1);
};

// getting the guessing word
let word = words[randomNumber()];

// hint function, type hint() to the console to get the word
const hint = function () {
  console.log(word);
};

window.hint = hint;

// function that will render each letter to each tile and will style the background of the tile based on wether the letter is in the word and on the same index, or it is just in the word, or it is not in the word
const renderLetters = function (wordInput) {
  rows.forEach((rowEl) => {
    if (rowEl.classList[0] === `row-${attempt}`) {
      Array.from(rowEl.children).forEach((tile, i) => {
        tile.textContent = wordInput[i];

        if (word[i] === wordInput[i]) {
          tile.classList.add("correct");
        } else if (word.includes(wordInput[i])) {
          tile.classList.add("misplaced");
        } else {
          tile.classList.add("not-in-word");
        }
      });
    }
  });
};

// function that will reset everything to the initial state
const resetGame = function () {
  rows.forEach((rowEl) => {
    Array.from(rowEl.children).forEach((tile) => {
      tile.textContent = "";
      tile.classList.remove("correct");
      tile.classList.remove("misplaced");
      tile.classList.remove("not-in-word");
    });
  });
  attempt = 1;
  word = words[randomNumber()];
};

// function that add or removes hidden classes
const toggleClass = function () {
  modal.classList.toggle("modal__hidden");
  overlay.classList.toggle("hidden");
};

// main function that combines everything together
const game = function () {
  const wordInput = input.value.trim().toLocaleLowerCase();
  const inList = words.includes(wordInput);

  // if the word is not in the array, render an alert and return the function
  if (!inList) {
    popup.classList.remove("hidden");
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 3500);
    input.value = "";
    return;
  }

  renderLetters(wordInput);

  // if the user guesses the word, render a modal window with a button that will reset everything
  if (word === wordInput) {
    toggleClass();
    modalText.textContent = `Uhádnuto na ${attempt} ${
      attempt > 1 ? "pokusy/ů" : "pokus"
    }`;

    btnModal.addEventListener(
      "click",
      function () {
        resetGame();
        toggleClass();
      },
      { once: true }
    );
    // if the user won't guess the word within the limit of 6 attempts, render a modal window with a button that will reset everything
  } else if (attempt === 6) {
    toggleClass();
    modalText.textContent = "Pokusy byly vyčerpány";

    btnModal.addEventListener(
      "click",
      function () {
        resetGame();
        toggleClass();
      },
      { once: true }
    );
  }

  // increasing attempt so the next word will be rendered on the next row
  attempt++;
  input.value = "";
};

// DOM manipulation

button.addEventListener("click", function () {
  game();
});

document.body.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && input.value) {
    game();
  }
});
