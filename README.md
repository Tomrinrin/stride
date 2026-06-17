# Stride — comparateur de chaussures de running

Site média + comparateur construit avec **Astro 6**, **React 19** (pour les parties interactives) et **Tailwind CSS v4**.

## Prérequis
- Node.js **22.12 ou plus** (vérifie avec `node -v`). À installer depuis https://nodejs.org si besoin.

## Lancer le site en local
Dans un terminal, à la racine du dossier :

```bash
npm install      # une seule fois, installe les dépendances
npm run dev      # lance le site sur http://localhost:4321
```

Ouvre http://localhost:4321 dans ton navigateur. Toute modif est rechargée automatiquement.

## Construire la version finale (pour mise en ligne)
```bash
npm run build    # génère le site statique dans le dossier dist/
npm run preview  # prévisualise le résultat de build en local
```

## Mise en ligne sur Hostinger
1. `npm run build`
2. Envoie **le contenu du dossier `dist/`** dans `public_html` (Gestionnaire de fichiers hPanel ou FTP).
   (On automatisera cette étape plus tard.)

## Où modifier quoi
- **Couleurs et polices** → `src/styles/global.css` (bloc `@theme`). Les classes `bg-corail`, `text-volt`, `font-display`, etc. en découlent automatiquement.
- **Données chaussures** → `src/data/shoes.ts` (à terme : remplacé par ton Google Sheet → JSON).
- **Page d'accueil** → `src/pages/index.astro`
- **Comparateur (interactif, React)** → `src/pages/comparateur.astro` + `src/components/ComparateurFilter.tsx`
- **Carte chaussure réutilisable** → `src/components/ShoeCard.tsx`
- **En-tête / pied de page** → `src/components/Header.astro` / `Footer.astro`
- **Structure commune (polices, méta)** → `src/layouts/Base.astro`

## Notes
- Les polices Archivo + Inter sont chargées via Google Fonts dans `Base.astro`.
- Le comparateur utilise un « îlot » React (`client:load`) : seul ce composant embarque du JavaScript, le reste du site est du HTML statique ultra rapide.
