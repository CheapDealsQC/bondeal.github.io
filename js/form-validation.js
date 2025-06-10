// Form validation et animations avancées pour SpotiDeals

document.addEventListener('DOMContentLoaded', function() {
    initializeFormEnhancements();
    
    // Initialiser la validation en temps réel sur les formulaires
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        initializeFormValidation(form);
    });
});

/**
 * Initialise les améliorations du formulaire comme le label flottant et les animations
 */
function initializeFormEnhancements() {
    // Ajouter les classes has-value aux champs avec des valeurs
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
        
        // Gestion du focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        // Gestion de la sortie de focus
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
            
            // Valider le champ lors de la sortie
            validateField(this);
        });
        
        // Valider à la saisie avec un délai
        input.addEventListener('input', debounce(function() {
            validateField(this);
        }, 300));
    });
    
    // Initialiser la barre de force du mot de passe
    const passwordField = document.getElementById('tempPass');
    if (passwordField) {
        passwordField.addEventListener('input', evaluatePasswordStrength);
    }
    
    // Gestion des cases à cocher
    const checkboxes = document.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.id === 'check-all') {
                const requiredChecks = document.querySelectorAll('.required-check:not(#check-all)');
                requiredChecks.forEach(check => {
                    check.checked = this.checked;
                });
                validateCheckboxes();
            } else {
                validateCheckboxes();
            }
        });
    });
}

/**
 * Initialise la validation complète d'un formulaire
 * @param {HTMLFormElement} form - Le formulaire à valider
 */
function initializeFormValidation(form) {
    if (!form) return;
    
    // Valider lors de la soumission
    form.addEventListener('submit', function(event) {
        if (!validateForm(this)) {
            event.preventDefault();
            event.stopPropagation();
            showFormError("Veuillez corriger les erreurs dans le formulaire");
        }
    });
    
    // Ajouter des conteneurs de feedback
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        // Créer les conteneurs de feedback s'ils n'existent pas déjà
        if (!input.parentElement.querySelector('.feedback')) {
            const invalidFeedback = document.createElement('div');
            invalidFeedback.className = 'feedback invalid-feedback';
            invalidFeedback.id = `${input.id}-invalid-feedback`;
            
            const validFeedback = document.createElement('div');
            validFeedback.className = 'feedback valid-feedback';
            validFeedback.id = `${input.id}-valid-feedback`;
            validFeedback.textContent = "Ce champ est valide";
            
            input.parentElement.appendChild(invalidFeedback);
            input.parentElement.appendChild(validFeedback);
        }
    });
}

/**
 * Valide un champ spécifique
 * @param {HTMLInputElement} field - Le champ à valider
 * @returns {boolean} - True si le champ est valide
 */
function validateField(field) {
    if (!field) return false;
    
    const invalidFeedback = document.getElementById(`${field.id}-invalid-feedback`);
    const validFeedback = document.getElementById(`${field.id}-valid-feedback`);
    let isValid = true;
    let errorMessage = '';
    
    // Réinitialiser les classes de validation
    field.classList.remove('is-valid', 'is-invalid');
    
    // Cacher les feedbacks
    if (invalidFeedback) {
        invalidFeedback.classList.remove('visible');
    }
    if (validFeedback) {
        validFeedback.classList.remove('visible');
    }
    
    // Si le champ est vide et requis
    if (field.required && field.value.trim() === '') {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } 
    // Validation email
    else if (field.type === 'email' && field.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer une adresse email valide';
        }
    }
    // Validation mot de passe
    else if (field.id === 'tempPass' && field.value.trim() !== '') {
        if (field.value.length < 8) {
            isValid = false;
            errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
        }
    }
    
    // Appliquer les classes et messages appropriés
    if (!isValid) {
        field.classList.add('is-invalid');
        if (invalidFeedback) {
            invalidFeedback.textContent = errorMessage;
            invalidFeedback.classList.add('visible');
        }
    } else if (field.value.trim() !== '') {
        field.classList.add('is-valid');
        if (validFeedback) {
            validFeedback.classList.add('visible');
        }
    }
    
    // Mettre à jour l'état du bouton de soumission
    updateSubmitButtonState(field.form);
    
    return isValid;
}

/**
 * Valide toutes les cases à cocher requises
 */
function validateCheckboxes() {
    const checkAll = document.getElementById('check-all');
    const requiredChecks = document.querySelectorAll('.required-check:not(#check-all)');
    let allChecked = true;
    
    requiredChecks.forEach(check => {
        if (!check.checked) {
            allChecked = false;
        }
    });
    
    if (checkAll) {
        checkAll.checked = allChecked;
    }
    
    // Si on a un formulaire de commande, activer/désactiver le bouton PayPal
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
        if (allChecked) {
            paypalContainer.classList.remove('disabled');
        } else {
            paypalContainer.classList.add('disabled');
        }
    }
}

/**
 * Évalue la force du mot de passe
 */
function evaluatePasswordStrength() {
    const password = document.getElementById('tempPass').value;
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('password-strength');
    
    if (!strengthBar || !strengthText) return;
    
    // Critères de force
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Calculer le score
    let strength = 0;
    if (hasLength) strength++;
    if (hasUpperCase && hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChars) strength++;
    
    // Mettre à jour l'UI
    strengthBar.setAttribute('data-strength', strength);
    
    // Définir le texte
    let strengthLabel = "Très faible";
    if (strength === 1) strengthLabel = "Faible";
    if (strength === 2) strengthLabel = "Moyen";
    if (strength === 3) strengthLabel = "Fort";
    if (strength === 4) strengthLabel = "Très fort";
    
    strengthText.textContent = strengthLabel;
}

/**
 * Valide l'intégralité du formulaire
 * @param {HTMLFormElement} form - Le formulaire à valider
 * @returns {boolean} - True si le formulaire est valide
 */
function validateForm(form) {
    if (!form) return false;
    
    const inputs = form.querySelectorAll('.form-control');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            
            // Animation de secousse sur les champs invalides
            input.classList.add('shake-animation');
            setTimeout(() => {
                input.classList.remove('shake-animation');
            }, 500);
        }
    });
    
    return isValid;
}

/**
 * Met à jour l'état du bouton de soumission
 * @param {HTMLFormElement} form - Le formulaire contenant le bouton
 */
function updateSubmitButtonState(form) {
    if (!form) return;
    
    const submitButton = form.querySelector('.form-submit');
    if (!submitButton) return;
    
    const invalidInputs = form.querySelectorAll('.form-control.is-invalid');
    const requiredInputs = form.querySelectorAll('.form-control[required]');
    let hasEmptyRequired = false;
    
    requiredInputs.forEach(input => {
        if (input.value.trim() === '') {
            hasEmptyRequired = true;
        }
    });
    
    if (invalidInputs.length > 0 || hasEmptyRequired) {
        submitButton.disabled = true;
    } else {
        submitButton.disabled = false;
    }
}

/**
 * Affiche un message d'erreur de formulaire
 * @param {string} message - Le message d'erreur à afficher
 */
function showFormError(message) {
    const errorElement = document.getElementById('error-message');
    if (!errorElement) return;
    
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    errorElement.classList.add('shake-animation');
    
    setTimeout(() => {
        errorElement.classList.remove('shake-animation');
    }, 500);
    
    // Masquer après un délai
    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => {
            errorElement.classList.add('hidden');
            errorElement.classList.remove('fade-out');
        }, 300);
    }, 5000);
}

/**
 * Fonction debounce pour limiter le nombre d'appels de fonction
 * @param {Function} func - Fonction à exécuter
 * @param {number} wait - Temps d'attente en millisecondes
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
