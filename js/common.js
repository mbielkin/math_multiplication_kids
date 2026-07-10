import { recordSession } from './progress.js';

export const ROWS_AMOUNT = 20;
export const COLS_AMOUNT = 6;

export const animateButton = button => button.classList.add('animate-spin-one-time');

export const cleanContent = () => {
  document.querySelector('content').innerHTML = '';
}

export const createNumbersBlock = () => {
  const numbersBlock = document.createElement('div');
  numbersBlock.classList.add(
    'number-block', 'transition',
    'flex', 'flex-col', 'gap-2',
    'p-4', 'max-w-[240px]',
    'bg-slate-800/60', 'border', 'border-slate-700/60',
    'rounded-2xl', 'shadow-md'
  );

  return numbersBlock;
}

export const randomSort = () => Math.random() - 0.5;

const INPUT_NEUTRAL = ['bg-slate-50', 'border-slate-300'];
const INPUT_CORRECT = ['bg-emerald-50', 'border-emerald-400'];
const INPUT_WRONG = ['bg-rose-50', 'border-rose-400'];

const setInputState = (input, state) => {
  input.classList.remove(...INPUT_NEUTRAL, ...INPUT_CORRECT, ...INPUT_WRONG);
  input.classList.add(...state);
}

const BUTTON_BASE = [
  'rounded-full', 'font-extrabold', 'shadow-md',
  'hover:shadow-lg', 'hover:-translate-y-0.5', 'active:translate-y-0',
  'transition-all', 'duration-200',
];

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
  timerContainer.classList.add('flex', 'flex-col', 'items-center', 'gap-4', 'my-6');

  // Timer UI
  timerElement = document.createElement('div');
  timerElement.classList.add(
    'timer', 'text-lg', 'font-extrabold', 'text-center',
    'px-5', 'py-2', 'rounded-full', 'bg-slate-800', 'text-slate-100', 'shadow-inner'
  );
  timerElement.textContent = '⏱️ Время: 0.0 сек';
  timerContainer.appendChild(timerElement);

  const buttonsRow = document.createElement('div');
  buttonsRow.classList.add('flex', 'flex-wrap', 'justify-center', 'gap-3');
  timerContainer.appendChild(buttonsRow);

  const checkButton = document.createElement('button');
  checkButton.type = 'button';
  checkButton.textContent = '✅ Проверить';
  checkButton.classList.add('finish-button', 'px-6', 'py-3', 'text-lg', 'text-white', 'bg-emerald-500', 'hover:bg-emerald-600', ...BUTTON_BASE);
  checkButton.addEventListener('click', () => {
    stopTimer();
    checkValues();
  });
  buttonsRow.appendChild(checkButton);

  // Pause/Resume Button
  const pauseButton = document.createElement('button');
  pauseButton.type = 'button';
  pauseButton.textContent = '⏸️ Пауза';
  pauseButton.classList.add('pause-button', 'px-6', 'py-3', 'text-lg', 'text-slate-900', 'bg-amber-400', 'hover:bg-amber-500', ...BUTTON_BASE);
  pauseButton.addEventListener('click', () => {
    if (!paused) {
      pauseTimer();
      pauseButton.textContent = '▶️ Продолжить';
    } else {
      resumeTimer();
      pauseButton.textContent = '⏸️ Пауза';
    }
  });
  buttonsRow.appendChild(pauseButton);

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
    timeStr = `⏱️ Время: ${mins} мин ${secs} сек`;
  } else {
    timeStr = `⏱️ Время: ${elapsed.toFixed(1)} сек`;
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
  let userInputs = Array.from(document.querySelectorAll('input'));
  let correctCount = 0;
  let total = 0;
  const wrongItems = [];
  userInputs.forEach((input) => {
    if (input.type !== 'text') {
      return;
    }
    total++;
    // Find the hidden input sibling for the correct answer
    const parent = input.parentElement;
    const hidden = parent && parent.querySelector('input[type="hidden"]');
    const correctValue = hidden ? hidden.value : null;
    if (input.value.trim() === String(correctValue)) {
      setInputState(input, INPUT_CORRECT);
      correctCount++;
    } else {
      setInputState(input, INPUT_WRONG);
      wrongItems.push({
        message: parent?.dataset.message ?? '',
        answer: correctValue,
      });
    }
  });

  const mode = document.body.dataset.mode || 'exercise';
  const stats = recordSession(mode, { correct: correctCount, total, seconds: getElapsedSeconds() });

  // Show result summary and time
  if (timerElement) {
    const isPerfect = total > 0 && correctCount === total;
    const result = document.createElement('div');
    result.classList.add(
      'result-summary', 'text-center', 'font-extrabold', 'text-lg',
      'px-5', 'py-3', 'rounded-2xl', 'bg-slate-800/70'
    );
    if (isPerfect) {
      result.classList.add('animate-pop');
    }
    let text = isPerfect
      ? `🎉 Отлично! Все ${total} верно! `
      : `Правильных ответов: ${correctCount} из ${total}. `;
    text += timerElement.textContent;
    if (stats) {
      text += ` Серия идеальных раундов: ${stats.streak} (рекорд: ${stats.bestStreak}).`;
    }
    result.textContent = text;
    timerElement.parentElement.appendChild(result);
  }

  if (wrongItems.length > 0) {
    const retryButton = document.createElement('button');
    retryButton.type = 'button';
    retryButton.textContent = `🔁 Повторить ошибки (${wrongItems.length})`;
    retryButton.classList.add('retry-button', 'px-6', 'py-3', 'text-lg', 'text-white', 'bg-rose-500', 'hover:bg-rose-600', ...BUTTON_BASE);
    retryButton.addEventListener('click', () => startRetryRound(wrongItems));
    document.querySelector('.timer-container').appendChild(retryButton);
  }
}

export const startRetryRound = (items) => {
  cleanContent();
  const block = createNumbersBlock();
  items.forEach(({ message, answer }) => generateNumberLine(message, answer, block));
  document.querySelector('content').appendChild(block);
  generateFinishButton();
  document.querySelector('section').classList.remove('opacity-0');
}

export const generateNumberLine = (message, result, numberBlock) => {
  const parentElement = document.createElement('div');
  parentElement.classList.add('flex', 'items-center', 'gap-2');
  parentElement.dataset.message = message;
  parentElement.dataset.answer = result;

  const line = document.createElement('span');
  line.classList.add('whitespace-nowrap', 'font-bold', 'text-slate-200', 'min-w-[70px]');
  line.textContent = message;

  let userInputElement = document.createElement('input');
  userInputElement.type = 'text';
  userInputElement.setAttribute('inputmode', 'numeric');
  userInputElement.classList.add(
    'grow', 'w-24', 'text-center', 'font-bold', 'text-lg',
    'text-slate-800', 'px-2', 'py-1.5',
    'rounded-xl', 'border-2',
    'transition-colors', 'duration-200',
    'focus:outline-none', 'focus:border-indigo-400', 'focus:ring-2', 'focus:ring-indigo-400/40',
    ...INPUT_NEUTRAL
  );

  let hiddenResultElement = document.createElement('input');
  hiddenResultElement.type = 'hidden';
  hiddenResultElement.value = result;

  parentElement.appendChild(line);
  parentElement.appendChild(userInputElement);
  parentElement.appendChild(hiddenResultElement);
  numberBlock.appendChild(parentElement);
}
