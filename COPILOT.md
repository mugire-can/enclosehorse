# COPILOT.md — Contexte Agent IA

## Projet

Reproduction du jeu **enclose.horse** — un puzzle game web où le joueur place des murs sur une grille pour enclore des chevaux. Projet MiniVibes J01.

## Stack technique

- **Langage** : TypeScript (strict mode)
- **Build** : Vite
- **Rendu** : HTML5 Canvas
- **Tests** : Vitest
- **Formatage** : Prettier (single quotes, no semicolons, 2 spaces)
- **Linting** : ESLint
- **Conteneurisation** : Docker + nginx

## Conventions de code

- Utiliser TypeScript strict (`strict: true` dans tsconfig)
- Nommer les fichiers en kebab-case
- Nommer les types/interfaces en PascalCase
- Nommer les fonctions/variables en camelCase
- Un fichier = une responsabilité
- Pas de `any` sauf cas exceptionnel documenté
- Commenter uniquement la logique complexe (pas les évidences)

## Architecture

```
src/
├── game/       # Logique métier (grille, moteur, scoring, puzzle)
├── renderer/   # Rendu visuel (Canvas, animations)
├── ui/         # Interface utilisateur (contrôles, HUD)
├── utils/      # Utilitaires (seed, helpers)
└── styles/     # CSS
```

## Règles du jeu enclose.horse

1. Une grille NxN est affichée avec des chevaux sur certaines cases
2. Le joueur a un nombre limité de murs (segments) à placer
3. Les murs se placent sur les bords entre deux cases adjacentes
4. Un clic sur un bord place/retire un mur
5. Les zones complètement enclosées par des murs sont détectées
6. Le score = nombre de chevaux dans les zones enclosées
7. Le puzzle change chaque jour (seed déterministe basé sur la date)

## Commandes

```bash
npm run dev      # Serveur de développement
npm run build    # Build production
npm run test     # Tests unitaires
npm run lint     # Vérification du code
npm run format   # Formatage du code
```

## Contraintes

- Tout le code doit être généré par l'agent IA
- Versionner intelligemment avec Git
- Pas d'injection possible (validation des inputs)
- Code formaté de façon homogène
- Responsive design
