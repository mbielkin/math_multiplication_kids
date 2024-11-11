import { animateButton, cleanContent, createNumbersBlock, generateFinishButton, randomSort } from "./common.js";

const LEVELS_COMPLEXITY = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
};

const ROWS_AMOUNT = 9;

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
    generateNumberLine(firstDigit, secondDigit, numbersBlock);

    if (++rowCounter === ROWS_AMOUNT) {
      mainElement.appendChild(numbersBlock);
      numbersBlock = createNumbersBlock();
      rowCounter = 0;
    }
  });
}

function generateNumberLine(firstDigit, secondDigit, numberBlock) {
  const parentElement = document.createElement('div');
  parentElement.classList.add('flex');

  const line = document.createElement('span');
  line.classList.add('whitespace-nowrap');
  line.textContent = `${firstDigit} x ${secondDigit} = `;

  let userInputElement = document.createElement('input');
  userInputElement.type = 'text';
  userInputElement.classList.add('rounded', 'border', 'grow')

  let hiddenResultElement = document.createElement('input');
  hiddenResultElement.type = 'hidden';
  hiddenResultElement.value = firstDigit * secondDigit;

  parentElement.appendChild(line);
  parentElement.appendChild(userInputElement);
  parentElement.appendChild(hiddenResultElement);
  numberBlock.appendChild(parentElement);
}