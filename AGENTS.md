# AGENTS.md

## Purpose
This repository is a TypeScript + Vite implementation of a daily puzzle game (`enclose.horse` style).  
The goal for agents is to keep the project stable, simple, testable, and continuously improved with modern but lightweight technology choices.

## Current Project Analysis
- **Stack**: TypeScript (strict), Vite, Vitest, HTML5 Canvas.
- **Architecture**:
  - `/home/runner/work/enclosehorse/enclosehorse/src/game`: pure game logic (`grid`, `engine`, `scoring`, `puzzle`)
  - `/home/runner/work/enclosehorse/enclosehorse/src/renderer`: canvas rendering and interaction mapping
  - `/home/runner/work/enclosehorse/enclosehorse/src/ui`: controls and HUD updates
  - `/home/runner/work/enclosehorse/enclosehorse/src/utils`: deterministic seed utilities
  - `/home/runner/work/enclosehorse/enclosehorse/tests`: unit tests by domain
- **Quality Baseline**:
  - Strict compiler options enabled in `tsconfig.json`
  - Tests executed with `vitest run`
  - Build pipeline: `tsc && vite build`

## Non-Negotiable Working Rules
1. Keep **game logic pure** and separated from rendering/UI.
2. Preserve **deterministic daily puzzle behavior** (same date => same puzzle).
3. Any gameplay change must include or update tests in `/home/runner/work/enclosehorse/enclosehorse/tests`.
4. Favor small modules with single responsibility.
5. Prefer native platform features over heavy dependencies.

## Standard Agent Workflow
1. Read affected files and related tests first.
2. Make minimal, scoped changes.
3. Run:
   - `npm run test`
   - `npm run build`
4. If behavior changes, update README sections that describe gameplay/architecture.
5. Keep public behavior backward-compatible unless task explicitly requires a change.

## Technology Improvement Backlog (Continuous Uplift)
Prioritize in this order:

1. **Quality Automation**
   - Add ESLint with TypeScript rules and zero-warning policy.
   - Add Prettier and format check in CI.
   - Add GitHub Actions workflow for test + build on PRs.

2. **Testing Depth**
   - Add renderer interaction tests for click-to-wall mapping edge cases.
   - Add property-style tests for puzzle generation invariants.
   - Add regression tests for enclosed-region detection.

3. **Architecture Hardening**
   - Introduce domain contracts/types for game state transitions.
   - Move magic constants (renderer and puzzle tuning) into typed config modules.
   - Add explicit error/result patterns for operations that can fail.

4. **Performance & UX**
   - Add frame-time instrumentation in dev mode.
   - Reduce redundant canvas redraws (event-driven partial redraw strategy).
   - Add optional persistence for daily progress and history.

5. **Product Evolution**
   - Difficulty modes with controlled wall/horse distributions.
   - Accessibility upgrades (keyboard interactions, ARIA live status, color-safe themes).
   - Optional analytics hooks (privacy-safe, off by default).

## Decision Heuristics
- Choose solutions that improve **maintainability first**, then performance.
- Avoid introducing dependencies unless they remove significant complexity.
- When trade-offs exist, document them in PR description with impact on gameplay, tests, and bundle size.

## Definition of Done for Future Changes
- Tests pass.
- Build passes.
- No new TypeScript strict errors.
- No untested gameplay behavior changes.
- Docs updated when architecture or rules change.
