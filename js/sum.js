import { cleanContent, createNumbersBlock, generateFinishButton, generateNumberLine, randomSort, ROWS_AMOUNT } from "./common.js";

const LEVELS_AMOUNT = 5;

const mainElement = document.querySelector('content');

function generateLevelsButtons() {
    const parent = document.querySelector('.levels');
    for (let i = 0; i < LEVELS_AMOUNT; i++) {
        const button = document.createElement('button');
        button.type = "button";
        button.classList.add('rounded', 'p-2', 'border', 'bg-blue-500', 'hover:bg-blue-700', 'text-white', 'cursor-pointer');
        button.textContent = i + 1;
        button.addEventListener('click', generateLevel);
        parent.appendChild(button);
    }
}

// TODO: implement different levels according to number
function generateLevel(levelNumber) {
    cleanContent();
    const exercises = new Map();
    generateContent({ message: '+1', value: 1 });
    generateContent({ message: '-1', value: -1 });

    for(let i = 0; i < 5;i++){
        generateData({ message: '+1', value: 1 }, exercises);
        generateData({ message: '-1', value: -1 }, exercises);
    }
    // const data = [...exercises.values()];
    // console.log(data)
    // generateContent2(data);
    generateFinishButton();
    document.querySelector('section').classList.remove('opacity-0');


}

function generateData(config, exercisesMap) {
    let generatedData = generateArr();

    generatedData.sort(randomSort).forEach(firstDigit => {
        exercisesMap.set(`${firstDigit} ${config.message} = `, firstDigit + config.value)
    });
}


function generateContent(config) {
    let numbersBlock = createNumbersBlock();
    let generatedData = generateArr();

    generatedData.sort(randomSort).forEach(firstDigit => {
        generateNumberLine(`${firstDigit} ${config.message} = `, firstDigit + config.value, numbersBlock);
    });
    mainElement.appendChild(numbersBlock);
    numbersBlock = createNumbersBlock();
}

function generateContent2(data) {
    let rowCounter = 0;
    let numbersBlock = createNumbersBlock();
  
    data.forEach(([message,value]) => {
      generateNumberLine(message, value, numbersBlock);
  
      if (++rowCounter === ROWS_AMOUNT) {
        mainElement.appendChild(numbersBlock);
        numbersBlock = createNumbersBlock();
        rowCounter = 0;
      }
    });
  }
  

function generateArr() {
    const arr = [];
    for (let i = 1, counter = 0; i < 10; i++) {
        arr.push(i);
        if (i === 9 && !counter) {
            counter++;
            i = 1;
        }
    }

    return arr;
}

generateLevelsButtons();