/* This page is an isolated case study, not a simulation of the live product. */
const images = [
  { id: 'overview', title: 'Обзор проекта' },
  { id: 'instruction', title: 'Инструкция к задаче' },
  { id: 'awaiting', title: 'Ожидание проверки' },
  { id: 'verified', title: 'Подтверждённое исправление' },
  { id: 'audit', title: 'Технический аудит' },
  { id: 'visibility', title: 'Видимость в AI' },
  { id: 'controls', title: 'UI Kit / Компоненты' },
  { id: 'foundations', title: 'UI Kit / Основы' },
  { id: 'forms', title: 'UI Kit / Формы' },
];
const viewerData = {
  flow: [
    { image: 'instruction', title: 'Инструкция к задаче', text: 'В карточке задачи собрал адрес страницы, описание ошибки и инструкцию. Пользователю не нужно возвращаться к общему отчёту за этими данными.' },
    { image: 'awaiting', title: 'Ожидание проверки', text: 'После внесения правок пользователь отмечает задачу. До повторной проверки она остаётся в статусе ожидания и не учитывается как выполненная.' },
    { image: 'verified', title: 'Результат проверки', text: 'Если проверка подтверждает исправление, сервис обновляет статус задачи. Если ошибка осталась, пользователь может снова открыть инструкцию и продолжить работу.' },
  ],
  kit: [
    { image: 'controls', title: 'Кнопки и их состояния', text: 'Подготовил основные, второстепенные кнопки и кнопки удаления. Для них предусмотрел два размера и состояния наведения, нажатия, фокуса, загрузки и недоступности.' },
    { image: 'foundations', title: 'Цвета, текст и отступы', text: 'В библиотеке заданы цвета, текстовые стили Inter Tight, отступы, скругления и тени. Эти значения используются во всех макетах.' },
    { image: 'forms', title: 'Поля и переключатели', text: 'Для полей подготовил обычное состояние, фокус, ошибку и недоступность. Подсказки и сообщения об ошибке разместил под соответствующим полем.' },
  ],
};
const dialog = document.querySelector('.lightbox');
const viewport = dialog.querySelector('.lightbox-viewport');
const largeImage = viewport.querySelector('img');
const zoomButton = dialog.querySelector('[data-zoom]');
let activeImage = 0;
let returnFocus = null;

function setZoom(zoomed) {
  dialog.classList.toggle('is-zoomed', zoomed);
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.setAttribute('aria-label', zoomed ? 'Показать целиком' : 'Увеличить масштаб');
  zoomButton.title = zoomed ? 'Показать целиком' : 'Увеличить масштаб';
  viewport.scrollTo(0, 0);
}
function renderImage() {
  const item = images[activeImage];
  largeImage.src = `/assets/portfolio-os-20261112/cases/ux-assets/${item.id}.png`;
  largeImage.alt = item.title;
  dialog.querySelector('h2').textContent = item.title;
  dialog.querySelector('.image-count').textContent = `${activeImage + 1} / ${images.length}`;
  dialog.querySelector('[data-prev]').disabled = activeImage === 0;
  dialog.querySelector('[data-next]').disabled = activeImage === images.length - 1;
  setZoom(false);
}
function navigateImage(delta) {
  activeImage = Math.max(0, Math.min(images.length - 1, activeImage + delta));
  renderImage();
}
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    activeImage = images.findIndex(item => item.id === button.dataset.image);
    returnFocus = button;
    renderImage();
    dialog.showModal();
    smoothScroll?.stop();
    document.body.classList.add('modal-open');
    dialog.querySelector('[data-close]').focus();
  });
});
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  smoothScroll?.start();
  document.body.classList.remove('modal-open');
  setZoom(false);
  returnFocus?.focus({ preventScroll: true });
});
dialog.querySelector('[data-prev]').addEventListener('click', () => navigateImage(-1));
dialog.querySelector('[data-next]').addEventListener('click', () => navigateImage(1));
zoomButton.addEventListener('click', () => setZoom(!dialog.classList.contains('is-zoomed')));
dialog.addEventListener('keydown', event => {
  if (dialog.classList.contains('is-zoomed')) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    navigateImage(event.key === 'ArrowRight' ? 1 : -1);
  }
});
let touchStart = null;
viewport.addEventListener('touchstart', event => {
  touchStart = event.touches.length === 1 && !dialog.classList.contains('is-zoomed')
    ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
viewport.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) navigateImage(dx < 0 ? 1 : -1);
}, { passive: true });
viewport.addEventListener('touchcancel', () => { touchStart = null; });

document.querySelectorAll('[data-viewer]').forEach(viewer => {
  const name = viewer.dataset.viewer;
  const tabs = [...viewer.querySelectorAll('[role="tab"]')];
  const panel = viewer.querySelector('[role="tabpanel"]');
  function select(index, focus = false) {
    const item = viewerData[name][index];
    tabs.forEach((tab, position) => {
      tab.setAttribute('aria-selected', String(position === index));
      tab.tabIndex = position === index ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tabs[index].id);
    const button = panel.querySelector('[data-image]');
    button.dataset.image = item.image;
    button.setAttribute('aria-label', `Увеличить: ${images.find(image => image.id === item.image).title}`);
    const img = button.querySelector('img');
    img.src = `/assets/portfolio-os-20261112/cases/ux-assets/${item.image}.png`;
    img.alt = images.find(image => image.id === item.image).title;
    panel.querySelector('h3').textContent = item.title;
    panel.querySelector('.viewer-description p').textContent = item.text;
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });
});
if (window.lucide) window.lucide.createIcons();
