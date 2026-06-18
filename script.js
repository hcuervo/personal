document.addEventListener('DOMContentLoaded', () => {
    // Nav scroll
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        });
    }



    // Analytics helper
    const trackEvent = (eventName, eventParams = {}) => {
        try {
            if (typeof gtag === 'function') {
                gtag('event', eventName, eventParams);
            }
            if (typeof dataLayer !== 'undefined' && Array.isArray(dataLayer)) {
                dataLayer.push({ event: eventName, ...eventParams });
            }
        } catch (e) {
            console.warn('Analytics tracking failed', e);
        }
    };

    // Form submit
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const form = e.target;
            const btn = form.querySelector('button[type="submit"]');
            
            // Honeypot check
            if (form.querySelector('input[name="botcheck"]').checked) {
                console.warn('Bot detected');
                return;
            }

            // Tracking start
            trackEvent('form_submit_start', {
                form_id: 'contact-form'
            });

            // Basic UI feedback
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();

                if (data.success) {
                    trackEvent('form_submit_success', {
                        form_id: 'contact-form'
                    });
                    form.style.display = 'none';
                    const successMsg = document.getElementById('form-success');
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    throw new Error(data.message || 'Error al enviar');
                }
            } catch (err) {
                trackEvent('form_submit_error', {
                    form_id: 'contact-form',
                    error_message: err.message
                });
                alert('Hubo un error al enviar el formulario. Por favor intentá de nuevo.');
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }
});
