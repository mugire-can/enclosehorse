# AI Agent Context

## Project

Enclose Horse — a puzzle game where the player places walls on a grid to enclose horses and maximize their score. Play a different puzzle each day.

## Technology Stack

- **Language**: TypeScript (strict mode)
- **Build**: Vite
- **Rendering**: HTML5 Canvas
- **Testing**: Vitest
- **Containerization**: Docker + nginx

## Code Conventions

- TypeScript strict mode (`strict: true`)
- Kebab-case file names
- PascalCase for types/interfaces
- camelCase for functions/variables
- One file = one responsibility
- No `any` without justification
- Comment only complex logic

## Architecture

```
src/
├── game/       # Game logic (grid, engine, scoring, puzzle)
├── renderer/   # Canvas rendering
├── ui/         # User interface (controls, HUD)
├── utils/      # Utilities (seed, helpers)
└── styles/     # CSS
```

## Game Rules

1. NxN grid displays with horses on certain cells
2. Player has limited wall segments to place
3. Walls placed on edges between adjacent cells
4. Click edge to place/remove wall
5. Fully enclosed zones are detected automatically
6. Score = number of horses in enclosed zones
7. Daily puzzle changes (deterministic seed)

## Available Commands

```bash
npm run dev       # Development server
npm run build     # Production build
npm run test      # Run tests
```

## Key Files

- `src/main.ts` - Application entry point
- `src/game/grid.ts` - Grid data structure and wall management
- `src/game/engine.ts` - Enclosed region detection (flood fill)
- `src/game/scoring.ts` - Score calculation
- `src/renderer/canvas.ts` - Canvas rendering and interaction
- `src/ui/controls.ts` - User input handling
- `src/ui/hud.ts` - Score/walls display update

## Constraints

- No heavy dependencies
- Responsive design
- Deterministic daily puzzles
- No backend required (v1)

