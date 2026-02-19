# 🐴 MiniVibes — J01 : Enclose Horse

> Reproduction du jeu [enclose.horse](https://enclose.horse) — un puzzle game où le joueur place des murs sur une grille pour enclore la plus grande surface possible avec un nombre limité de segments.

## 📋 Spécification du projet

### 1. Découpage fonctionnel et technique

#### Front-end (Single Page Application)
| Module | Responsabilité |
|---|---|
| **UI / Layout** | Affichage de la grille, score, compteur de murs restants, boutons (reset, partage) |
| **Moteur de jeu** | Logique de placement des murs, calcul des zones enclosées, scoring |
| **Rendu Canvas** | Dessin de la grille, des murs, animation des chevaux 🐴, feedback visuel |
| **Stockage local** | Sauvegarde de la progression quotidienne (`localStorage`) |

#### Back-end (optionnel pour v1)
- Génération de puzzles quotidiens (seed basé sur la date)
- Pas de serveur nécessaire pour la v1 — tout est côté client

### 2. Stack technique

| Élément | Choix |
|---|---|
| **Langage** | TypeScript |
| **Framework** | Vanilla (pas de framework UI lourd) |
| **Outil de build** | [Vite](https://vitejs.dev/) |
| **Rendu** | HTML5 Canvas API |
| **Styles** | CSS natif (ou CSS Modules) |
| **Formatage** | Prettier |
| **Linting** | ESLint |
| **Tests** | Vitest |
| **Conteneurisation** | Docker + nginx (fichiers statiques) |
| **Gestionnaire de packages** | npm |

### 3. Contraintes et ressources

- ⏱️ Temps : projet d'une journée
- 🪙 Tokens : utilisation de modèles "mini" (0.33x), 1 requête premium max
- 🧩 Le jeu doit tourner dans un navigateur web moderne
- 📱 Responsive design (mobile-first)
- 🔒 Pas d'injection possible (pas de backend, donc pas de SQL/XSS côté serveur)

### 4. Règles de rendu et de fidélité

#### Objectif visuel
- Grille carrée avec intersections cliquables pour placer des murs
- Chevaux (🐴) placés sur certaines cases
- Murs visibles comme segments entre deux points de la grille
- Score affiché en temps réel

#### Critères de succès minimal
- [ ] La grille s'affiche correctement
- [ ] Le joueur peut placer et retirer des murs
- [ ] Le compteur de murs restants se met à jour
- [ ] Les zones enclosées sont détectées et colorées
- [ ] Le score (nombre de chevaux enclos × surface) est calculé
- [ ] Le puzzle change chaque jour (seed basé sur la date)

#### Vérifications automatisables
- Tests unitaires sur le moteur de jeu (calcul d'enclos, scoring)
- Tests sur la génération de grille
- Lint + format vérifiés en CI

### 5. Organisation du projet

```
openclaw/
├── .gitignore
├── README.md                # Ce fichier
├── COPILOT.md               # Contexte pour l'agent IA
├── MiniVibes.pdf            # Sujet original
├── Dockerfile               # Conteneurisation
├── docker-compose.yml       # Orchestration Docker
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html               # Point d'entrée HTML
├── public/
│   └── favicon.ico
├── src/
│   ├── main.ts              # Point d'entrée de l'application
│   ├── game/
│   │   ├── grid.ts          # Modèle de la grille
│   │   ├── engine.ts        # Moteur de jeu (logique)
│   │   ├── scoring.ts       # Calcul du score
│   │   └── puzzle.ts        # Génération de puzzle quotidien
│   ├── renderer/
│   │   ├── canvas.ts        # Rendu Canvas
│   │   └── animations.ts    # Animations
│   ├── ui/
│   │   ├── controls.ts      # Boutons, interactions
│   │   └── hud.ts           # Affichage tête haute (score, murs)
│   ├── utils/
│   │   └── seed.ts          # Générateur de seed par date
│   └── styles/
│       └── main.css         # Styles globaux
└── tests/
    ├── grid.test.ts
    ├── engine.test.ts
    └── scoring.test.ts
```

### 6. Stratégie de développement

| Étape | Description | Priorité |
|---|---|---|
| 1 | Setup projet (Vite + TS + config) | 🔴 Critique |
| 2 | Modèle de grille + logique de placement | 🔴 Critique |
| 3 | Rendu Canvas de la grille et des murs | 🔴 Critique |
| 4 | Détection des enclos (flood fill) | 🔴 Critique |
| 5 | Scoring + UI (compteur, score) | 🟡 Important |
| 6 | Génération de puzzle quotidien | 🟡 Important |
| 7 | Animations + polish graphique | 🟢 Bonus |
| 8 | Responsive + mobile | 🟢 Bonus |
| 9 | Docker + tests | 🟢 Bonus |
| 10 | Améliorations (partage, leaderboard) | ⚪ Extra |

---

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build

# Lancer les tests
npm run test

# Lancer avec Docker
docker-compose up
```

## 📖 À propos du jeu original

**enclose.horse** est un jeu de puzzle quotidien où :
1. Une grille est présentée avec des chevaux 🐴 placés sur certaines cases
2. Le joueur dispose d'un nombre limité de murs à placer
3. Les murs sont placés sur les bords entre les cases de la grille
4. L'objectif est d'enclore le maximum de chevaux dans la plus petite surface possible
5. Le score est calculé en fonction des chevaux enclos et de la surface

## 📝 Licence

Projet éducatif — MiniVibes Challenge
