# Spotideals

Site web de Spotideals - Votre plateforme de deals Spotify.

Site accessible à l'adresse : https://spotideals.github.io/index.html

## Description
SpoDeals est une plateforme qui vous permet de trouver les meilleures offres sur les abonnements Spotify.

## Mise en place locale
Pour tester le site sur votre machine, vous pouvez utiliser un petit serveur web :

```bash
# avec Python
python3 -m http.server
```

Ou avec Node.js :

```bash
npx http-server
```

Ensuite ouvrez `http://localhost:8000/index.html` dans votre navigateur. Le site peut aussi être hébergé via **GitHub Pages** en déployant la branche `main`.

## Fonctionnement des commandes
Une commande est créée depuis `index.html` ou `paiement.html`. Après validation du paiement PayPal, le script `paiement.html` génère un identifiant unique avec `generateOrderID()` puis envoie un courriel de confirmation via Formspree. L'utilisateur est redirigé vers la section de suivi.

## Suivi des commandes
La page `tracking.html` et la section correspondante dans `index.html` utilisent `API_URL` pour interroger un script Google Apps Script. Celui-ci lit les informations d'une feuille Google Sheets et renvoie le statut, la date et d'éventuelles notes pour l'identifiant saisi.

## Page d'administration
`admin.html` permet de lister l'ensemble des commandes via le même script Apps Script. L'accès est protégé par mot de passe. Après l'avoir saisi, l'administrateur peut changer le statut ou ajouter des notes. Les modifications sont envoyées en `POST` à `API_URL`.

## Dépendances npm
Aucune dépendance n'est requise pour le moment. Les commandes précédentes utilisent uniquement `http-server` pour un hébergement local si vous disposez de Node.js.
