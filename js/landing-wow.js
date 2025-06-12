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
  shareBtn.addEventListener('click', shareSpotideal);
}
// Mini-chat flottant
const chatBtn = document.querySelector('.mini-chat-btn');
if(chatBtn) {
  chatBtn.addEventListener('click', () => toggleMiniChat());
}

document.addEventListener('DOMContentLoaded', function () {
  // Animation personnalisée à l'apparition pour chaque section
  const animatedSections = document.querySelectorAll('.slide-up, .slide-down, .slide-left, .slide-right, .zoom-in');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedSections.forEach(section => {
    observer.observe(section);
  });

  // Onboarding progress bar logic
  const steps = [
    { id: 'prix', step: 1 },
    { id: 'securite', step: 2 },
    { id: 'temoignages', step: 3 }
  ];
  const onboardingSteps = document.querySelectorAll('.onboarding-step');

  function updateOnboardingStep() {
    let current = 1;
    for (let i = 0; i < steps.length; i++) {
      const section = document.getElementById(steps[i].id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
          current = steps[i].step;
          break;
        }
      }
    }
    onboardingSteps.forEach(step => {
      step.classList.toggle('active', Number(step.dataset.step) === current);
    });
  }
  window.addEventListener('scroll', updateOnboardingStep);
  updateOnboardingStep();

  // Scroll progress bar
  const progressBar = document.getElementById('scrollProgressBar');
  function updateScrollBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateScrollBar);
  updateScrollBar();

  // Checklist gating PayPal
  const goToPayPalBtn = document.getElementById('goToPayPal');
  function updatePayPalBtn() {
    const allChecked = Array.from(checklistBoxes).every(box => box.checked);
    goToPayPalBtn.disabled = !allChecked;
  }
  checklistBoxes.forEach(box => box.addEventListener('change', updatePayPalBtn));
  updatePayPalBtn();
  goToPayPalBtn.addEventListener('click', function() {
    document.getElementById('commande').scrollIntoView({behavior:'smooth'});
    setTimeout(()=>{
      const paypalBtn = document.getElementById('paypal-button-container');
      if(paypalBtn) paypalBtn.scrollIntoView({behavior:'smooth'});
    }, 600);
  });
});

function shareSpotideal() {
  const url = window.location.href;
  const text = "🎵 Profite de Spotify Premium à -53% sur Spotideal !";
  if (navigator.share) {
    navigator.share({ title: 'Spotideal', text, url });
  } else {
    navigator.clipboard.writeText(url);
    showToast('Lien copié !');
  }
}

function showToast(msg) {
  let toast = document.getElementById('spotideal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'spotideal-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '2.5rem';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(24,28,32,0.95)';
    toast.style.color = '#fff';
    toast.style.padding = '0.8rem 1.5rem';
    toast.style.borderRadius = '1.5rem';
    toast.style.fontSize = '1.05rem';
    toast.style.zIndex = 3000;
    toast.style.boxShadow = '0 4px 24px #1db95433';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = 1;
  setTimeout(() => { toast.style.opacity = 0; }, 1800);
}

function toggleMiniChat(force) {
  const chat = document.getElementById('miniChatWindow');
  if (typeof force === 'boolean') {
    chat.classList.toggle('open', force);
  } else {
    chat.classList.toggle('open');
  }
  if (chat.classList.contains('open')) {
    setTimeout(() => {
      document.getElementById('miniChatInput').focus();
    }, 200);
  }
}

function sendMiniChat(e) {
  e.preventDefault();
  const input = document.getElementById('miniChatInput');
  if (input.value.trim().length > 0) {
    showToast('Merci, nous vous répondons sous peu !');
    input.value = '';
    toggleMiniChat(false);
  }
} 