// SpotiDeals Main JavaScript - Created: June 2025
document.addEventListener('DOMContentLoaded', function() {
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

    // Form validation
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            // Check Spotify username/email
            const spotifyUser = document.getElementById('spotifyUser');
            if (spotifyUser && !spotifyUser.value.trim()) {
                event.preventDefault();
                alert('Veuillez entrer votre nom d\'utilisateur ou email Spotify.');
                return;
            }
            
            // Check password strength
            const tempPass = document.getElementById('tempPass');
            if (tempPass) {
                const result = checkPasswordStrength(tempPass.value);
                if (!result.isStrong) {
                    event.preventDefault();
                    alert('Veuillez utiliser un mot de passe temporaire plus sécurisé.');
                    return;
                }
            }
            
            // Everything looks good, continue with submission
            // Set form submission time for tracking
            const formTimeField = document.getElementById('formTime');
            if (formTimeField) {
                formTimeField.value = new Date().toISOString();
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
    }

    // FAQ accordions
    const faqItems = document.querySelectorAll('.faq-question');
    if (faqItems) {
        faqItems.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentNode;
                item.classList.toggle('active');
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
