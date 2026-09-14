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
            if (form.dataset.submitting === "true" || !form.reportValidity()) return;
            const errorMsg = document.getElementById("form-error");
            errorMsg.hidden = true;
            errorMsg.textContent = "";
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
            form.dataset.submitting = "true";
            form.setAttribute("aria-busy", "true");
            btn.disabled = true;
            btn.textContent = 'Enviando...';

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    signal: controller.signal,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = await response.json();

                if (response.ok && data.success === true) {
                    trackEvent('form_submit_success', {
                        form_id: 'contact-form'
                    });
                    form.hidden = true;
                    const successMsg = document.getElementById('form-success');
                    if (successMsg) {
                        successMsg.hidden = false;
                        successMsg.focus({ preventScroll: true });
                        successMsg.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
                    }
                } else {
                    throw new Error(data.message || 'Error al enviar');
                }
            } catch (err) {
                trackEvent('form_submit_error', {
                    form_id: 'contact-form',
                    error_type: err.name === 'AbortError' ? 'timeout' : 'submission_failed'
                });
                errorMsg.textContent = err.name === 'AbortError'
                    ? 'El envío tardó más de lo esperado y no pudimos confirmar la recepción. Tus datos siguen en el formulario. Podés reintentar o contactarme por LinkedIn al pie de la página.'
                    : 'No pudimos confirmar el envío. Tus datos siguen en el formulario. Intentá de nuevo o contactame por LinkedIn al pie de la página.';
                errorMsg.hidden = false;
                errorMsg.focus();
            } finally {
                clearTimeout(timeout);
                delete form.dataset.submitting;
                form.removeAttribute('aria-busy');
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }
});
