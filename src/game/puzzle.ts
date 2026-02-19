import { createGrid, placeHorse, type Grid } from './grid'
import { createSeededRandom, dateSeed } from '../utils/seed'

export interface PuzzleConfig {
  gridSize: number
  maxWalls: number
  horseCount: number
}

/**
 * Generate a daily puzzle based on the current date.
 */
export function generateDailyPuzzle(date: Date = new Date()): Grid {
  const seed = dateSeed(date)
  const random = createSeededRandom(seed)

  // Determine puzzle parameters based on random seed
  const gridSize = 5 + Math.floor(random() * 3) // 5-7
  const horseCount = 3 + Math.floor(random() * (gridSize - 2)) // 3 to gridSize
  const maxWalls = horseCount * 2 + Math.floor(random() * 4) // Enough walls to enclose

  const grid = createGrid(gridSize, gridSize, maxWalls)

  // Place horses randomly
  const positions = new Set<string>()
  let placed = 0
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
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
