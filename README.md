# SpotiDeals

Site web de SpotiDeals - Votre plateforme de deals Spotify.

Site accessible à l'adresse : https://spotideals.github.io/index.html

## Description
SpotiDeals est une plateforme qui vous permet de trouver les meilleures offres sur les abonnements Spotify.

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

Après l'installation des dépendances, exécutez les tests Jest avec :
```bash
npm test
```

## Pages principales

- **Home (`index.html`)** : page d'accueil présentant les offres et permettant la commande d'un abonnement Spotify.
- **Tracking (`tracking.html`)** : permet de saisir un numéro de commande pour suivre son statut.
- **Admin (`admin.html`)** : interface d'administration pour consulter et gérer les commandes.
