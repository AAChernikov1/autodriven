let tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// Состояние игры
let state = {
  score: 0,
  perClick: 1,
  perSec: 0,
  clickLevel: 1,
  autoLevel: 0,
  clickCost: 10,
  autoCost: 50,
};

// Загрузка сохранения
const saved = localStorage.getItem('clickerSave');
if (saved) {
  try { state = { ...state, ...JSON.parse(saved) }; } catch(e) {}
}

// Элементы
const scoreEl = document.getElementById('score');
const perSecEl = document.getElementById('perSec');
const clickCostEl = document.getElementById('clickCost');
const autoCostEl = document.getElementById('autoCost');
const clickBtn = document.getElementById('clickBtn');

// Обновление интерфейса
function render() {
  scoreEl.textContent = Math.floor(state.score);
  perSecEl.textContent = state.perSec;
  clickCostEl.textContent = state.clickCost;
  autoCostEl.textContent = state.autoCost;
}

// Сохранение (раз в 2 секунды)
setInterval(() => {
  localStorage.setItem('clickerSave', JSON.stringify(state));
}, 2000);

// Клик
clickBtn.addEventListener('click', () => {
  state.score += state.perClick;
  render();

  clickBtn.classList.remove('pop');
  void clickBtn.offsetWidth;
  clickBtn.classList.add('pop');

  if (tg) tg.HapticFeedback?.impactOccurred('light');
});

// Пассивный доход
setInterval(() => {
  if (state.perSec > 0) {
    state.score += state.perSec;
    render();
  }
}, 1000);

// Покупки
function buyClick() {
  if (state.score < state.clickCost) return;
  state.score -= state.clickCost;
  state.clickLevel++;
  state.perClick++;
  state.clickCost = Math.floor(10 * Math.pow(1.6, state.clickLevel - 1));
  render();
  if (tg) tg.HapticFeedback?.notificationOccurred('success');
}

function buyAuto() {
  if (state.score < state.autoCost) return;
  state.score -= state.autoCost;
  state.autoLevel++;
  state.perSec++;
  state.autoCost = Math.floor(50 * Math.pow(1.7, state.autoLevel));
  render();
  if (tg) tg.HapticFeedback?.notificationOccurred('success');
}

render();