/* ==========================================================================
   HORACIO CUERVO — SITE LOGIC
   Minimal: reveal-on-scroll + form handling. Nothing decorative.
   ========================================================================== */

(function () {
  'use strict';

  // --- REVEAL ON SCROLL ---
  function initReveal() {
    const elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // --- HERO INITIAL ANIMATION ---
  function initHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Animate hero content on load
    const headline = hero.querySelector('.hero-headline');
    const sub = hero.querySelector('.hero-sub');
    const cta = hero.querySelector('.cta');

    // Get the visible variant
    const variants = hero.querySelectorAll('.hero-variant');
    let visibleVariant = null;
    variants.forEach(v => {
      if (getComputedStyle(v).display !== 'none') {
        visibleVariant = v;
      }
    });

    if (!visibleVariant) return;

    const h = visibleVariant.querySelector('.hero-headline');
    const s = visibleVariant.querySelector('.hero-sub');

    // Set initial state
    [h, s, cta].forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
    });

    // Staggered entrance
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (h) { h.style.opacity = '1'; h.style.transform = 'translateY(0)'; }
      }, 200);

      setTimeout(() => {
        if (s) { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; }
      }, 500);

      setTimeout(() => {
        if (cta) { cta.style.opacity = '1'; cta.style.transform = 'translateY(0)'; }
      }, 800);
    });
  }

  // --- FORM HANDLING ---
  function initForm() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const empresa = document.getElementById('empresa').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      if (!nombre || !empresa || !mensaje) return;

      // Compose mailto fallback
      const subject = encodeURIComponent('Conversación — ' + nombre);
      const body = encodeURIComponent(
        'Nombre: ' + nombre + '\n' +
        'Empresa + rol: ' + empresa + '\n\n' +
        '¿Qué está sin terminar de cerrar?\n' + mensaje
      );

      // Open mail client
      window.location.href = 'mailto:horacio@example.com?subject=' + subject + '&body=' + body;

      // Show confirmation
      form.innerHTML =
        '<div class="form-success">' +
        '<p>Gracias. Si tu cliente de correo no se abrió, escribime directamente.</p>' +
        '</div>';
    });
  }

  // --- SMOOTH SCROLL FOR CTA LINKS ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  // --- INIT ---
  document.addEventListener('DOMContentLoaded', function () {
    initHero();
    initReveal();
    initForm();
    initSmoothScroll();
  });
})();