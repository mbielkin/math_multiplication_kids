import {
  animateButton,
  cleanContent,
  createNumbersBlock,
  generateFinishButton,
  generateNumberLine,
  randomSort,
  resetTimer,
} from "./common.js";

const configs = {
  multiply: {
    generateFullArr: () => {
      let arr = [];
      for (let m = 1; m < 10; m++) {
        for (let n = 1; n < 10; n++) {
          arr.push([m, n]);
        }
      }
      return arr;
    },
    getQuestion: ([a, b]) => `${a} x ${b} = `,
    getResult: ([a, b]) => a * b,
    getTableKey: ([a]) => a,
    title: "Умножение",
  },
  divide: {
    generateFullArr: () => {
      let arr = [];
      for (let divisor = 1; divisor < 10; divisor++) {
        for (let result = 1; result < 10; result++) {
          arr.push([divisor * result, divisor]);
        }
      }
      return arr;
    },
    getQuestion: ([a, b]) => `${a} ÷ ${b} = `,
    getResult: ([a, b]) => a / b,
    getTableKey: ([, divisor]) => divisor,
    title: "Деление",
  },
};

const mode = document.body.dataset.mode || "multiply";
const config = configs[mode];
const ROWS_AMOUNT = 9;
const LEVELS_COMPLEXITY = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
};
const mainElement = document.querySelector('content');

let selectedTable = 'all';
let currentComplexity = null;

document.querySelector('main').addEventListener('click', (event) => {
  const table = event.target.getAttribute('data-table');
  if (table !== null) {
    selectedTable = table;
    animateButton(event.target);
    updateTableButtonsUI();
    if (currentComplexity) {
      resetTimer();
      generateLevel(currentComplexity);
      document.querySelector('section').classList.remove('opacity-0');
    }
    return;
  }

  const complexity = event.target.getAttribute('data-complexity');
  if (!complexity) {
    return;
  }
  currentComplexity = complexity;
  animateButton(event.target);
  resetTimer();
  generateLevel(complexity);
  document.querySelector('section').classList.remove('opacity-0');
});

function updateTableButtonsUI() {
  document.querySelectorAll('[data-table]').forEach((button) => {
    const isActive = button.getAttribute('data-table') === selectedTable;
    button.classList.toggle('bg-indigo-500', isActive);
    button.classList.toggle('hover:bg-indigo-600', isActive);
    button.classList.toggle('ring-2', isActive);
    button.classList.toggle('ring-white/50', isActive);
    button.classList.toggle('bg-slate-700', !isActive);
    button.classList.toggle('hover:bg-slate-600', !isActive);
  });
}

function generateLevel(complexity = LEVELS_COMPLEXITY.BASIC) {
  cleanContent();
  generateContent(complexity);
  generateFinishButton();
}

function generateContent(level) {
  let rowCounter = 0;
  let numbersBlock = createNumbersBlock();
  let generatedData = config.generateFullArr();
  if (selectedTable !== 'all') {
    const tableNum = parseInt(selectedTable, 10);
    generatedData = generatedData.filter((pair) => config.getTableKey(pair) === tableNum);
  }
  if (level === LEVELS_COMPLEXITY.ADVANCED) {
    generatedData.sort(randomSort);
  }
  generatedData.forEach((pair) => {
    generateNumberLine(config.getQuestion(pair), config.getResult(pair), numbersBlock);
    if (++rowCounter === ROWS_AMOUNT) {
      mainElement.appendChild(numbersBlock);
      numbersBlock = createNumbersBlock();
      rowCounter = 0;
    }
  });
  if (rowCounter > 0) {
    mainElement.appendChild(numbersBlock);
  }
}

updateTableButtonsUI();
