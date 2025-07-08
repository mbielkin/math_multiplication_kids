import {
  cleanContent,
  COLS_AMOUNT,
  createNumbersBlock,
  generateFinishButton,
  generateNumberLine,
  randomSort,
  ROWS_AMOUNT,
} from "./common.js";

const LEVELS_AMOUNT = 5;

const LEVELS_MAP = {
  1: generateDigitsLevel,
  2: generateDigitsLevel.bind(null, 3),
  3: generateDigitsLevel.bind(null, 5),
  4: generateDigitsLevel.bind(null, 7),
  5: generateDigitsLevel.bind(null, 9),
};

const mainElement = document.querySelector("content");

function generateLevelsButtons() {
  const parent = document.querySelector(".levels");
  for (let i = 0; i < LEVELS_AMOUNT; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(
      "rounded",
      "p-2",
      "border",
      "bg-blue-500",
      "hover:bg-blue-700",
      "text-white",
      "cursor-pointer"
    );
    button.textContent = i + 1;
    button.addEventListener("click", generateLevel);
    parent.appendChild(button);
  }
}

// TODO: implement different levels according to number
function generateLevel(event) {
  cleanContent();
  const levelNumber = parseInt(event.target.textContent);
  LEVELS_MAP[levelNumber]?.();
  // Timer will start with generateFinishButton
}

function generateDigitsLevel(limit) {
  const plusMap = new Map();
  const minusMap = new Map();
  const start = (!limit || limit < 5) ? 0 : (limit === 9 ? 2 : 1);

  for (let i = start; i <= (limit || 0); i++) {
    const value = limit ? i : 1;

    generateContentByMap({ message: `+ ${value}`, value: value, limit }, plusMap);
    generateContentByMap({ message: `- ${value}`, value: -value, limit }, minusMap);
  }

  if (!limit || limit < 5) {
    const data = [...plusMap.entries(), ...minusMap.entries()].slice(0, 20);

    for (let i = 0; i < COLS_AMOUNT - 2; i++) {
      generateContent(data.sort(randomSort));
    }
  }

  generateFinishButton();
  document.querySelector("section").classList.remove("opacity-0");
}

function generateContentByMap(config, map) {
  generateData(config, map);
  let resultArr = (!config.limit || config.limit <= 5) ? [...map.entries(), ...map.entries()] : [...map.entries()];

  generateContent(resultArr.sort(randomSort));
}

function generateContent(data) {
  let rowCounter = 0;
  let numbersBlock = createNumbersBlock();

  data.forEach(([message, value]) => {
    generateNumberLine(message, value, numbersBlock);

    if (++rowCounter === ROWS_AMOUNT) {
      mainElement.appendChild(numbersBlock);
      numbersBlock = createNumbersBlock();
      rowCounter = 0;
    }
  });
}

function generateData(config, exercisesMap) {
  const generatedData = generateArr(config.limit);
  const doubledArr = [...generatedData, ...generatedData];

  doubledArr.sort(randomSort).forEach((firstDigit) => {
    // to avoid negative answers
    if (config.value < 0 && config.value * -1 > firstDigit) {
      return;
    }

    exercisesMap.set(
      `${firstDigit} ${config.message} = `,
      firstDigit + config.value
    );
  });
}

function generateArr(limit = 10) {
  const arr = [];
  for (let i = 1; i <= limit; i++) {
    arr.push(i);
  }

  return arr;
}

generateLevelsButtons();
