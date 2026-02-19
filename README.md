# 🐴 Enclose Horse

> A puzzle game where the player places walls on a grid to enclose the largest possible area with a limited number of wall segments. Inspired by [enclose.horse](https://enclose.horse).

## 📋 Project Specification

### 1. Functional and Technical Breakdown

#### Frontend (Single Page Application)
| Module | Responsibility |
|---|---|
| **UI / Layout** | Grid display, score, remaining walls counter, buttons (reset) |
| **Game Engine** | Wall placement logic, enclosed zone detection, scoring |
| **Canvas Rendering** | Grid drawing, walls, horse animation 🐴, visual feedback |
| **Local Storage** | Save daily progress to localStorage |

#### Backend (Optional for v1)
- Daily puzzle generation (date-based seed)
- No server needed for v1 — everything client-side

### 2. Technology Stack

| Element | Choice |
|---|---|
| **Language** | TypeScript |
| **Framework** | Vanilla (no heavy UI framework) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Rendering** | HTML5 Canvas API |
| **Styles** | Pure CSS |
| **Testing** | Vitest |
| **Containerization** | Docker + nginx (static files) |
| **Package Manager** | npm |

### 3. Constraints and Resources

- ⏱️ Time: one-day project
- 🧩 Must run in modern web browsers
- 📱 Responsive design (mobile-first)
- 🔒 No injection risks (client-only, no backend)

### 4. Render Rules and Fidelity

#### Visual Objective
- Square grid with clickable intersections for wall placement
- Horses (🐴) placed on certain cells
- Walls visible as segments between grid points
- Real-time score display

#### Success Criteria
- [x] Grid displays correctly
- [x] Player can place and remove walls
- [x] Wall counter updates
- [x] Enclosed zones detected and highlighted
- [x] Score calculation (enclosed horses)
- [x] Daily puzzle changes (date-based seed)

### 5. Project Organization

```
openclaw/
├── .gitignore
├── README.md                # This file
├── COPILOT.md               # AI agent context
├── Dockerfile               # Containerization
├── docker-compose.yml       # Docker orchestration
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html               # HTML entry point
├── src/
│   ├── main.ts              # Application entry
│   ├── game/
│   │   ├── grid.ts          # Grid model
│   │   ├── engine.ts        # Game logic (enclosed regions)
│   │   ├── scoring.ts       # Score calculation
│   │   └── puzzle.ts        # Daily puzzle generation
│   ├── renderer/
│   │   └── canvas.ts        # Canvas rendering
│   ├── ui/
│   │   ├── controls.ts      # Button interactions
│   │   └── hud.ts           # Score/walls display
│   ├── utils/
│   │   └── seed.ts          # Date-based seeding
│   └── styles/
│       └── main.css         # Global styles
└── tests/
    ├── grid.test.ts
    ├── engine.test.ts
    ├── scoring.test.ts
    └── seed.test.ts
```

### 6. Development Strategy

| Phase | Description | Priority |
|---|---|---|
| 1 | Project setup (Vite + TS + config) | 🔴 Critical |
| 2 | Grid model + wall placement logic | 🔴 Critical |
| 3 | Canvas rendering | 🔴 Critical |
| 4 | Enclosed zone detection (flood fill) | 🔴 Critical |
| 5 | Scoring + UI | 🟡 Important |
| 6 | Daily puzzle generation | 🟡 Important |
| 7 | Polish & animations | 🟢 Bonus |
| 8 | Responsive + mobile | 🟢 Bonus |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Docker
docker-compose up
```

## 📖 About the Original Game

**enclose.horse** is a daily puzzle game where:
1. A grid is presented with horses 🐴 on certain cells
2. Player has limited wall segments to place
3. Walls go on edges between grid cells
4. Goal: enclose maximum horses in minimum area
5. Score = number of horses enclosed

## 📝 License

Educational project

