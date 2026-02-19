import type { Grid } from '../game/grid'
import { getRemainingWalls } from '../game/grid'
import { calculateScore } from '../game/scoring'

/**
 * Update the HUD display with current game state.
 */
export function updateHUD(grid: Grid): void {
  const scoreEl = document.getElementById('score')
  const wallsEl = document.getElementById('walls-remaining')

  const { totalScore } = calculateScore(grid)

  if (scoreEl) {
    scoreEl.textContent = String(totalScore)
  }
  if (wallsEl) {
    wallsEl.textContent = String(getRemainingWalls(grid))
  }
}
