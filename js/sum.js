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

// Todo: create function that create all this generated doubled data in more nice way

    generateData({ message: '+ 1', value: 1 }, exercises);
    generateContent2([...exercises.entries(), ...exercises.entries()].sort(randomSort));
    exercises.clear();
    
    generateData({ message: '- 1', value: -1 }, exercises);
    generateContent2([...exercises.entries(), ...exercises.entries()].sort(randomSort));
    exercises.clear();

    generateData({ message: '+ 1', value: 1 }, exercises);
    generateData({ message: '- 1', value: -1 }, exercises);

    const data = [...exercises.entries(), ...exercises.entries()];
    for (let i = 0; i < 2; i++) {
      generateContent2(data.sort(randomSort));
    }
    generateFinishButton();
    document.querySelector('section').classList.remove('opacity-0');


}

function generateData(config, exercisesMap) {
    let generatedData = generateArr();

    generatedData.sort(randomSort).forEach(firstDigit => {
        exercisesMap.set(`${firstDigit} ${config.message} = `, firstDigit + config.value)
    });
}

function generateContent2(data) {
    let rowCounter = 0;
    let numbersBlock = createNumbersBlock();
console.log(data);

    data.forEach(([message,value]) => {
      generateNumberLine(message, value, numbersBlock);
  
      if (++rowCounter === (ROWS_AMOUNT*2)+1) {
        mainElement.appendChild(numbersBlock);
        numbersBlock = createNumbersBlock();
        rowCounter = 0;
      }
    });
  }
  

function generateArr() {
    const arr = [];
    const limit = 10;
    for (let i = 1, counter = 0; i <= limit; i++) {
        arr.push(i);
        if (i === limit && !counter) {
            counter++;
            i = 1;
        }
    }
console.log(arr);

    return arr;
}

generateLevelsButtons();