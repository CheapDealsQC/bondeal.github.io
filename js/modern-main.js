// SpotiDeals Main JavaScript - Created: June 2025
document.addEventListener('DOMContentLoaded', function() {
    // Chargement de la section process
    const processSection = document.getElementById('process-section-container');
    if (processSection) {
        fetch('/sections/process-section.html')
            .then(response => response.text())
            .then(html => {
                processSection.innerHTML = html;
                // Réinitialiser l'observation pour les nouveaux éléments
                initializeObservers();
            })
            .catch(error => console.error('Erreur de chargement de la section process:', error));
    }

    // Fonction pour initialiser les observers sur les éléments dynamiques
    function initializeObservers() {
        // Observer pour les animations au défilement
        document.querySelectorAll('.animate-on-scroll:not(.observed)').forEach(element => {
            observer.observe(element);
            element.classList.add('observed');
        });
    }

    // Animation au défilement
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.dataset.delay) {
                    entry.target.style.animationDelay = entry.target.dataset.delay;
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Animation du bouton CTA
    const ctaButton = document.querySelector('.btn-cta');
    if (ctaButton) {
        ctaButton.addEventListener('mouseover', function() {
            this.classList.add('hover-effect');
        });
        ctaButton.addEventListener('mouseout', function() {
            this.classList.remove('hover-effect');
        });
    }    // Effets interactifs avancés pour le formulaire
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        // Vérifier si le champ a déjà une valeur
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Effet de focus amélioré
        input.addEventListener('focus', function() {
            // Ajouter classe pour animation de focus
            this.parentElement.classList.add('input-focused');
            
            // Effet de surbrillance subtile
            if (!document.querySelector('html').classList.contains('reduced-motion')) {
                this.style.boxShadow = '0 0 0 3px rgba(67, 130, 255, 0.15)';
            }
        });

        // Effet de blur amélioré
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            
            // Réinitialiser l'effet de surbrillance
            this.style.boxShadow = '';
            
            // Gérer la classe has-value
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });

        // Validation en temps réel
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                if (this.value.trim() !== '') {
                    this.classList.add('is-invalid');
                }
            }
        });
    });

    // Generate Order ID function
    function generateOrderId() {
        const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
        const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        return `SD-${dateString}-${randomString}`;
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Contains lowercase letters
        if (password.match(/[a-z]+/)) strength += 1;
        
        // Contains uppercase letters
        if (password.match(/[A-Z]+/)) strength += 1;
        
        // Contains numbers
        if (password.match(/[0-9]+/)) strength += 1;
        
        // Contains special characters
        if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;
        
        return {
            score: strength,
            isStrong: strength >= 3,
            message: getStrengthMessage(strength)
        };
    }
    
    function getStrengthMessage(score) {
        switch(score) {
            case 0:
            case 1: return "Très faible";
            case 2: return "Faible";
            case 3: return "Moyen";
            case 4: return "Fort";
            case 5: return "Très fort";
            default: return "";
        }
    }

    // Initialize password strength meter if it exists
    const passwordInput = document.getElementById('tempPass');
    const strengthMeter = document.getElementById('password-strength');
    
    if (passwordInput && strengthMeter) {
        passwordInput.addEventListener('input', function() {
            const result = checkPasswordStrength(this.value);
            
            // Update the strength meter
            strengthMeter.textContent = result.message;
            
            // Update strength bar if it exists
            const strengthBar = document.getElementById('strength-bar');
            if (strengthBar) {
                strengthBar.className = 'strength-bar';
                strengthBar.classList.add(`strength-${result.score}`);
            }
            
            // Enable/disable submit button based on password strength
            const submitButton = document.querySelector('.form-submit');
            if (submitButton) {
                submitButton.disabled = !result.isStrong;
            }
        });
    }

    // Initialize PayPal buttons if container exists
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer && typeof paypal !== 'undefined') {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'pill',
                label: 'pay'
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '82.62',
                            currency_code: 'CAD'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Generate unique order ID
                    const orderId = generateOrderId();
                    
                    // Save order details in local storage for admin tracking
                    localStorage.setItem(orderId, JSON.stringify({
                        status: 'En cours',
                        date: new Date().toISOString(),
                        customer: details.payer.email_address
                    }));
                    
                    // Fill order ID in the form
                    document.getElementById('orderId').value = orderId;
                    
                    // Show the form and confirmation message
                    document.getElementById('orderForm').classList.remove('hidden');
                    document.getElementById('confirmation-message').classList.remove('hidden');
                    
                    // Scroll to the form
                    document.getElementById('orderForm').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            },
            onError: function(err) {
                console.error('PayPal Error:', err);
                document.getElementById('error-message').classList.remove('hidden');
                document.getElementById('error-message').textContent = 'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer ou contacter le support.';
            }
        }).render('#paypal-button-container');
    }

    // Amélioration du formulaire de commande
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        // Génération visuelle du numéro de commande
        const orderIdDisplay = document.getElementById('order-id-display');
        if (orderIdDisplay) {
            const newOrderId = generateOrderId();
            
            // Animation du numéro de commande
            let currentIndex = 0;
            const chars = newOrderId.split('');
            const interval = setInterval(() => {
                if (currentIndex < chars.length) {
                    orderIdDisplay.textContent += chars[currentIndex];
                    currentIndex++;
                    // Effet de pulsation à chaque caractère ajouté
                    orderIdDisplay.classList.add('pulse');
                    setTimeout(() => {
                        orderIdDisplay.classList.remove('pulse');
                    }, 150);
                } else {
                    clearInterval(interval);
                    // Sauvegarder l'ID dans un champ caché
                    const orderIdInput = document.createElement('input');
                    orderIdInput.type = 'hidden';
                    orderIdInput.name = 'orderId';
                    orderIdInput.value = newOrderId;
                    orderForm.appendChild(orderIdInput);
                }
            }, 100);
        }

        // Validation dynamique et visuelle du formulaire
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formFields = orderForm.querySelectorAll('.form-control');
            let isValid = true;
            let firstInvalidField = null;

            // Validation de chaque champ avec effet visuel
            formFields.forEach(field => {
                if (!field.checkValidity()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    field.classList.remove('is-valid');
                    
                    // Animation de secousse pour les champs invalides
                    field.classList.add('shake-animation');
                    setTimeout(() => {
                        field.classList.remove('shake-animation');
                    }, 500);
                    
                    // Mémoriser le premier champ invalide
                    if (!firstInvalidField) firstInvalidField = field;
                } else {
                    field.classList.add('is-valid');
                    field.classList.remove('is-invalid');
                }
            });

            // Focus sur le premier champ invalide
            if (firstInvalidField) {
                firstInvalidField.focus();
                return;
            }
            
            if (isValid) {
                // Effet de chargement du bouton
                const submitButton = orderForm.querySelector('[type="submit"]');
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Traitement en cours...';
                
                // Simuler le traitement (à remplacer par l'envoi réel du formulaire)
                setTimeout(() => {
                    // Afficher le message de succès avec animation
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success fade-in';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Commande enregistrée avec succès! Vous allez recevoir un email de confirmation.';
                    
                    orderForm.innerHTML = '';
                    orderForm.appendChild(successMessage);
                    
                    // Redirection après quelques secondes (si nécessaire)
                    // setTimeout(() => {
                    //     window.location.href = '/suivi-commande.html';
                    // }, 3000);
                }, 1500);
            }
        });
    }

    // Check all required checkboxes functionality
    const checkAll = document.getElementById('check-all');
    if (checkAll) {
        const requiredChecks = document.querySelectorAll('.required-check');
        
        checkAll.addEventListener('change', function() {
            requiredChecks.forEach(check => {
                check.checked = this.checked;
            });
        });
        
        // Update "check all" if individual items are clicked
        requiredChecks.forEach(check => {
            check.addEventListener('change', function() {
                checkAll.checked = [...requiredChecks].every(c => c.checked);
            });
        });
    }    // FAQ accordions enhanced with smooth animations
    const faqItems = document.querySelectorAll('.faq-question');
    if (faqItems) {
        faqItems.forEach(question => {
            // Determine if we should reduce motion effects
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            question.addEventListener('click', () => {
                const item = question.parentNode;
                const answer = item.querySelector('.faq-answer');
                const icon = question.querySelector('i');
                
                // Toggle active state
                item.classList.toggle('active');
                
                // Smooth animation for the chevron
                if (icon) {
                    icon.style.transition = 'transform 0.3s ease';
                    if (item.classList.contains('active')) {
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
                
                // Smooth animation for the answer height
                if (!prefersReducedMotion && answer) {
                    if (item.classList.contains('active')) {
                        answer.style.height = answer.scrollHeight + 'px';
                        answer.style.opacity = '1';
                    } else {
                        answer.style.height = '0px';
                        answer.style.opacity = '0';
                    }
                }
            });
        });
    }

    // Animation on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkVisibility() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Run on page load
    checkVisibility();
    
    // Run on scroll
    window.addEventListener('scroll', checkVisibility);
});
