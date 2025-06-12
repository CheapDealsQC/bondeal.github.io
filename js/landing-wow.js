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
// Animation d'apparition section par section (AOS)
function aosInit() {
  const els = document.querySelectorAll('.aos-fade-up, .aos-slide');
  function reveal() {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) el.classList.add('aos-show');
    });
  }
  window.addEventListener('scroll', reveal);
  window.addEventListener('DOMContentLoaded', reveal);
}
aosInit();
// Loader animé pendant le paiement
function showLoader(show) {
  const overlay = document.getElementById('loader-overlay');
  if (show) overlay.classList.remove('hidden');
  else overlay.classList.add('hidden');
}
// PayPal Smart Buttons avec gestion d'erreur
if(window.paypal) {
  let paypalLoaded = false;
  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
    onInit: function() { showLoader(false); },
    onClick: function() { showLoader(true); },
    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '82.62', currency_code:'CAD' } }] }),
    onApprove: (data, actions) => actions.order.capture().then(function() {
      showLoader(false);
      paypalLoaded = true;
      document.getElementById('paypal-error').classList.add('hidden');
      // Générer un order ID unique
      const id = 'SD-' + Date.now().toString(36).toUpperCase();
      document.getElementById('orderForm').classList.remove('hidden');
      document.querySelector('.step-indicator.step-2').classList.remove('hidden');
      document.querySelector('.step-indicator.step-1').classList.add('hidden');
      document.getElementById('order-success').classList.add('hidden');
      document.getElementById('order-id-toast').textContent = id;
      // Steps bar progression
      document.querySelector('.steps-bar .step-1').classList.remove('active');
      document.querySelector('.steps-bar .step-2').classList.add('active');
      // Toast
      document.getElementById('order-success').classList.remove('hidden');
      setTimeout(()=>{
        document.getElementById('order-success').classList.add('hidden');
      }, 6000);
      // Scroll to form
      document.getElementById('orderForm').scrollIntoView({behavior:'smooth'});
      document.getElementById('email').focus();
    }),
    onError: function() {
      showLoader(false);
      document.getElementById('paypal-error').classList.remove('hidden');
    }
  }).render('#paypal-button-container');
  // Timeout si PayPal ne charge pas
  setTimeout(() => {
    if(!paypalLoaded) document.getElementById('paypal-error').classList.remove('hidden');
  }, 8000);
}
// Formulaire validation + steps bar progression
const orderForm = document.getElementById('orderForm');
if(orderForm){
  orderForm.addEventListener('submit',function(e){
    e.preventDefault();
    const email = orderForm.email.value.trim();
    const pass = orderForm.tempPass.value.trim();
    if(!email || !pass || !/^.{8,}$/.test(pass)){
      alert('Merci de remplir tous les champs (mot de passe : 8 caractères min).');
      return;
    }
    orderForm.classList.add('hidden');
    document.getElementById('order-success').classList.remove('hidden');
    document.getElementById('order-success').scrollIntoView({behavior:'smooth'});
    document.getElementById('order-success').focus();
    // Steps bar progression
    document.querySelector('.steps-bar .step-2').classList.remove('active');
    document.querySelector('.steps-bar .step-3').classList.add('active');
  });
}
// Témoignages slider (scroll auto + swipe mobile)
const slider = document.querySelector('.testimonial-slider');
if(slider && slider.children.length > 1){
  let idx = 0;
  setInterval(()=>{
    idx = (idx+1)%slider.children.length;
    slider.scrollTo({left: slider.children[idx].offsetLeft, behavior:'smooth'});
  }, 5000);
  // Swipe mobile
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40) {
      if(dx < 0) idx = Math.min(idx+1, slider.children.length-1);
      else idx = Math.max(idx-1, 0);
      slider.scrollTo({left: slider.children[idx].offsetLeft, behavior:'smooth'});
    }
  });
}
// Bouton sticky de partage
const shareBtn = document.querySelector('.share-btn-sticky');
if(shareBtn) {
  shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    const text = encodeURIComponent("🎵 Spotify Premium 12 mois à 53% moins cher sur SpotiDeals !");
    const shareLinks = [
      `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
    ];
    if(navigator.share) {
      navigator.share({ title: "SpotiDeals", text: "Spotify Premium 12 mois à 53% moins cher !", url });
    } else {
      window.open(shareLinks[0], '_blank');
    }
  });
}
// Mini-chat flottant
const chatBtn = document.querySelector('.mini-chat-btn');
if(chatBtn) {
  chatBtn.addEventListener('click', () => {
    window.open('mailto:spotideals.github.io@gmail.com?subject=Question%20SpotiDeals','_blank');
  });
} 