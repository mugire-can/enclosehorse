import type { Grid, WallPosition } from '../game/grid'
import { calculateScore } from '../game/scoring'

const CELL_SIZE = 60
const PADDING = 40
const DOT_RADIUS = 4
const WALL_WIDTH = 4
const HORSE_FONT_SIZE = 28
const EDGE_DETECTION_THRESHOLD = 0.25

const COLORS = {
  background: '#faf8f0',
  grid: '#e0ddd0',
  dot: '#888',
  wall: '#333',
  horse: '#000',
  enclosed: 'rgba(76, 175, 80, 0.15)',
  enclosedBorder: 'rgba(76, 175, 80, 0.4)',
}

export interface CanvasRenderer {
  render: () => void
  getWallFromClick: (x: number, y: number) => WallPosition | null
  canvas: HTMLCanvasElement
}

/**
 * Create a canvas renderer for the grid.
 */
export function createRenderer(canvas: HTMLCanvasElement, grid: Grid): CanvasRenderer {
  const ctx = canvas.getContext('2d')!
  const width = PADDING * 2 + grid.cols * CELL_SIZE
  const height = PADDING * 2 + grid.rows * CELL_SIZE

  // Handle high-DPI displays
  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  function drawEnclosedRegions(): void {
    const { enclosedRegions } = calculateScore(grid)

    // Draw filled regions
    ctx.fillStyle = COLORS.enclosed
    for (const region of enclosedRegions) {
      for (const cell of region) {
        const r = cell[0]!
        const c = cell[1]!
        const x = PADDING + c * CELL_SIZE
        const y = PADDING + r * CELL_SIZE
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
      }
    }

    // Draw region borders
    ctx.strokeStyle = COLORS.enclosedBorder
    ctx.lineWidth = 2
    for (const region of enclosedRegions) {
      for (const cell of region) {
        const r = cell[0]!
        const c = cell[1]!
        const x = PADDING + c * CELL_SIZE
        const y = PADDING + r * CELL_SIZE
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
      }
    }
  }

  function drawGridLines(): void {
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 1

    // Horizontal lines
    for (let i = 0; i <= grid.rows; i++) {
      const y = PADDING + i * CELL_SIZE
      ctx.beginPath()
      ctx.moveTo(PADDING, y)
      ctx.lineTo(PADDING + grid.cols * CELL_SIZE, y)
      ctx.stroke()
    }

    // Vertical lines
    for (let i = 0; i <= grid.cols; i++) {
      const x = PADDING + i * CELL_SIZE
      ctx.beginPath()
      ctx.moveTo(x, PADDING)
      ctx.lineTo(x, PADDING + grid.rows * CELL_SIZE)
      ctx.stroke()
    }

    // Grid intersection points
    ctx.fillStyle = COLORS.dot
    for (let r = 0; r <= grid.rows; r++) {
      for (let c = 0; c <= grid.cols; c++) {
        const x = PADDING + c * CELL_SIZE
        const y = PADDING + r * CELL_SIZE
        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  function drawWalls(): void {
    ctx.strokeStyle = COLORS.wall
    ctx.lineWidth = WALL_WIDTH
    ctx.lineCap = 'round'

    for (const wallKey of grid.walls) {
      const [rowStr, colStr, orientation] = wallKey.split(',')
      const row = parseInt(rowStr!, 10)
      const col = parseInt(colStr!, 10)

      const x = PADDING + col * CELL_SIZE
      const y = PADDING + row * CELL_SIZE

      ctx.beginPath()
      if (orientation === 'h') {
        ctx.moveTo(x, y)
        ctx.lineTo(x + CELL_SIZE, y)
      } else {
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + CELL_SIZE)
      }
      ctx.stroke()
    }
  }

  function drawHorses(): void {
    ctx.font = `${HORSE_FONT_SIZE}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        if (grid.cells[r]![c]!.hasHorse) {
          const x = PADDING + c * CELL_SIZE + CELL_SIZE / 2
          const y = PADDING + r * CELL_SIZE + CELL_SIZE / 2
          ctx.fillText('🐴', x, y)
        }
      }
    }
  }

  function getWallFromClick(x: number, y: number): WallPosition | null {
    const gridX = x - PADDING
    const gridY = y - PADDING

    // Outside grid bounds
    if (gridX < -15 || gridY < -15) return null
    if (gridX > grid.cols * CELL_SIZE + 15 || gridY > grid.rows * CELL_SIZE + 15) return null

    // Find nearest edge (horizontal or vertical)
    const cellX = gridX / CELL_SIZE
    const cellY = gridY / CELL_SIZE

    const nearestHRow = Math.round(cellY)
    const nearestHCol = Math.floor(cellX)
    const hDist = Math.abs(cellY - nearestHRow)

    const nearestVRow = Math.floor(cellY)
    const nearestVCol = Math.round(cellX)
    const vDist = Math.abs(cellX - nearestVCol)

    if (hDist < vDist && hDist < EDGE_DETECTION_THRESHOLD) {
      // Horizontal wall
      if (nearestHRow >= 0 && nearestHRow <= grid.rows && nearestHCol >= 0 && nearestHCol < grid.cols) {
        return { row: nearestHRow, col: nearestHCol, orientation: 'h' }
      }
    } else if (vDist < EDGE_DETECTION_THRESHOLD) {
      // Vertical wall
      if (nearestVRow >= 0 && nearestVRow < grid.rows && nearestVCol >= 0 && nearestVCol <= grid.cols) {
        return { row: nearestVRow, col: nearestVCol, orientation: 'v' }
      }
    }

    return null
  }

  function render(): void {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, width, height)

    drawEnclosedRegions()
    drawGridLines()
    drawWalls()
    drawHorses()
  }

  return { render, getWallFromClick, canvas }
}
