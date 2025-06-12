// Sticky nav smooth scroll
        document.getElementById('orderForm').scrollIntoView({behavior:'smooth'});
        document.getElementById('email').focus();
      });
    }).render('#paypal-button-container');
    // Simule un clic sur le bouton PayPal caché
    setTimeout(function() {
      const btn = document.querySelector('#paypal-button-container iframe');
}

// Checklist gating PayPal
const checklistBoxes = document.querySelectorAll('.checklist-box');
const goToPayPalBtn = document.getElementById('goToPayPal');
if (goToPayPalBtn && typeof paypal !== 'undefined') {
  goToPayPalBtn.addEventListener('click', function(e) {
    e.preventDefault();
    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: function(data, actions) { return actions.order.create({ purchase_units: [{ amount: { value: '82.62', currency_code:'CAD' } }] }); },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function() {
          document.getElementById('orderForm').classList.remove('hidden');
          document.querySelector('.step-indicator.step-2').classList.remove('hidden');
          document.querySelector('.step-indicator.step-1').classList.add('hidden');
          document.getElementById('order-success').classList.add('hidden');
          document.getElementById('orderForm').scrollIntoView({behavior:'smooth'});
          document.getElementById('email').focus();
        });
      }
    }).render('#paypal-button-container');
    setTimeout(function() {
      const btn = document.querySelector('#paypal-button-container iframe');
      if (btn) btn.contentWindow.focus();
    }, 500);
  });
} 