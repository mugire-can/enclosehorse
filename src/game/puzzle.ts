import { createGrid, placeHorse, type Grid } from './grid'
import { createSeededRandom, dateSeed } from '../utils/seed'

export interface PuzzleConfig {
  gridSize: number
  maxWalls: number
  horseCount: number
}

/**
 * Generate a daily puzzle based on the current date.
 * Puzzles are strategically balanced to be challenging but solvable.
 */
export function generateDailyPuzzle(date: Date = new Date()): Grid {
  const seed = dateSeed(date)
  const random = createSeededRandom(seed)

  // Determine puzzle parameters based on random seed
  // Larger grids = more complex puzzles
  const gridSize = 5 + Math.floor(random() * 4) // 5-8 for better variety
  const horseCount = Math.floor(4 + random() * gridSize) // Better distribution
  const maxWalls = Math.ceil(horseCount * 2.5 + random() * 3) // More strategic walls

  const grid = createGrid(gridSize, gridSize, maxWalls)

  // Place horses strategically to avoid clustering
  const positions = new Set<string>()
  let placed = 0

  // First pass: place horses with spacing
  while (placed < horseCount && positions.size < gridSize * gridSize) {
    const r = Math.floor(random() * gridSize)
    const c = Math.floor(random() * gridSize)
    const key = `${r},${c}`

    // Check if position is too close to existing horses
    if (!positions.has(key)) {
      let tooClose = false
      for (const pos of positions) {
        const parts = pos.split(',')
        const pr = parseInt(parts[0]!, 10)
        const pc = parseInt(parts[1]!, 10)
        const distance = Math.abs(r - pr) + Math.abs(c - pc)
        if (distance < 2) {
          tooClose = true
          break
        }
      }

      if (!tooClose) {
        positions.add(key)
        placeHorse(grid, r, c)
        placed++
      }
    }
  }

  // If spacing didn't work, just place remaining randomly
  while (placed < horseCount) {
    const r = Math.floor(random() * gridSize)
    const c = Math.floor(random() * gridSize)
    const key = `${r},${c}`
    if (!positions.has(key)) {
      positions.add(key)
      placeHorse(grid, r, c)
      placed++
    }
  }

  return grid
}

/**
 * Get today's date as a formatted string.
 */
export function getTodayString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
