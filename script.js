/**
 * HORACIO CUERVO — MASTER SCRIPT
 * Section-based navigation manager for Desktop.
 * Fade transitions and scroll snap logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-full');
    const dots = document.querySelectorAll('.dot');
    const navCta = document.querySelectorAll('.nav-cta, .cta, .nav-brand');
    let currentIndex = 0;
    let isTransitioning = false;
    const transitionDuration = 700; // slightly longer than CSS to avoid ghost scrolls

    // 1. NAVIGATION CONTROL (DESKTOP)
    function goToSection(index) {
        if (index < 0 || index >= sections.length || isTransitioning) return;
        
        isTransitioning = true;
        
        // Update Classes
        sections.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        sections[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Stagger the reveal of the new section
        const reveals = sections[index].querySelectorAll('.reveal');
        reveals.forEach(r => r.classList.remove('visible'));
        setTimeout(() => {
            reveals.forEach(r => r.classList.add('visible'));
        }, 100);

        currentIndex = index;

        setTimeout(() => {
            isTransitioning = false;
        }, transitionDuration);
    }

    // 2. SCROLL / WHEEL HANDLER (DESKTOP)
    function handleWheel(e) {
        if (window.innerWidth <= 768) return; // Ignore on mobile
        
        // Check if current section has scrollable content that needs standard scroll
        const activeSection = sections[currentIndex];
        const container = activeSection.querySelector('.container');
        if (container.scrollHeight > window.innerHeight) {
            // If container is taller than viewport, we might need a different logic
            // But for this minimalist site, we prioritize the section flip.
        }

        if (e.deltaY > 50) {
            goToSection(currentIndex + 1);
        } else if (e.deltaY < -50) {
            goToSection(currentIndex - 1);
        }
    }

    // 3. KEYBOARD HANDLER
    function handleKey(e) {
        if (window.innerWidth <= 768) return;

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                goToSection(currentIndex + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                goToSection(currentIndex - 1);
                break;
        }
    }

    // 4. DOTS HANDLER
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSection(index);
        });
    });

    // 5. CTA / SMOOTH SCROLL HANDLER
    navCta.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetIndex = Array.from(sections).findIndex(s => s.id === targetId);
            
            if (targetIndex !== -1 && window.innerWidth > 768) {
                e.preventDefault();
                goToSection(targetIndex);
            }
        });
    });

    // 6. INITIALIZATION & REVEALS
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKey);

    // Initial reveal for the first section
    const initialReveals = sections[0].querySelectorAll('.reveal');
    initialReveals.forEach(r => r.classList.add('visible'));

    // 7. HEADER OPACITY ON SCROLL (MOBILE ONLY)
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.style.opacity = '0.8';
                header.style.background = 'rgba(255,255,255,0.9)';
            } else {
                header.style.opacity = '1';
                header.style.background = 'transparent';
            }
        }
    });

    // 8. FORM SUBMISSION MOCK
    const form = document.querySelector('#lead-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.style.display = 'none';
            document.querySelector('#form-success').style.display = 'block';
        });
    }
});