const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Abrir menu'); document.body.classList.remove('menu-open'); }
toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); document.body.classList.toggle('menu-open', open); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if(window.innerWidth > 820) closeMenu(); });
document.getElementById('year').textContent = new Date().getFullYear();
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 25), {passive:true});
const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));
const resultNumbers = document.querySelectorAll('.results-grid [data-count]');
if (resultNumbers.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animateResults = () => {
    const start = performance.now();
    const duration = 1500;
    const tick = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      resultNumbers.forEach(number => {
        const target = Number(number.dataset.count);
        number.textContent = `${Math.min(target, Math.floor(target * eased))}${number.dataset.suffix || ''}`;
      });
      if (progress < 1) requestAnimationFrame(tick);
      else resultNumbers.forEach(number => { number.textContent = `${number.dataset.count}${number.dataset.suffix || ''}`; });
    };
    resultNumbers.forEach(number => { number.textContent = `0${number.dataset.suffix || ''}`; });
    requestAnimationFrame(tick);
  };
  const resultsObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      resultsObserver.disconnect();
      animateResults();
    }
  }, { threshold: 0.2 });
  resultsObserver.observe(document.querySelector('.results-grid'));
}
const windowSection = document.querySelector('.window-section');
const windowImage = document.querySelector('.window-image');
if (windowSection && windowImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  const updateWindow = () => {
    const rect = windowSection.getBoundingClientRect();
    const travel = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    windowImage.style.setProperty('--window-shift', `${-28 * progress}px`);
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateWindow); ticking = true; } }, {passive:true});
  window.addEventListener('resize', updateWindow);
  updateWindow();
}
