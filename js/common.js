import { recordSession } from './progress.js';

export const ROWS_AMOUNT = 20;
export const COLS_AMOUNT = 6;

export const animateButton = button => button.classList.add('animate-spin-one-time');

export const cleanContent = () => {
  document.querySelector('content').innerHTML = '';
  document.querySelector('.finish-button')?.remove();
  document.querySelector('.retry-button')?.remove();
}

export const createNumbersBlock = () => {
  const numbersBlock = document.createElement('div');
  numbersBlock.classList.add('number-block', 'transition');

  return numbersBlock;
}

export const randomSort = () => Math.random() - 0.5;

let timerInterval = null;
let startTime = null;
let timerElement = null;
let paused = false;
let pauseStart = null;
let pausedTime = 0;
let lastElapsedSeconds = 0;

export const generateFinishButton = () => {
  const timerContainer = document.querySelector('.timer-container');
  timerContainer.innerHTML = ''; // Clear previous buttons if any
  const checkButton = document.createElement('button');
  checkButton.type = 'button';
  checkButton.textContent = 'Проверить';
  checkButton.classList.add('finish-button', 'w-80', 'rounded', 'border', 'bg-green-400', 'font-bold', 'text-white');

  checkButton.addEventListener('click', () => {
    stopTimer();
    checkValues();
  });

  document.querySelector('main').appendChild(checkButton);

  // Timer UI
  timerElement = document.createElement('div');
  timerElement.classList.add('timer', 'text-lg', 'font-bold', 'mb-4', 'text-center');
  timerElement.textContent = 'Время: 0.0 сек';
  timerContainer.appendChild(timerElement);

  // Pause/Resume Button
  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.textContent = 'Пауза';
  pauseButton.classList.add('pause-button', 'w-40', 'rounded', 'border', 'bg-yellow-400', 'font-bold', 'text-black', 'ml-4');
  pauseButton.addEventListener('click', () => {
    if (!paused) {
      pauseTimer();
      pauseButton.textContent = 'Продолжить';
    } else {
      resumeTimer();
      pauseButton.textContent = 'Пауза';
    }
  });
  timerContainer.appendChild(pauseButton);

  startTimer();
}

function startTimer() {
  stopTimer();
  startTime = Date.now();
  paused = false;
  pausedTime = 0;
  updateTimer();
  timerInterval = setInterval(updateTimer, 100);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  updateTimer(true);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    paused = true;
    pauseStart = Date.now();
  }
}

function resumeTimer() {
  if (paused) {
    pausedTime += Date.now() - pauseStart;
    paused = false;
    pauseStart = null;
    timerInterval = setInterval(updateTimer, 100);
  }
}

function updateTimer(finish = false) {
  if (!timerElement || !startTime) return;
  let elapsed = (Date.now() - startTime - pausedTime) / 1000;
  lastElapsedSeconds = elapsed;
  let timeStr = '';
  if (elapsed >= 60) {
    const mins = Math.floor(elapsed / 60);
    const secs = (elapsed % 60).toFixed(1).padStart(4, '0');
    timeStr = `Время: ${mins} мин ${secs} сек`;
  } else {
    timeStr = `Время: ${elapsed.toFixed(1)} сек`;
  }
  timerElement.textContent = timeStr + (finish ? ' (завершено)' : '');
}

export function getElapsedSeconds() {
  return lastElapsedSeconds;
}

export function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  startTime = null;
  if (timerElement) {
    timerElement.remove();
    timerElement = null;
  }
}

export const checkValues = () => {
  const correctColorName = 'border-green-400';
  const errorColorName = 'border-red-400';
  let userInputs = Array.from(document.querySelectorAll('input'));
  let correctCount = 0;
  let total = 0;
  const wrongItems = [];
  userInputs.forEach((input, index) => {
    if (input.type !== 'text') {
      return;
    }
    total++;
    // Find the hidden input sibling for the correct answer
    const parent = input.parentElement;
    const hidden = parent && parent.querySelector('input[type="hidden"]');
    const correctValue = hidden ? hidden.value : null;
    if (input.value.trim() === String(correctValue)) {
      input.classList.add(correctColorName);
      input.classList.remove(errorColorName);
      correctCount++;
    } else {
      input.classList.add(errorColorName);
      input.classList.remove(correctColorName);
      wrongItems.push({
        message: parent?.dataset.message ?? '',
        answer: correctValue,
      });
    }
  });

  document.querySelector('.retry-button')?.remove();

  const mode = document.body.dataset.mode || 'exercise';
  const stats = recordSession(mode, { correct: correctCount, total, seconds: getElapsedSeconds() });

  // Show result summary and time
  if (timerElement) {
    const result = document.createElement('div');
    result.classList.add('result-summary', 'text-center', 'mt-4', 'font-bold');
    let text = `Правильных ответов: ${correctCount} из ${total}. ${timerElement.textContent}`;
    if (stats) {
      text += ` Серия идеальных раундов: ${stats.streak} (рекорд: ${stats.bestStreak}).`;
    }
    result.textContent = text;
    timerElement.parentElement.appendChild(result);
  }

  if (wrongItems.length > 0) {
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = `Повторить ошибки (${wrongItems.length})`;
    retryButton.classList.add('retry-button', 'w-80', 'block', 'mx-auto', 'mt-4', 'rounded', 'border', 'bg-yellow-500', 'font-bold', 'text-black');
    retryButton.addEventListener('click', () => startRetryRound(wrongItems));
    document.querySelector('main').appendChild(retryButton);
  }
}

export const startRetryRound = (items) => {
  document.querySelector('.retry-button')?.remove();
  cleanContent();
  const block = createNumbersBlock();
  items.forEach(({ message, answer }) => generateNumberLine(message, answer, block));
  document.querySelector('content').appendChild(block);
  generateFinishButton();
  document.querySelector('section').classList.remove('opacity-0');
}

export const generateNumberLine = (message, result, numberBlock) => {
  const parentElement = document.createElement('div');
  parentElement.classList.add('flex');
  parentElement.dataset.message = message;
  parentElement.dataset.answer = result;

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