// Gestion du formulaire de commande
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    const orderBtn = document.getElementById('order-btn');
    const checkboxes = document.querySelectorAll('.consent-checks input[type="checkbox"]');

    // Fonction pour vérifier si toutes les cases sont cochées
    function checkAllConsents() {
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
        orderBtn.disabled = !allChecked;
    }

    // Ajouter les écouteurs d'événements pour chaque checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', checkAllConsents);
    });

    // Gestion de la soumission du formulaire
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Vérifier à nouveau les consentements avant la soumission
            if (!Array.from(checkboxes).every(checkbox => checkbox.checked)) {
                alert('Veuillez accepter tous les termes avant de continuer.');
                return;
            }

            // Récupérer les valeurs du formulaire
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validation basique
            if (!email || !password) {
                alert('Veuillez remplir tous les champs requis.');
                return;
            }

            // Ici, vous pouvez ajouter la logique pour envoyer les données au serveur
            // Par exemple, rediriger vers PayPal
            window.location.href = 'paiement.html';
        });
    }
}); 