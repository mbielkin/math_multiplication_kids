import {
  animateButton,
  cleanContent,
  createNumbersBlock,
  generateFinishButton,
  generateNumberLine,
  randomSort,
} from "./common.js";

const ROWS_AMOUNT = 9;

const LEVELS_COMPLEXITY = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
};

const mainElement = document.querySelector('content');

document.querySelector('main').addEventListener('click', (event) => {
  const complexity = event.target.getAttribute('data-complexity');
  if (!complexity) {
    return;
  }

  animateButton(event.target);
  generateLevel(complexity);
  document.querySelector('section').classList.remove('opacity-0');
});

function generateLevel(complexity = LEVELS_COMPLEXITY.BASIC) {
  cleanContent();
  generateContent(complexity);
  generateFinishButton();
}

function generateFullArr() {
  let arr = [];

  for (let m = 1; m < 10; m++) {
    for (let n = 1; n < 10; n++) {
      arr.push([m, n]);
    }
  }

  return arr;
}

function generateContent(level) {
  let rowCounter = 0;
  let numbersBlock = createNumbersBlock();
  let generatedData = generateFullArr();

  if (level === LEVELS_COMPLEXITY.ADVANCED) {
    generatedData.sort(randomSort);
  }

  generatedData.forEach(([firstDigit, secondDigit]) => {
    generateNumberLine(`${firstDigit} x ${secondDigit} = `, firstDigit * secondDigit, numbersBlock);

    if (++rowCounter === ROWS_AMOUNT) {
      mainElement.appendChild(numbersBlock);
      numbersBlock = createNumbersBlock();
      rowCounter = 0;
    }
  });
}

