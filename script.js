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
  let scrollPosition = 0;

  // Blocco dello scroll "robusto": su iOS Safari il solo overflow:hidden
  // sul body non basta (il contenuto sottostante resta visibile e si
  // muove sotto il menu). Fissiamo il body nella sua posizione esatta,
  // così il menu a schermo intero copre davvero tutto, ovunque si fosse
  // scrollato quando è stato aperto.
  const openMenu = () => {
    scrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    mainNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo(0, scrollPosition);
  };

  navToggle.addEventListener('click', () => {
    if (mainNav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
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
