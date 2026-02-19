import { describe, it, expect } from 'vitest'
import { generateDailyPuzzle, getTodayString } from '../src/game/puzzle'

describe('Puzzle Generation', () => {
  it('should generate a valid grid', () => {
    const puzzle = generateDailyPuzzle(new Date('2025-01-15'))

    expect(puzzle).toHaveProperty('rows')
    expect(puzzle).toHaveProperty('cols')
    expect(puzzle).toHaveProperty('cells')
    expect(puzzle).toHaveProperty('walls')
    expect(puzzle).toHaveProperty('maxWalls')
  })

  it('should generate same puzzle for same date', () => {
    const date = new Date('2025-01-15')
    const puzzle1 = generateDailyPuzzle(date)
    const puzzle2 = generateDailyPuzzle(date)

    expect(puzzle1.rows).toBe(puzzle2.rows)
    expect(puzzle1.cols).toBe(puzzle2.cols)
    expect(puzzle1.maxWalls).toBe(puzzle2.maxWalls)
    expect(puzzle1.cells.length).toBe(puzzle2.cells.length)
  })

  it('should generate different puzzles for different dates', () => {
    const puzzle1 = generateDailyPuzzle(new Date('2025-01-15'))
    const puzzle2 = generateDailyPuzzle(new Date('2025-01-16'))

    // At least one parameter should differ (rows, cols, maxWalls, or horse positions)
    const sameConfig =
      puzzle1.rows === puzzle2.rows &&
      puzzle1.cols === puzzle2.cols &&
      puzzle1.maxWalls === puzzle2.maxWalls

    if (sameConfig) {
      // Horses must be in different positions
      let horsesMatch = true
      for (let r = 0; r < puzzle1.rows; r++) {
        for (let c = 0; c < puzzle1.cols; c++) {
          if (puzzle1.cells[r]![c]!.hasHorse !== puzzle2.cells[r]![c]!.hasHorse) {
            horsesMatch = false
            break
          }
        }
      }
      expect(horsesMatch).toBe(false)
    }
  })

  it('should have grid size between 5 and 7', () => {
    for (let i = 0; i < 10; i++) {
      const puzzle = generateDailyPuzzle(new Date(`2025-01-${(i % 28) + 1}`))
      expect(puzzle.rows).toBeGreaterThanOrEqual(5)
      expect(puzzle.rows).toBeLessThanOrEqual(7)
      expect(puzzle.cols).toBeGreaterThanOrEqual(5)
      expect(puzzle.cols).toBeLessThanOrEqual(7)
    }
  })

  it('should place horses on the grid', () => {
    const puzzle = generateDailyPuzzle(new Date('2025-01-15'))

    let horseCount = 0
    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < puzzle.cols; c++) {
        if (puzzle.cells[r]![c]!.hasHorse) {
          horseCount++
        }
      }
    }

    expect(horseCount).toBeGreaterThan(0)
    expect(horseCount).toBeLessThanOrEqual(puzzle.rows)
  })

  it('should have max walls greater than horse count', () => {
    const puzzle = generateDailyPuzzle(new Date('2025-01-15'))

    let horseCount = 0
    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < puzzle.cols; c++) {
        if (puzzle.cells[r]![c]!.hasHorse) {
          horseCount++
        }
      }
    }

    expect(puzzle.maxWalls).toBeGreaterThan(horseCount)
  })

  it('should format today\'s date correctly', () => {
    const dateStr = getTodayString()

    expect(typeof dateStr).toBe('string')
    expect(dateStr.length).toBeGreaterThan(0)
    // Should contain day name, month name, date, year
    expect(/[A-Za-z]+/.test(dateStr)).toBe(true)
  })
})
