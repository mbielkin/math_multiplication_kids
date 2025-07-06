// Division mode for kids, similar to multiplication mode
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
  for (let divisor = 1; divisor < 10; divisor++) {
    for (let result = 1; result < 10; result++) {
      arr.push([divisor * result, divisor]); // e.g. 6 / 2 = 3
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

  generatedData.forEach(([dividend, divisor]) => {
    generateNumberLine(`${dividend} ÷ ${divisor} = `, dividend / divisor, numbersBlock);
    if (++rowCounter === ROWS_AMOUNT) {
      mainElement.appendChild(numbersBlock);
      numbersBlock = createNumbersBlock();
      rowCounter = 0;
    }
  });
}
