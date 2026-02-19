import { describe, it, expect } from 'vitest'
import { createGrid, placeHorse } from '../src/game/grid'
import { calculateScore } from '../src/game/scoring'

describe('Scoring', () => {
  it('should return 0 score for grid with no enclosed regions', () => {
    const grid = createGrid(3, 3, 20)
    placeHorse(grid, 1, 1)

    const result = calculateScore(grid)
    expect(result.totalScore).toBe(0)
    expect(result.horsesEnclosed).toBe(0)
  })

  it('should score horses in enclosed regions', () => {
    const grid = createGrid(3, 3, 20)
    placeHorse(grid, 1, 1)

    // Enclose cell (1,1)
    grid.walls.add('1,1,h')
    grid.walls.add('2,1,h')
    grid.walls.add('1,1,v')
    grid.walls.add('1,2,v')

    const result = calculateScore(grid)
    expect(result.totalScore).toBe(1)
    expect(result.horsesEnclosed).toBe(1)
    expect(result.enclosedRegions.length).toBe(1)
  })

  it('should score 0 when enclosed region has no horses', () => {
    const grid = createGrid(3, 3, 20)
    // Horse at (0,0), but enclose (1,1) which has no horse
    placeHorse(grid, 0, 0)

    grid.walls.add('1,1,h')
    grid.walls.add('2,1,h')
    grid.walls.add('1,1,v')
    grid.walls.add('1,2,v')

    const result = calculateScore(grid)
    expect(result.totalScore).toBe(0)
    expect(result.horsesEnclosed).toBe(0)
  })
})
