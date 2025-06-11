# SpotiDeals

Site officiel de SpotiDeals - Service d'activation d'abonnement Spotify à prix réduit.

## Thème sombre (Dark Theme)

Le site SpotiDeals dispose d'un thème sombre inspiré par l'interface de Spotify, offrant une expérience utilisateur immersive et moderne.

### Fonctionnalités du thème sombre

- **Palette de couleurs Spotify**: Utilisation des couleurs officielles de Spotify (vert #1DB954) avec un fond sombre (#121212)
- **Effets visuels**: Animations subtiles, effets de survol et visualisations audio inspirées par Spotify
- **Compatibilité multi-navigateurs**: Adaptations spécifiques pour Chrome, Firefox, Safari et Edge
- **Optimisations mobiles**: Version adaptée pour les appareils mobiles avec des performances optimisées
- **Personnalisation utilisateur**: Possibilité de basculer entre le mode clair et sombre via un bouton flottant
- **Respect des préférences système**: Détection des préférences "prefers-color-scheme" du système d'exploitation

### Structure technique

Le thème sombre est implémenté à travers plusieurs fichiers :

- `css/dark-theme.css` : Styles de base pour le thème sombre
- `css/dark-theme-enhancements.css` : Effets visuels avancés et animations
- `js/dark-theme.js` : Logique de gestion du thème et des préférences utilisateur
- `js/asset-path-fix.js` : Correction des chemins d'accès pour GitHub Pages
- `js/browser-compatibility.js` : Adaptations pour différents navigateurs

### Comment l'utiliser

Le thème sombre est activé automatiquement selon les préférences système, ou peut être basculé manuellement via le bouton flottant présent sur toutes les pages.

### Dépannage

Si vous rencontrez des problèmes avec le thème sombre :

1. Vérifiez que JavaScript est activé dans votre navigateur
2. Assurez-vous d'utiliser un navigateur moderne (Chrome, Firefox, Safari, Edge)
3. Vérifiez que tous les fichiers CSS et JS sont correctement chargés
4. Videz le cache de votre navigateur et rechargez la page

## Développement

### Installation locale

```bash
git clone https://github.com/spotideals/spotideals.github.io.git
cd spotideals.github.io
```

### Structure du projet

- `/css` : Feuilles de style
- `/js` : Scripts JavaScript
- `/images` : Images et ressources graphiques
- `/sections` : Composants HTML réutilisables

### GitHub Pages

Le site est déployé automatiquement via GitHub Pages. Chaque push sur la branche principale (`main`) déclenche un déploiement sur la branche `gh-pages`.

## Licence

Tous droits réservés © 2025 SpotiDeals
