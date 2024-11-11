export const ROWS_AMOUNT = 9;

export const animateButton = button => button.classList.add('animate-spin-one-time');

export const cleanContent = () => {
  document.querySelector('content').innerHTML = '';
  document.querySelector('.finish-button')?.remove();
}

export const createNumbersBlock = () => {
  const numbersBlock = document.createElement('div');
  numbersBlock.classList.add('number-block', 'transition');

  return numbersBlock;
}

export const randomSort = () => Math.random() - 0.5;

export const generateFinishButton = () => {
  const checkButton = document.createElement('button');
  checkButton.type = 'button';
  checkButton.textContent = 'Проверить';
  checkButton.classList.add('finish-button', 'w-80', 'rounded', 'border', 'bg-green-400', 'font-bold', 'text-white');

  checkButton.addEventListener('click', checkValues);
  document.querySelector('main').appendChild(checkButton);
}

export const checkValues = () => {
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

export const generateNumberLine = (message, result, numberBlock) => {
    const parentElement = document.createElement('div');
    parentElement.classList.add('flex');
  
    const line = document.createElement('span');
    line.classList.add('whitespace-nowrap');
    line.textContent = message;
  
    let userInputElement = document.createElement('input');
    userInputElement.type = 'text';
    userInputElement.classList.add('rounded', 'border', 'grow')
  
    let hiddenResultElement = document.createElement('input');
    hiddenResultElement.type = 'hidden';
    hiddenResultElement.value = result;
  
    parentElement.appendChild(line);
    parentElement.appendChild(userInputElement);
    parentElement.appendChild(hiddenResultElement);
    numberBlock.appendChild(parentElement);
  }