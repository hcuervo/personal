/**
 * HORACIO CUERVO — SIMPLE NAVIGATION ENGINE
 * Clean vertical scroll with high-performance dot tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-full');
    const dots = document.querySelectorAll('.dot');
    const navLinks = document.querySelectorAll('.nav-cta, .cta, .nav-brand, .dot');
    const header = document.querySelector('.header');
    
    let currentIndex = 0;

    // 1. NAVIGATION (Jump to Section)
    function goToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        sections[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // 2. SCROLL WATCHER (Simple Dot Update)
    const observerOptions = {
        root: null,
        threshold: 0.2,
        rootMargin: "-20%"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                updateNavigationState(index);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateNavigationState(index) {
        currentIndex = index;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        if (index > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // 3. KEYBOARD NAVIGATION
    window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'PageDown'].includes(e.key)) {
            e.preventDefault();
            goToSection(currentIndex + 1);
        } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
            e.preventDefault();
            goToSection(currentIndex - 1);
        }
    });

    // 4. CLICK HANDLERS
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const dataIndex = link.getAttribute('data-index');

            if (dataIndex !== null) {
                e.preventDefault();
                goToSection(parseInt(dataIndex));
            } else if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    e.preventDefault();
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 5. FORM MOCK
    const form = document.querySelector('#lead-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.style.display = 'none';
            document.querySelector('#form-success').style.display = 'block';
        });
    }
});
