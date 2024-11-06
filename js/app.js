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
});

function animateButton(button) {
  button.classList.add('animate-spin-one-time');
}

function cleanContent() {
  document.querySelector('content').innerHTML = '';
  document.querySelector('.finish-button')?.remove();
}

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

function createNumbersBlock() {
  const numbersBlock = document.createElement('div');
  numbersBlock.classList.add('number-block', 'transition');

  return numbersBlock;
}

function generateContent(level) {
  let rowCounter = 0;
  let numbersBlock = createNumbersBlock();
  let generatedData = generateFullArr();

  if (level === LEVELS_COMPLEXITY.ADVANCED) {
    generatedData.sort(() => Math.random() - 0.5);
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

function generateFinishButton() {
  const checkButton = document.createElement('button');
  checkButton.type = 'button';
  checkButton.textContent = 'Проверить';
  checkButton.classList.add('finish-button', 'w-80', 'rounded', 'border', 'bg-green-400', 'font-bold', 'text-white');

  checkButton.addEventListener('click', checkValues);
  document.querySelector('main').appendChild(checkButton);
}

function checkValues() {
  const correctColorName = 'border-green-400';
  const errorColorName = 'border-red-400';
  let userInputs = Array.from(document.querySelectorAll('input'));
  userInputs.forEach((input, index) => {
    if (input.type !== 'text') {
      return;
    }

    input.value === userInputs[index + 1].value
      ? (input.classList.add(correctColorName), input.classList.remove(errorColorName))
      : (input.classList.add(errorColorName), input.classList.remove(correctColorName));
  });
}
