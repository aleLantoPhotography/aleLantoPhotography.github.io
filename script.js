document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Anno dinamico nel footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: sfondo solido dopo lo scroll ---------- */
  const header = document.getElementById('siteHeader');
  const toggleHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Reveal delle immagini in galleria allo scroll ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(item => observer.observe(item));
  } else {
    // Fallback per browser senza supporto IntersectionObserver
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

});
