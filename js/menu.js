// Menu HTML as a string
export const menuHTML = `
<nav>
  <ul class="flex gap-4 mb-4">
    <li><a class="underline hover:no-underline" href="./">Умножение</a></li>
    <li><a class="underline hover:no-underline" href="./sum.html">Сложение</a></li>
    <li><a class="underline hover:no-underline" href="./divide.html">Деление</a></li>
    <li><a class="underline hover:no-underline" href="./multiply_theory.html">Таблица умножения (теория)</a></li>
  </ul>
</nav>
`;

export function renderMenu(targetSelector = '#main-menu') {
  const el = document.querySelector(targetSelector);
  if (el) el.innerHTML = menuHTML;
}
