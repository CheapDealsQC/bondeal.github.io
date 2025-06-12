// Sticky nav smooth scroll
const navLinks = document.querySelectorAll('.main-nav a, .footer-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if(href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth'});
    }
  });
});
// Checklist gating PayPal
const checklistBoxes = document.querySelectorAll('.checklist-box');
const paypalBtnContainer = document.getElementById('paypal-button-container');
function updatePayPalState() {
  const allChecked = Array.from(checklistBoxes).every(box => box.checked);
  paypalBtnContainer.style.pointerEvents = allChecked ? 'auto' : 'none';
  paypalBtnContainer.style.opacity = allChecked ? '1' : '0.5';
}
checklistBoxes.forEach(box => box.addEventListener('change', updatePayPalState));
updatePayPalState();
// PayPal Smart Buttons
if(window.paypal) {
  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '82.62', currency_code:'CAD' } }] }),
    onApprove: (data, actions) => actions.order.capture().then(function() {
      // Générer un order ID unique
      const id = 'SD-' + Date.now().toString(36).toUpperCase();
      document.getElementById('orderForm').classList.remove('hidden');
      document.getElementById('order-success').classList.add('hidden');
      document.getElementById('order-id-toast').textContent = id;
      // Toast
      document.getElementById('order-success').classList.remove('hidden');
      setTimeout(()=>{
        document.getElementById('order-success').classList.add('hidden');
      }, 6000);
      // Scroll to form
      document.getElementById('orderForm').scrollIntoView({behavior:'smooth'});
    })
  }).render('#paypal-button-container');
}
// Formulaire validation
const orderForm = document.getElementById('orderForm');
if(orderForm){
  orderForm.addEventListener('submit',function(e){
    e.preventDefault();
    const email = orderForm.email.value.trim();
    const user = orderForm.spotifyUser.value.trim();
    const pass = orderForm.tempPass.value.trim();
    if(!email || !user || !pass || !/^.{8,}$/.test(pass)){
      alert('Merci de remplir tous les champs (mot de passe : 8 caractères min).');
      return;
    }
    orderForm.classList.add('hidden');
    document.getElementById('order-success').classList.remove('hidden');
  });
}
// Témoignages slider (scroll auto)
const slider = document.querySelector('.testimonial-slider');
if(slider && slider.children.length > 1){
  let idx = 0;
  setInterval(()=>{
    idx = (idx+1)%slider.children.length;
    slider.scrollTo({left: slider.children[idx].offsetLeft, behavior:'smooth'});
  }, 5000);
} 