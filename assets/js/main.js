(() => {
  'use strict';
  const init = () => {
    const root = document.documentElement;
    const menuButton = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    const themeButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');
    const mobile = window.matchMedia('(max-width: 767px)');

    const setMenu = (open) => {
      if (!menuButton || !menu) return;
      const isMobile = mobile.matches;
      menu.hidden = isMobile ? !open : false;
      menuButton.setAttribute('aria-expanded', String(isMobile && open));
      menuButton.setAttribute('aria-label', isMobile && open ? 'Close navigation menu' : 'Open navigation menu');
      menuButton.querySelector('span').textContent = isMobile && open ? '×' : '☰';
    };
    if (menuButton && menu) {
      menuButton.addEventListener('click', (event) => {
        event.preventDefault();
        setMenu(menu.hidden);
      });
      menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
      document.addEventListener('click', event => {
        if (mobile.matches && !menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
      });
      document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
      const syncMenu = () => setMenu(false);
      window.addEventListener('resize', syncMenu, { passive: true });
      mobile.addEventListener?.('change', syncMenu);
      syncMenu();
    }

    const currentFile = location.pathname.split('/').pop() || 'index.html';
    menu?.querySelectorAll('a.nav-link').forEach(link => {
      const file = new URL(link.href, location.href).pathname.split('/').pop() || 'index.html';
      if (file === currentFile) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const renderTheme = theme => {
      const dark = theme === 'dark';
      root.classList.toggle('dark', dark);
      root.style.colorScheme = dark ? 'dark' : 'light';
      if (themeIcon) themeIcon.textContent = dark ? '☀' : '☾';
      if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
      themeButton?.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeButton?.setAttribute('aria-pressed', String(dark));
    };
    let saved = null;
    try { saved = localStorage.getItem('jenny-portfolio-theme'); } catch (_) {}
    renderTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    themeButton?.addEventListener('click', event => {
      event.preventDefault();
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      renderTheme(next);
      try { localStorage.setItem('jenny-portfolio-theme', next); } catch (_) {}
    });

    const filters = [...document.querySelectorAll('.filter-btn')];
    const cards = [...document.querySelectorAll('.project-card')];
    filters.forEach(button => button.addEventListener('click', () => {
      const category = button.dataset.category || 'all';
      filters.forEach(item => {
        const active = item === button;
        item.classList.toggle('bg-forest', active); item.classList.toggle('text-white', active);
        item.classList.toggle('bg-white', !active); item.classList.toggle('border', !active);
        item.classList.toggle('border-line', !active); item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(card => { card.hidden = category !== 'all' && card.dataset.category !== category; });
    }));

    let top = document.getElementById('back-to-top');
    if (!top) { top = document.createElement('button'); top.id = 'back-to-top'; top.type = 'button'; top.setAttribute('aria-label', 'Back to top'); top.textContent = '↑'; document.body.appendChild(top); }
    const updateTop = () => top.classList.toggle('is-visible', window.scrollY > 420);
    window.addEventListener('scroll', updateTop, { passive: true }); updateTop();
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.querySelectorAll('[data-current-year]').forEach(node => node.textContent = new Date().getFullYear());
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
