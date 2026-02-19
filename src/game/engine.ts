import type { Grid } from './grid'

/**
 * Find all enclosed regions in the grid using flood fill.
 * A region is enclosed if it is completely surrounded by walls and/or grid borders.
 * Returns an array of regions, each being an array of [row, col] tuples.
 */
export function findEnclosedRegions(grid: Grid): number[][][] {
  const visited: boolean[][] = Array.from({ length: grid.rows }, () =>
    Array(grid.cols).fill(false) as boolean[]
  )
  const regions: number[][][] = []

  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      if (!visited[r]![c]) {
        const region: number[][] = []
        const isEnclosed = floodFill(grid, r, c, visited, region)
        if (isEnclosed && region.length > 0) {
          regions.push(region)
        }
      }
    }
  }

  return regions
}

/**
 * Flood fill from a cell, collecting all connected cells.
 * Returns true if the region is fully enclosed (no open border edges).
 */
function floodFill(
  grid: Grid,
  row: number,
  col: number,
  visited: boolean[][],
  region: number[][]
): boolean {
  const stack: [number, number][] = [[row, col]]
  let enclosed = true

  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    if (r < 0 || r >= grid.rows || c < 0 || c >= grid.cols) {
      continue
    }
    if (visited[r]![c]) {
      continue
    }
    visited[r]![c] = true
    region.push([r, c])

    // Check all 4 directions
    // Up: check horizontal wall at (r, c)
    const hasTopWall = grid.walls.has(`${r},${c},h`)
    if (!hasTopWall) {
      if (r === 0) {
        enclosed = false // Open border
      } else {
        stack.push([r - 1, c])
      }
    }

    // Down: check horizontal wall at (r+1, c)
    const hasBottomWall = grid.walls.has(`${r + 1},${c},h`)
    if (!hasBottomWall) {
      if (r === grid.rows - 1) {
        enclosed = false // Open border
      } else {
        stack.push([r + 1, c])
      }
    }

    // Left: check vertical wall at (r, c)
    const hasLeftWall = grid.walls.has(`${r},${c},v`)
    if (!hasLeftWall) {
      if (c === 0) {
        enclosed = false // Open border
      } else {
        stack.push([r, c - 1])
      }
    }

    // Right: check vertical wall at (r, c+1)
    const hasRightWall = grid.walls.has(`${r},${c + 1},v`)
    if (!hasRightWall) {
      if (c === grid.cols - 1) {
        enclosed = false // Open border
      } else {
        stack.push([r, c + 1])
      }
    }
  }

  return enclosed
}

/**
 * Count the number of horses in a region.
 */
export function countHorsesInRegion(grid: Grid, region: number[][]): number {
  let count = 0
  for (const [r, c] of region) {
    if (r !== undefined && c !== undefined && grid.cells[r]?.[c]?.hasHorse) {
      count++
    }
  }
  return count
}
