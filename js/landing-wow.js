// Checklist gating PayPal
const checklistBoxes = document.querySelectorAll('.checklist-box');
const goToPayPalBtn = document.getElementById('goToPayPal');

// Activation/désactivation du bouton PayPal selon la checklist
if (checklistBoxes.length && goToPayPalBtn) {
  function updatePayBtn() {
    const allChecked = Array.from(checklistBoxes).every(box => box.checked);
    goToPayPalBtn.disabled = !allChecked;
  }
  checklistBoxes.forEach(box => box.addEventListener('change', updatePayBtn));
  updatePayBtn();
}

// Gestion du paiement PayPal
if (goToPayPalBtn && typeof paypal !== 'undefined') {
  goToPayPalBtn.addEventListener('click', function(e) {
    e.preventDefault();
    // Nettoyage du conteneur PayPal avant de le rerendre
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) paypalContainer.innerHTML = '';
    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{ amount: { value: '82.62', currency_code: 'CAD' } }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function() {
          const orderForm = document.getElementById('orderForm');
          const step2 = document.querySelector('.step-indicator.step-2');
          const step1 = document.querySelector('.step-indicator.step-1');
          const orderSuccess = document.getElementById('order-success');
          if (orderForm) orderForm.classList.remove('hidden');
          if (step2) step2.classList.remove('hidden');
          if (step1) step1.classList.add('hidden');
          if (orderSuccess) orderSuccess.classList.add('hidden');
          if (orderForm) {
            orderForm.scrollIntoView({ behavior: 'smooth' });
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.focus();
          }
        });
      },
      onError: function(err) {
        const errorMsg = document.getElementById('paypal-error');
        if (errorMsg) {
          errorMsg.classList.remove('hidden');
          errorMsg.textContent = 'Une erreur est survenue lors du paiement. Veuillez réessayer ou contacter le support.';
        }
        console.error('PayPal Error:', err);
      }
    }).render('#paypal-button-container');
    // Optionnel : focus sur l’iframe PayPal après apparition
    setTimeout(function() {
      const btn = document.querySelector('#paypal-button-container iframe');
      if (btn && btn.contentWindow) btn.contentWindow.focus();
    }, 700);
  });
}