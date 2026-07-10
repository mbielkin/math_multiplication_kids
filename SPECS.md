# Math Multiplication Kids — Functional Specification

## 1. Overview

A static, client-side web app that helps kids practice basic arithmetic:
multiplication, division, and addition/subtraction. There is no backend —
everything runs in the browser as plain HTML/CSS/JS, styled with Tailwind
CSS, and deployed as a static site to GitHub Pages.

Language of the UI: Russian.

## 2. Tech Stack

- Plain HTML pages (no framework/bundler)
- Vanilla JavaScript ES modules (`js/*.js`)
- Tailwind CSS (compiled at build time into `styles.build.css` via
  `npm run css-generate`; `result.css` is a pre-built snapshot)
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the CSS
  and publishes the repository root to GitHub Pages on every push to
  `master`

## 3. Site Structure & Navigation

Every page renders the same navigation menu (`js/menu.js`) with four links:

| Label (RU)                     | Page                     | Purpose                          |
|--------------------------------|---------------------------|-----------------------------------|
| Умножение                      | `index.html`              | Multiplication drills             |
| Сложение                       | `sum.html`                 | Addition/subtraction drills       |
| Деление                        | `divide.html`              | Division drills                   |
| Таблица умножения (теория)     | `multiply_theory.html`     | Static multiplication reference   |

The menu markup is defined once in `menuHTML` and injected into the
`#main-menu` element on each page via `renderMenu()`.

## 4. Pages

### 4.1 Multiplication Practice (`index.html` + `js/exercise.js`, mode = `multiply`)

- Two buttons select the difficulty: **Базовый уровень** (basic) and
  **Сложный уровень** (advanced).
- Clicking a level button:
  1. Spins the clicked button once (CSS animation) as feedback.
  2. Resets any running timer.
  3. Clears previous exercise content.
  4. Generates a new problem set and reveals the exercises section
     (fades in from `opacity-0`).
  5. Renders a "Проверить" (Check) button and starts the timer.
- Problem set: all products `a × b` for `a, b ∈ [1, 9]` (81 problems).
  - **Basic**: problems appear in sequential order (a=1..9, b=1..9).
  - **Advanced**: the same 81 problems are shuffled into random order.
- Problems are laid out in blocks of 9 rows; once a block fills up, a new
  block (column) is started, and blocks wrap in a flex layout.
- Each problem is rendered as `a x b = ` with a text input for the
  answer and a hidden input holding the correct value.

### 4.2 Division Practice (`divide.html` + `js/exercise.js`, mode = `divide`)

- Identical structure/behavior to Multiplication Practice, but generates
  division problems: for divisor `d ∈ [1, 9]` and quotient `q ∈ [1, 9]`,
  a problem `(d*q) ÷ d = q` is generated (81 problems, always integer
  results, dividend range 1–81).
- Same **Базовый** (sequential) / **Сложный** (shuffled) complexity
  toggle, same layout, timer, and check button behavior as multiplication.

### 4.3 Addition & Subtraction Practice (`sum.html` + `js/sum.js`)

- Instead of a basic/advanced toggle, this page shows 5 numbered level
  buttons (1–5), generated dynamically.
- Selecting a level clears prior content and generates a themed set of
  addition/subtraction problems, then shows the Check button and starts
  the timer.
- Level definitions (`LEVELS_MAP`):
  - **Level 1**: no fixed operand limit — practices `+1` and `-1` only,
    against first operands 1–10.
  - **Level 2**: operands `+0..+3` / `-0..-3` against first operands 1–10.
  - **Level 3**: operands `+0..+5` / `-0..-5`.
  - **Level 4**: operands `+1..+7` / `-1..-7` (skips 0).
  - **Level 5**: operands `+2..+9` / `-2..-9` (skips 0 and 1).
- For each operand value, problems are generated for first operands 1–10
  (doubled and shuffled internally); subtraction problems that would
  produce a negative result are discarded.
- Levels 1–3 additionally take the combined +/− problem set, cap it at 20
  problems, and repeat it across several shuffled columns for more
  practice volume; levels 4–5 show each generated problem once.
- Problems render as `firstDigit + N = ` / `firstDigit - N = ` with a
  text input and hidden correct-answer input, laid out in row blocks of
  20 (`ROWS_AMOUNT`), wrapping into columns.

### 4.4 Multiplication Table Reference (`multiply_theory.html`)

- A static, non-interactive reference page: a 10×10 table listing every
  `a x b = result` for `a, b ∈ [1, 10]`, generated on page load by inline
  JavaScript (no shared modules, no timer, no inputs).

## 5. Shared Behavior (`js/common.js`)

### 5.1 Exercise rendering primitives
- `createNumbersBlock()` — creates a column container for a batch of
  problems.
- `generateNumberLine(message, result, container)` — renders one problem
  row: a label, a visible text `<input>` for the user's answer, and a
  hidden `<input>` holding the correct numeric answer.
- `cleanContent()` — clears the exercise area and removes any existing
  Check button before generating a new set.
- `randomSort()` — `Math.random() - 0.5` comparator used to shuffle
  problem arrays.
- `animateButton(el)` — adds a one-time spin animation class, used as
  click feedback on level/complexity buttons.

### 5.2 Timer & Pause/Resume
- `generateFinishButton()` sets up, per exercise session:
  - A **Проверить** (Check) button that stops the timer and grades
    answers.
  - A live timer display, updating every 100 ms, formatted as
    `Время: N.N сек` (or `N мин N.N сек` past 60 seconds).
  - A **Пауза/Продолжить** (Pause/Resume) toggle button that stops/
    restarts the timer interval without losing elapsed time (paused
    duration is excluded from the final elapsed time).
- `resetTimer()` clears any active timer/interval and removes the timer
  element; called whenever a new exercise set is generated.
- On Check, the timer stops and its label is suffixed with `(завершено)`
  ("finished").

### 5.3 Answer Checking (`checkValues`)
- Iterates every visible text input, compares its trimmed value (string
  comparison) against the value of the adjacent hidden input.
- Colors each input's border green (`border-green-400`) if correct or
  red (`border-red-400`) if incorrect.
- Appends a results summary below the timer: `Правильных ответов: X из Y.`
  plus the final timer text.
- Grading is idempotent-safe per click: re-running Check re-evaluates and
  re-colors all inputs (though it will append an additional summary line
  each time, since prior summaries aren't removed until content is reset).

## 6. Build & Deployment

- `npm run css-generate` compiles `styles.css` (Tailwind directives +
  custom rules) into `styles.build.css`, which all pages link to.
- `npm run css-generate-watch` runs the same compilation in watch mode
  for local development.
- CI (`.github/workflows/deploy.yml`) on every push to `master`:
  1. Installs dependencies (`npm ci`).
  2. Builds CSS (`npm run css-generate`).
  3. Uploads the repository root as a Pages artifact.
  4. Deploys it to GitHub Pages.
- There is no test suite or linter configured in this repository.

## 7. File/Module Map

| File                     | Responsibility                                              |
|--------------------------|----------------------------------------------------------------|
| `index.html`             | Multiplication practice page                                  |
| `divide.html`            | Division practice page                                        |
| `sum.html`               | Addition/subtraction practice page                            |
| `multiply_theory.html`   | Static multiplication table reference                         |
| `js/menu.js`             | Shared top navigation markup/render                            |
| `js/exercise.js`         | Multiplication & division problem generation + level toggle   |
| `js/sum.js`              | Addition/subtraction problem generation + 5-level system      |
| `js/common.js`           | Shared UI primitives: timer, pause/resume, grading, row render |
| `styles.css`             | Tailwind entry point + a few custom rules                      |
| `styles.build.css`/`result.css` | Compiled CSS output                                    |
| `tailwind.config.js`     | Tailwind content globs + custom animation/transition config    |
| `.github/workflows/deploy.yml` | CI/CD: build CSS and publish to GitHub Pages            |
