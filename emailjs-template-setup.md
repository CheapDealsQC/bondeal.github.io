# Configuration EmailJS pour SpotiDeals

## Template EmailJS pour confirmation de commande

### Service ID: `service_ajkhda1`
### Template ID: `commande_status`

### Contenu du template email :

**Sujet :** SpotiDeals - Commande confirmée ({{order_id}})

**Corps du message :**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de commande SpotiDeals</title>
    <style>
        body { font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1db954, #24e38c); color: white; padding: 2rem; text-align: center; }
        .content { padding: 2rem; }
        .order-details { background: rgba(29,185,84,0.1); padding: 1.5rem; border-radius: 8px; margin: 1rem 0; }
        .footer { background: #232a34; color: white; padding: 1rem; text-align: center; font-size: 0.9rem; }
        .highlight { color: #1db954; font-weight: bold; }
        .warning { background: rgba(255,193,7,0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid #ffc107; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Commande confirmée !</h1>
            <p>Merci pour votre achat, {{customer_name}} !</p>
        </div>
        
        <div class="content">
            <p>Bonjour <strong>{{customer_name}}</strong>,</p>
            
            <p>Votre commande SpotiDeals a été confirmée avec succès ! Voici les détails :</p>
            
            <div class="order-details">
                <h3>📋 Détails de votre commande</h3>
                <p><strong>🎫 Numéro de commande :</strong> {{order_id}}</p>
                <p><strong>📧 Email Spotify :</strong> {{spotify_email}}</p>
                <p><strong>💰 Montant payé :</strong> {{amount}} {{currency}}</p>
                <p><strong>📅 Date de commande :</strong> {{order_date}}</p>
                <p><strong>⏰ Activation prévue :</strong> {{expected_activation}}</p>
                <p><strong>📋 Transaction PayPal :</strong> {{paypal_transaction}}</p>
            </div>
            
            <div class="warning">
                <h4>⏰ Prochaines étapes :</h4>
                <ol>
                    <li><strong>Activation (48-72h) :</strong> Notre équipe va activer votre abonnement Premium sous 3 jours ouvrés maximum</li>
                    <li><strong>Notification :</strong> Vous recevrez un email dès que votre compte sera activé</li>
                    <li><strong>Connexion :</strong> Connectez-vous à Spotify avec vos identifiants habituels</li>
                </ol>
            </div>
            
            <h3>🔍 Suivi de commande</h3>
            <p>Vous pouvez suivre l'état de votre commande à tout moment :</p>
            <p><strong>Numéro de suivi :</strong> <span class="highlight">{{order_id}}</span></p>
            <p><a href="https://spotideals.github.io/suivi-commande.html?order={{order_id}}" style="background: #1db954; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">🔍 Suivre ma commande</a></p>
            
            <h3>📞 Support client</h3>
            <p>Une question ? Notre équipe est là pour vous aider :</p>
            <ul>
                <li>📧 Email : <a href="mailto:{{support_email}}">{{support_email}}</a></li>
                <li>⏰ Disponible 7j/7</li>
            </ul>
            
            <div class="warning">
                <h4>🔒 Sécurité</h4>
                <p>Vos identifiants Spotify ont été traités de manière sécurisée et ne sont stockés que le temps nécessaire à l'activation. Nous recommandons de changer votre mot de passe Spotify après l'activation.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 SpotiDeals. Tous droits réservés.</p>
            <p>Spotify® est une marque déposée qui n'est pas affiliée à ce service.</p>
        </div>
    </div>
</body>
</html>
```

## Variables du template à configurer dans EmailJS :

1. `to_email` - Email du destinataire
2. `customer_name` - Nom du client
3. `order_id` - Numéro de commande
4. `spotify_email` - Email Spotify du client
5. `amount` - Montant payé
6. `currency` - Devise (CAD)
7. `order_date` - Date de la commande
8. `expected_activation` - Date d'activation prévue
9. `paypal_transaction` - ID transaction PayPal
10. `support_email` - Email du support

## Configuration dans index.html

La clé publique EmailJS à remplacer :
```javascript
publicKey: 'jQBmJJM9MbN5JZdlc' // Remplacez par votre vraie clé
```

## Test de l'intégration

1. Créez un compte EmailJS sur emailjs.com
2. Configurez un service email (Gmail, Outlook, etc.)
3. Créez un template avec le contenu ci-dessus
4. Remplacez les ID dans le code
5. Testez l'envoi d'un email

## Airtable Configuration

L'API Airtable doit être configurée via un Cloudflare Worker ou service proxy pour sécuriser les clés API.

Exemple de structure de base Airtable :
- Order ID (Single line text)
- Email Spotify (Email)
- Mot de passe (Single line text, masqué)
- Email Client (Email)
- PayPal Transaction (Single line text)
- Montant (Number)
- Devise (Single select: CAD, USD, EUR)
- Statut (Single select: En attente, En cours, Activé, Erreur)
- Date Commande (Date & time)
- Date Activation Prevue (Date & time)
