import { getAllStats, resetAllProgress, MODE_LABELS } from './progress.js';

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
}

function renderStats() {
  const container = document.getElementById('progress-content');
  container.innerHTML = '';
  const allStats = getAllStats();

  Object.entries(MODE_LABELS).forEach(([mode, label]) => {
    const stats = allStats[mode];
    const card = document.createElement('div');
    card.classList.add('p-4', 'border', 'border-gray-700', 'rounded', 'bg-gray-900');

    if (!stats || !stats.sessions.length) {
      card.innerHTML = `<h2 class="mb-2 text-xl font-bold">${label}</h2><p>Пока нет результатов. Попробуй порешать примеры!</p>`;
      container.appendChild(card);
      return;
    }

    const sessions = stats.sessions;
    const totalCorrect = sessions.reduce((sum, s) => sum + s.correct, 0);
    const totalAnswered = sessions.reduce((sum, s) => sum + s.total, 0);
    const accuracy = totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const last = sessions[sessions.length - 1];

    card.innerHTML = `
      <h2 class="mb-2 text-xl font-bold">${label}</h2>
      <ul class="flex flex-col gap-1">
        <li>Раундов сыграно: ${sessions.length}</li>
        <li>Средняя точность: ${accuracy}%</li>
        <li>Текущая серия идеальных раундов: ${stats.streak}</li>
        <li>Лучшая серия: ${stats.bestStreak}</li>
        <li>Последний раунд: ${last.correct} из ${last.total} (${formatDate(last.date)})</li>
      </ul>
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
