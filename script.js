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
    const transitionDuration = 900; // Increased for a more deliberate, calm feel

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
        }, 150);

        currentIndex = index;
        updateHeaderState();

        setTimeout(() => {
            isTransitioning = false;
        }, transitionDuration);
    }

    // Header interaction based on scroll (Mobile and transitions)
    function updateHeader() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50 || currentIndex > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
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
            updateHeader();
        } else if (e.deltaY < -50) {
            goToSection(currentIndex - 1);
            updateHeader();
        }
    }

    // 3. KEYBOARD HANDLER
    function handleKey(e) {
        if (window.innerWidth <= 768) {
            // Revert to default keys on mobile? No, user wants snap.
        }

        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                goToSection(currentIndex + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                goToSection(currentIndex - 1);
                break;
            case ' ':
                e.preventDefault();
                goToSection(e.shiftKey ? currentIndex - 1 : currentIndex + 1);
                break;
        }
    }

    // 3b. TOUCH HANDLER (Mobile Snap)
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        touchStartY = e.changedTouches[0].screenY;
    }

    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }

    function handleSwipe() {
        const threshold = 50;
        if (touchEndY < touchStartY - threshold) {
            // Swipe Down -> Next
            goToSection(currentIndex + 1);
        } else if (touchEndY > touchStartY + threshold) {
            // Swipe Up -> Prev
            goToSection(currentIndex - 1);
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
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const targetId = href.substring(1);
            const targetIndex = Array.from(sections).findIndex(s => s.id === targetId);
            
            if (targetIndex !== -1) {
                e.preventDefault();
                goToSection(targetIndex);
            }
        });
    });

    // 6. INITIALIZATION & REVEALS
    window.addEventListener('wheel', handleWheel, { passive: false }); // Needs active to prevent default if needed
    window.addEventListener('keydown', handleKey);
    
    // Mobile Touch Events
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Ensure first section is visible
    setTimeout(() => {
        const initialReveals = sections[0].querySelectorAll('.reveal');
        initialReveals.forEach(r => r.classList.add('visible'));
    }, 500);

    // 7. HEADER OPACITY ON SCROLL
    // On the snap model, we track currentIndex
    const header = document.querySelector('.header');
    
    function updateHeaderState() {
        if (currentIndex > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

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