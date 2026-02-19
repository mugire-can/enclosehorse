import { describe, it, expect } from 'vitest'
import { createGrid, placeHorse, toggleWall, hasWall, getWallCount, getRemainingWalls } from '../src/game/grid'

describe('Grid', () => {
  it('should create a grid with the correct dimensions', () => {
    const grid = createGrid(5, 5, 10)
    expect(grid.rows).toBe(5)
    expect(grid.cols).toBe(5)
    expect(grid.cells.length).toBe(5)
    expect(grid.cells[0]!.length).toBe(5)
    expect(grid.maxWalls).toBe(10)
  })

  it('should place a horse on a cell', () => {
    const grid = createGrid(5, 5, 10)
    placeHorse(grid, 2, 3)
    expect(grid.cells[2]![3]!.hasHorse).toBe(true)
    expect(grid.cells[0]![0]!.hasHorse).toBe(false)
  })

  it('should toggle a wall on and off', () => {
    const grid = createGrid(5, 5, 10)
    const wall = { row: 1, col: 1, orientation: 'h' as const }

    const placed = toggleWall(grid, wall)
    expect(placed).toBe(true)
    expect(hasWall(grid, wall)).toBe(true)
    expect(getWallCount(grid)).toBe(1)

    const removed = toggleWall(grid, wall)
    expect(removed).toBe(false)
    expect(hasWall(grid, wall)).toBe(false)
    expect(getWallCount(grid)).toBe(0)
  })

  it('should not exceed max walls', () => {
    const grid = createGrid(5, 5, 2)

    toggleWall(grid, { row: 0, col: 0, orientation: 'h' })
    toggleWall(grid, { row: 1, col: 0, orientation: 'h' })

    const result = toggleWall(grid, { row: 2, col: 0, orientation: 'h' })
    expect(result).toBe(null)
    expect(getWallCount(grid)).toBe(2)
  })

  it('should calculate remaining walls correctly', () => {
    const grid = createGrid(5, 5, 10)
    expect(getRemainingWalls(grid)).toBe(10)

    toggleWall(grid, { row: 0, col: 0, orientation: 'h' })
    expect(getRemainingWalls(grid)).toBe(9)
  })
})
