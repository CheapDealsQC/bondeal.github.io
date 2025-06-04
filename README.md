# Spotideals

Site web de Spotideals - Votre plateforme de deals Spotify.

Site accessible à l'adresse : https://spotideals.github.io/index.html

## Description
SpoDeals est une plateforme qui vous permet de trouver les meilleures offres sur les abonnements Spotify.

## Server

The repository now includes a small Express backend in `server/index.js` that handles Google Sheets interactions. It relies on the following environment variables:

- `SERVICE_ACCOUNT_EMAIL`
- `SERVICE_ACCOUNT_PRIVATE_KEY`
- `SPREADSHEET_ID`
- `PORT` (optional)

Run the server with `node server/index.js` after installing dependencies (`npm install express googleapis dotenv`).
