// Menu HTML as a string
export const menuHTML = `
<nav>
  <ul class="flex flex-wrap justify-center gap-2 mb-6">
    <li><a href="./" class="nav-link px-4 py-2 rounded-full font-bold text-slate-200 bg-slate-800 hover:bg-indigo-600 hover:text-white transition-colors duration-200">✖️ Умножение</a></li>
    <li><a href="./sum.html" class="nav-link px-4 py-2 rounded-full font-bold text-slate-200 bg-slate-800 hover:bg-rose-600 hover:text-white transition-colors duration-200">➕ Сложение</a></li>
    <li><a href="./divide.html" class="nav-link px-4 py-2 rounded-full font-bold text-slate-200 bg-slate-800 hover:bg-teal-600 hover:text-white transition-colors duration-200">➗ Деление</a></li>
    <li><a href="./multiply_theory.html" class="nav-link px-4 py-2 rounded-full font-bold text-slate-200 bg-slate-800 hover:bg-amber-500 hover:text-white transition-colors duration-200">📖 Таблица (теория)</a></li>
    <li><a href="./progress.html" class="nav-link px-4 py-2 rounded-full font-bold text-slate-200 bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors duration-200">⭐ Мой прогресс</a></li>
  </ul>
</nav>
`;

export function renderMenu(targetSelector = '#main-menu') {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = menuHTML;
  highlightCurrentPage(el);
}

function highlightCurrentPage(container) {
  const current = location.pathname.split('/').pop() || 'index.html';
  container.querySelectorAll('a.nav-link').forEach((link) => {
    const href = link.getAttribute('href').replace('./', '') || 'index.html';
    const isActive = href === current;
    link.classList.toggle('bg-slate-700', isActive);
    link.classList.toggle('ring-2', isActive);
    link.classList.toggle('ring-white/40', isActive);
  });
}
