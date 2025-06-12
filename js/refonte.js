// SpotiDeals Refonte JS
// Animation d'apparition douce (fade/slide) sur scroll
function aosInit() {
  const els = document.querySelectorAll('.aos-fade-up');
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
// Validation formulaire commande
const orderForm = document.getElementById('orderForm');
if(orderForm){
  orderForm.addEventListener('submit',function(e){
    e.preventDefault();
    // Validation simple
    const email = orderForm.email.value.trim();
    const user = orderForm.spotifyUser.value.trim();
    const pass = orderForm.tempPass.value.trim();
    if(!email || !user || !pass){
      alert('Merci de remplir tous les champs.');
      return;
    }
    // Simuler succès
    orderForm.classList.add('hidden');
    document.getElementById('order-success').classList.remove('hidden');
  });
}
// Animation bouton/hero
const btns = document.querySelectorAll('.btn-glow');
btns.forEach(btn => {
  btn.addEventListener('mousemove', e => {
    btn.style.boxShadow = `0 0 24px 4px #24e38c99, 0 2px 12px 0 #1db95455`;
  });
  btn.addEventListener('mouseleave', e => {
    btn.style.boxShadow = '';
  });
}); 