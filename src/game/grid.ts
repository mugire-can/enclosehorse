export interface GridCell {
  row: number
  col: number
  hasHorse: boolean
}

export interface WallPosition {
  /** Row of the cell above/left of the wall */
  row: number
  /** Column of the cell above/left of the wall */
  col: number
  /** 'h' for horizontal (bottom edge), 'v' for vertical (right edge) */
  orientation: 'h' | 'v'
}

export function wallKey(wall: WallPosition): string {
  return `${wall.row},${wall.col},${wall.orientation}`
}

export interface Grid {
  rows: number
  cols: number
  cells: GridCell[][]
  walls: Set<string>
  maxWalls: number
}

/**
 * Create an empty grid of the given size.
 */
export function createGrid(rows: number, cols: number, maxWalls: number): Grid {
  const cells: GridCell[][] = []
  for (let r = 0; r < rows; r++) {
    const row: GridCell[] = []
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, hasHorse: false })
    }
    cells.push(row)
  }
  return { rows, cols, cells, walls: new Set<string>(), maxWalls }
}

/**
 * Place a horse on a specific cell.
 */
export function placeHorse(grid: Grid, row: number, col: number): void {
  const cell = grid.cells[row]?.[col]
  if (cell) {
    cell.hasHorse = true
  }
}

/**
 * Toggle a wall at the given position.
 * Returns true if the wall was placed, false if it was removed.
 * Returns null if the wall couldn't be placed (max walls reached).
 */
export function toggleWall(grid: Grid, wall: WallPosition): boolean | null {
  const key = wallKey(wall)

  if (grid.walls.has(key)) {
    grid.walls.delete(key)
    return false
  }

  if (grid.walls.size >= grid.maxWalls) {
    return null
  }

  // Validate wall position
  if (!isValidWallPosition(grid, wall)) {
    return null
  }

  grid.walls.add(key)
  return true
}

/**
 * Check if a wall position is valid (within grid bounds).
 */
export function isValidWallPosition(grid: Grid, wall: WallPosition): boolean {
  if (wall.orientation === 'h') {
    // Horizontal wall: bottom edge of cell (row, col)
    // Valid for row 0..rows-1 (bottom edge), but also row=0 means top of grid
    // We use row 0..rows for horizontal walls (between row-1 and row)
    return wall.row >= 0 && wall.row <= grid.rows && wall.col >= 0 && wall.col < grid.cols
  } else {
    // Vertical wall: right edge of cell (row, col)
    return wall.row >= 0 && wall.row < grid.rows && wall.col >= 0 && wall.col <= grid.cols
  }
}

/**
 * Check if a specific wall exists.
 */
export function hasWall(grid: Grid, wall: WallPosition): boolean {
  return grid.walls.has(wallKey(wall))
}

/**
 * Get the number of walls currently placed.
 */
export function getWallCount(grid: Grid): number {
  return grid.walls.size
}

/**
 * Get the number of walls remaining.
 */
export function getRemainingWalls(grid: Grid): number {
  return grid.maxWalls - grid.walls.size
}
