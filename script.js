/* Navegação por hash: cada trabalho funciona como uma rota sem recarregar a página. */
const modules = [...document.querySelectorAll('[data-module]')];
const home = document.querySelector('.home-view');
const main = document.querySelector('main');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const toast = document.querySelector('.toast');
let toastTimer;

function updateView() {
  const route = location.hash.slice(1);
  const active = modules.find(module => module.id === route);
  modules.forEach(module => { module.hidden = module !== active; });
  home.hidden = Boolean(active);
  if (active) { window.scrollTo(0, 0); main.focus(); }
  menuButton.setAttribute('aria-expanded', 'false');
}

window.addEventListener('hashchange', updateView);
window.addEventListener('DOMContentLoaded', updateView);

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
});

nav.addEventListener('click', () => menuButton.setAttribute('aria-expanded', 'false'));

document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => {
  toast.textContent = button.dataset.toast;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}));

/* Alterna transcrições sem depender apenas de mudanças visuais. */
document.querySelectorAll('[data-disclosure]').forEach(button => button.addEventListener('click', () => {
  const transcript = document.getElementById(button.getAttribute('aria-controls'));
  const willOpen = transcript.hidden;
  transcript.hidden = !willOpen;
  button.setAttribute('aria-expanded', String(willOpen));
  const itemName = transcript.id === 'transcricao-video' ? 'do documentário' : 'do podcast';
  button.textContent = `${willOpen ? 'Ocultar' : 'Mostrar'} transcrição ${itemName}`;
}));
