const modules = [...document.querySelectorAll('[data-module]')];
const home = document.querySelector('.home-view');
const main = document.querySelector('main');
const menuButton = document.querySelector('.menu-toggle');
const menuLabel = menuButton.querySelector('.sr-only');
const nav = document.querySelector('nav');
const toast = document.querySelector('.toast');
let toastTimer;

function setMenuState(isOpen) {
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuLabel.textContent = isOpen ? 'Fechar menu' : 'Abrir menu';
}

function updateView() {
  const route = location.hash.slice(1);
  const active = modules.find(module => module.id === route);
  modules.forEach(module => { module.hidden = module !== active; });
  home.hidden = Boolean(active);
  if (active) { window.scrollTo(0, 0); main.focus(); }
  setMenuState(false);
}

window.addEventListener('hashchange', updateView);
window.addEventListener('DOMContentLoaded', updateView);

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen);
});

nav.addEventListener('click', () => setMenuState(false));

document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => {
  toast.textContent = button.dataset.toast;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}));

document.querySelectorAll('[data-disclosure]').forEach(button => button.addEventListener('click', () => {
  const transcript = document.getElementById(button.getAttribute('aria-controls'));
  const willOpen = transcript.hidden;
  transcript.hidden = !willOpen;
  button.setAttribute('aria-expanded', String(willOpen));
  const itemName = transcript.id === 'transcricao-video' ? 'do documentário' : 'do podcast';
  button.textContent = `${willOpen ? 'Ocultar' : 'Mostrar'} transcrição ${itemName}`;
}));