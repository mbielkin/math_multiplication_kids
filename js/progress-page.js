import { getAllStats, resetAllProgress, MODE_LABELS } from './progress.js';

const MODE_STYLES = {
  multiply: { icon: '✖️', accent: 'border-indigo-400', bar: 'bg-indigo-400' },
  divide: { icon: '➗', accent: 'border-teal-400', bar: 'bg-teal-400' },
  sum: { icon: '➕', accent: 'border-rose-400', bar: 'bg-rose-400' },
};

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
}

function renderStats() {
  const container = document.getElementById('progress-content');
  container.innerHTML = '';

  Object.entries(MODE_LABELS).forEach(([mode, label]) => {
    const stats = getAllStats()[mode];
    const style = MODE_STYLES[mode];
    const card = document.createElement('div');
    card.className = `p-5 border-l-4 rounded-2xl bg-slate-800/60 shadow-md ${style.accent}`;

    if (!stats || !stats.sessions.length) {
      card.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-2xl">${style.icon}</span>
          <h2 class="text-xl font-extrabold">${label}</h2>
        </div>
        <p class="mt-2 text-slate-300">Пока нет результатов. Попробуй порешать примеры!</p>
      `;
      container.appendChild(card);
      return;
    }

    const sessions = stats.sessions;
    const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
    const totalAnswered = sessions.reduce((sum, s) => sum + s.total, 0);
    const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const last = sessions[sessions.length - 1];

    card.innerHTML = `
      <div class="flex items-center gap-2 mb-3">
        <span class="text-2xl">${style.icon}</span>
        <h2 class="text-xl font-extrabold">${label}</h2>
      </div>
      <ul class="flex flex-col gap-1 text-slate-200">
        <li>Раундов сыграно: <span class="font-bold">${sessions.length}</span></li>
        <li>Средняя точность: <span class="font-bold">${accuracy}%</span></li>
        <li>Текущая серия идеальных раундов: <span class="font-bold">${stats.streak}</span></li>
        <li>Лучшая серия: <span class="font-bold">${stats.bestStreak}</span></li>
        <li>Последний раунд: <span class="font-bold">${last.correct} из ${last.total}</span> (${formatDate(last.date)})</li>
      </ul>
      <div class="w-full h-2 mt-3 overflow-hidden rounded-full bg-slate-700">
        <div class="h-full ${style.bar} rounded-full" style="width: ${accuracy}%"></div>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('reset-progress').addEventListener('click', () => {
  if (confirm('Точно сбросить весь прогресс?')) {
    resetAllProgress();
    renderStats();
  }
});

renderStats();
