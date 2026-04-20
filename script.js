document.addEventListener('DOMContentLoaded', () => {
    // Nav scroll
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        });
    }

    // Intersection observer for fade-up
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Form submit
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const form = e.target;
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(form)
                });
                const data = await response.json();
                if (data.success) {
                    form.style.display = 'none';
                    document.getElementById('form-success').style.display = 'block';
                } else {
                    throw new Error(data.message || 'Error al enviar');
                }
            } catch (err) {
                alert('Hubo un error al enviar el formulario. Por favor intentá de nuevo.');
                btn.disabled = false;
                btn.textContent = 'Iniciar conversación';
            }
        });
    }
});
