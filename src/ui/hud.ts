import type { Grid } from '../game/grid'
import { getRemainingWalls } from '../game/grid'
import { calculateScore } from '../game/scoring'

/**
 * Update the HUD display with current game state.
 */
export function updateHUD(grid: Grid): void {
  const scoreEl = document.getElementById('score')
  const wallsEl = document.getElementById('walls-remaining')
  const scoreDetailEl = document.getElementById('score-detail')
  const horsesEl = document.getElementById('horses-count')
  const horsesDetailEl = document.getElementById('horses-detail')
  const wallsBarEl = document.getElementById('walls-fill')

  const { totalScore, horsesEnclosed } = calculateScore(grid)
  const remaining = getRemainingWalls(grid)
  const total = grid.maxWalls
  const fillPercent = ((total - remaining) / total) * 100

  if (scoreEl) {
    scoreEl.textContent = String(totalScore)
  }

  if (scoreDetailEl) {
    scoreDetailEl.textContent = totalScore > 0 ? '✨ Great!' : ''
  }

  if (wallsEl) {
    wallsEl.textContent = String(remaining)
  }

  if (wallsBarEl) {
    wallsBarEl.style.width = `${fillPercent}%`
  }

  if (horsesEl) {
    horsesEl.textContent = String(horsesEnclosed)
  }

  if (horsesDetailEl) {
    if (horsesEnclosed === 0) {
      horsesDetailEl.textContent = 'No horses yet'
    } else if (horsesEnclosed === 1) {
      horsesDetailEl.textContent = '1 horse'
    } else {
      horsesDetailEl.textContent = `${horsesEnclosed} horses`
    }
  }
}

export function showFeedback(message: string): void {
  const feedbackEl = document.getElementById('feedback')
  if (feedbackEl) {
    feedbackEl.textContent = message
    feedbackEl.classList.add('show')
    setTimeout(() => {
      feedbackEl.classList.remove('show')
    }, 2000)
  }
}
