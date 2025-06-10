'use strict';

export function initPayPalButtons() {
    if (!document.getElementById('paypal-button-container')) {
        return;
    }

    // Hide the original order button, show PayPal button container
    const orderBtn = document.getElementById('order-btn');
    const paypalContainer = document.getElementById('paypal-button-container');
    const form = document.getElementById('order-form');

    if (orderBtn && paypalContainer && form) {
        orderBtn.addEventListener('click', (event) => {
            event.preventDefault(); // prevent form submission
            if(form.checkValidity()) {
                orderBtn.style.display = 'none';
                renderPayPalButtons();
            } else {
                form.reportValidity();
            }
        });
    }


    function renderPayPalButtons() {
        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK not loaded.');
            // Maybe show an error to the user
            return;
        }

        paypal.Buttons({
            createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                const purchaseAmount = '82.62'; // Should match the offer price
                return actions.order.create({
                    purchase_units: [{
                        description: 'Pack Activation Spotify Premium 12 mois INDIVIDUEL',
                        amount: {
                            value: purchaseAmount,
                            currency_code: 'CAD'
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                    // This function shows a success message to your buyer.
                    console.log('Transaction completed by ' + details.payer.name.given_name);
                    console.log('Transaction details:', details);
                    
                    alert('Transaction complétée ! Merci pour votre achat.');

                    // You can redirect to a thank you page here
                    // window.location.href = 'thank-you.html';

                    // Or show a message on the page
                    if (paypalContainer) {
                        paypalContainer.innerHTML = '<h3>Merci pour votre paiement !</h3>';
                    }

                    // Here you could also collect the order form data and send it somewhere
                    // along with the paypal transaction ID (details.id)
                });
            },
            onError: function (err) {
                // For example, redirect to an error page
                console.error('PayPal Checkout onError', err);
                // window.location.href = "/your-error-page-here";
                alert("Une erreur est survenue durant le paiement. Veuillez réessayer.");
            }
        }).render('#paypal-button-container').catch(err => {
            console.error("Failed to render PayPal buttons", err);
        });
    }
} 