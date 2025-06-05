# SpotiDeals

Site web de SpotiDeals - Votre plateforme de deals Spotify.

Site accessible à l'adresse : https://spotideals.github.io/index.html

## Description
SpotiDeals est une plateforme qui vous permet de trouver les meilleures offres sur les abonnements Spotify.

## Déployer l'API `/exec`

Le site interagit avec un script Web (Google Apps Script ou intégration Airtable) exposant une URL se terminant par `/exec`. Pour mettre ce service en place :

1. Créez un nouveau projet Apps Script (ou un script Airtable) et connectez-le au tableur ou à la base contenant les commandes.
2. Indiquez dans le code votre identifiant de tableur ou de base (`SPREADSHEET_ID` ou `BASE_ID`) et définissez un mot de passe administrateur.
3. Publiez le projet en tant qu'application Web et notez l'URL générée.

L'API doit répondre aux requêtes suivantes :

- `GET /exec`&nbsp;: renvoie la liste des commandes (ou les détails d'une commande via `orderID`).
- `POST /exec`&nbsp;: met à jour une commande. Le corps JSON doit contenir `orderID`, `status`, `notes` (facultatif) et `password`.

Une fois l'API déployée, remplacez la constante `API_URL` dans `admin.html` et `tracking.html` par l'URL obtenue afin que ces pages puissent communiquer avec votre script.

## Développement local

1. Installez les dépendances npm :
   ```bash
   npm install
   ```
2. Servez le site avec un serveur statique (par exemple via Python) :
   ```bash
   python3 -m http.server
   ```
   Puis ouvrez votre navigateur sur `http://localhost:8000/index.html`.

### Tests

Assurez-vous d'exécuter `npm install` pour installer les dépendances, puis lancez les tests Jest avec :
```bash
npm test
```

## Pages principales

- **Home (`index.html`)** : page d'accueil présentant les offres et permettant la commande d'un abonnement Spotify.
- **Tracking (`tracking.html`)** : permet de saisir un numéro de commande pour suivre son statut.
- **Admin login (`admin-login.html`)** : page d'authentification réservée à l'administration.
- **Admin (`admin.html`)** : interface d'administration pour consulter et gérer les commandes.

  - Gère les commandes : tri, recherche, modification de statut et notes
  - Statistiques rapides, export CSV, impression et déconnexion sécurisée
=======
 main
