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

  // Rimuove solo il blocco dello scroll, senza spostare la pagina.
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
  };

  // Chiusura "semplice" (tasto hamburger): torna esattamente dov'eri,
  // in modo istantaneo. Usiamo behavior:'instant' perché lo
  // scroll-behavior:smooth globale del sito animerebbe questo
  // ripristino facendolo sembrare un lungo scorrimento indesiderato.
  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    unlockScroll();
    window.scrollTo({ top: scrollPosition, left: 0, behavior: 'instant' });
  };

  navToggle.addEventListener('click', () => {
    if (mainNav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Click su una voce di menu: chiude e naviga con scroll fluido
  // verso la sezione scelta (stesso comportamento del menu desktop),
  // invece di richiudersi semplicemente sulla vecchia posizione.
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      event.preventDefault();
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      unlockScroll();

      if (targetEl) {
        // Un frame di attesa per lasciare che il body riprenda il
        // suo normale flusso prima di calcolare la posizione target.
        requestAnimationFrame(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
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
  /* ---------- Lightbox galleria ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryGrid = document.getElementById('galleryGrid');
  let lightboxScrollPosition = 0;

  const openLightbox = (item) => {
    const img = item.querySelector('img');
    const captionEl = item.querySelector('.item-caption');
    if (!img) return;

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    lightboxTitle.textContent = captionEl ? captionEl.textContent : '';
    lightboxDescription.textContent = item.dataset.description || '';

    // Stesso blocco-scroll robusto usato per il menu mobile.
    lightboxScrollPosition = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lightboxScrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    window.scrollTo({ top: lightboxScrollPosition, left: 0, behavior: 'instant' });
  };

  if (galleryGrid && lightbox) {
    // Click su una foto (o su un elemento al suo interno) apre la lightbox.
    galleryGrid.addEventListener('click', (event) => {
      const item = event.target.closest('.gallery-item');
      if (item) openLightbox(item);
    });

    // Supporto da tastiera: Invio o Spazio aprono la foto attualmente a fuoco.
    galleryGrid.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const item = event.target.closest('.gallery-item');
      if (item) {
        event.preventDefault();
        openLightbox(item);
      }
    });

    lightbox.addEventListener('click', (event) => {
      if (event.target.hasAttribute('data-close')) closeLightbox();
    });
    lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

});
