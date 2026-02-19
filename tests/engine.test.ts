import { describe, it, expect } from 'vitest'
import { createGrid, placeHorse } from '../src/game/grid'
import { findEnclosedRegions, countHorsesInRegion } from '../src/game/engine'

describe('Engine - Enclosed Regions', () => {
  it('should find no enclosed regions in an empty grid', () => {
    const grid = createGrid(3, 3, 20)
    const regions = findEnclosedRegions(grid)
    expect(regions.length).toBe(0)
  })

  it('should find an enclosed region when fully walled', () => {
    // Create a 3x3 grid and enclose cell (1,1) with walls on all 4 sides
    const grid = createGrid(3, 3, 20)

    // Top wall of cell (1,1)
    grid.walls.add('1,1,h')
    // Bottom wall of cell (1,1)
    grid.walls.add('2,1,h')
    // Left wall of cell (1,1)
    grid.walls.add('1,1,v')
    // Right wall of cell (1,1)
    grid.walls.add('1,2,v')

    const regions = findEnclosedRegions(grid)
    expect(regions.length).toBe(1)
    expect(regions[0]!.length).toBe(1)
    expect(regions[0]![0]).toEqual([1, 1])
  })

  it('should count horses in a region', () => {
    const grid = createGrid(3, 3, 20)
    placeHorse(grid, 1, 1)

    const region = [[1, 1], [1, 2]]
    const count = countHorsesInRegion(grid, region)
    expect(count).toBe(1)
  })

  it('should not count horses outside the region', () => {
    const grid = createGrid(3, 3, 20)
    placeHorse(grid, 0, 0)

    const region = [[1, 1]]
    const count = countHorsesInRegion(grid, region)
    expect(count).toBe(0)
  })
})
