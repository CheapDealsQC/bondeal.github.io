document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const orderNumberField = document.getElementById('orderNumber');
    const submitButton = document.getElementById('submitOrder');

    // Générer un numéro de commande unique
    const generateOrderNumber = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        return `ORD-${year}${month}${day}-${random}`;
    };

    orderNumberField.value = generateOrderNumber();

    // Activer le bouton si le formulaire est valide
    orderForm.addEventListener('input', () => {
        submitButton.disabled = !orderForm.checkValidity();
    });
});
