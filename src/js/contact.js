'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const statusElem = document.getElementById('contact-form-status');

    if (!form || !statusElem) {
        return;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        statusElem.textContent = 'Envoi en cours...';
        statusElem.style.color = 'var(--fg)';

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusElem.textContent = "Merci pour votre message ! Nous vous répondrons bientôt.";
                statusElem.style.color = 'var(--accent2)';
                form.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    statusElem.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    statusElem.textContent = "Oops! Une erreur s'est produite lors de l'envoi du formulaire.";
                }
                statusElem.style.color = '#ff4444';
            }
        } catch (error) {
            statusElem.textContent = "Oops! Une erreur réseau s'est produite.";
            statusElem.style.color = '#ff4444';
        }
    }

    form.addEventListener("submit", handleSubmit);
}); 