document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const orderNumberField = document.getElementById('orderNumber');

    // Générer un numéro de commande unique
    const generateOrderNumber = () => {
        return 'SD-' + Date.now();
    };

    orderNumberField.value = generateOrderNumber();

    // Validation du mot de passe
    orderForm.addEventListener('submit', (event) => {
        const password = document.getElementById('password').value;
        const requiredPassword = '1C1GCEA_enCA1146CA1146&oq=&gs_lcrp=EgZjaHJvbWUqEQgDEAAYAxhCGI8BGLQCGOoCMgkIABAjGCcY6gIyCQgBECMYJxjqAjIJCAIQIxgnGOoCMhEIAxAAGAMYQhiPARi0AhjqAjIRCAQQABgDGEIYjwEYtAIY6gIyEQg';
        
        if (password !== requiredPassword) {
            alert('Le mot de passe doit être exactement : ' + requiredPassword);
            event.preventDefault();
        }
    });
});
