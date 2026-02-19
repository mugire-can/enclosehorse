import type { Grid } from '../game/grid'
import { calculateScore } from '../game/scoring'

const CELL_SIZE = 60
const PADDING = 40
const DOT_RADIUS = 4
const WALL_WIDTH = 4
const HORSE_FONT_SIZE = 28

const COLORS = {
  background: '#faf8f0',
  grid: '#e0ddd0',
  dot: '#888',
  wall: '#333',
  wallHover: '#999',
  horse: '#000',
  enclosed: 'rgba(76, 175, 80, 0.15)',
  enclosedBorder: 'rgba(76, 175, 80, 0.4)',
}

export interface CanvasRenderer {
  render: () => void
  getWallFromClick: (x: number, y: number) => { row: number; col: number; orientation: 'h' | 'v' } | null
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

  function render(): void {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, width, height)

    drawEnclosedRegions()
    drawGridLines()
    drawWalls()
    drawHorses()
    drawDots()
  }

  function drawGridLines(): void {
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 1

    for (let r = 0; r <= grid.rows; r++) {
      ctx.beginPath()
      ctx.moveTo(PADDING, PADDING + r * CELL_SIZE)
      ctx.lineTo(PADDING + grid.cols * CELL_SIZE, PADDING + r * CELL_SIZE)
      ctx.stroke()
    }

    for (let c = 0; c <= grid.cols; c++) {
      ctx.beginPath()
      ctx.moveTo(PADDING + c * CELL_SIZE, PADDING)
      ctx.lineTo(PADDING + c * CELL_SIZE, PADDING + grid.rows * CELL_SIZE)
      ctx.stroke()
    }
  }

  function drawDots(): void {
    ctx.fillStyle = COLORS.dot
    for (let r = 0; r <= grid.rows; r++) {
      for (let c = 0; c <= grid.cols; c++) {
        ctx.beginPath()
        ctx.arc(PADDING + c * CELL_SIZE, PADDING + r * CELL_SIZE, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  function drawWalls(): void {
    ctx.strokeStyle = COLORS.wall
    ctx.lineWidth = WALL_WIDTH
    ctx.lineCap = 'round'

    for (const key of grid.walls) {
      const parts = key.split(',')
      const row = parseInt(parts[0]!, 10)
      const col = parseInt(parts[1]!, 10)
      const orientation = parts[2]

      ctx.beginPath()
      if (orientation === 'h') {
        // Horizontal wall at top of row
        const x1 = PADDING + col * CELL_SIZE
        const y = PADDING + row * CELL_SIZE
        const x2 = x1 + CELL_SIZE
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
      } else {
        // Vertical wall at left of col
        const x = PADDING + col * CELL_SIZE
        const y1 = PADDING + row * CELL_SIZE
        const y2 = y1 + CELL_SIZE
        ctx.moveTo(x, y1)
        ctx.lineTo(x, y2)
      }
      ctx.stroke()
    }
  }

  function drawHorses(): void {
    ctx.font = `${HORSE_FONT_SIZE}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        if (grid.cells[r]?.[c]?.hasHorse) {
          const x = PADDING + c * CELL_SIZE + CELL_SIZE / 2
          const y = PADDING + r * CELL_SIZE + CELL_SIZE / 2
          ctx.fillText('🐴', x, y)
        }
      }
    }
  }

  function drawEnclosedRegions(): void {
    const { enclosedRegions } = calculateScore(grid)

    for (const region of enclosedRegions) {
      ctx.fillStyle = COLORS.enclosed
      for (const [r, c] of region) {
        if (r !== undefined && c !== undefined) {
          const x = PADDING + c * CELL_SIZE
          const y = PADDING + r * CELL_SIZE
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        }
      }
    }
  }

  function getWallFromClick(
    x: number,
    y: number
  ): { row: number; col: number; orientation: 'h' | 'v' } | null {
    // Convert click position to grid coordinates
    const gx = x - PADDING
    const gy = y - PADDING

    if (gx < -15 || gy < -15) return null
    if (gx > grid.cols * CELL_SIZE + 15 || gy > grid.rows * CELL_SIZE + 15) return null

    // Find the nearest edge
    const cellX = gx / CELL_SIZE
    const cellY = gy / CELL_SIZE

    const nearestHRow = Math.round(cellY)
    const nearestHCol = Math.floor(cellX)
    const hDist = Math.abs(cellY - nearestHRow)

    const nearestVRow = Math.floor(cellY)
    const nearestVCol = Math.round(cellX)
    const vDist = Math.abs(cellX - nearestVCol)

    const threshold = 0.25

    if (hDist < vDist && hDist < threshold) {
      // Horizontal wall
      if (nearestHRow >= 0 && nearestHRow <= grid.rows && nearestHCol >= 0 && nearestHCol < grid.cols) {
        return { row: nearestHRow, col: nearestHCol, orientation: 'h' }
      }
    } else if (vDist < threshold) {
      // Vertical wall
      if (nearestVRow >= 0 && nearestVRow < grid.rows && nearestVCol >= 0 && nearestVCol <= grid.cols) {
        return { row: nearestVRow, col: nearestVCol, orientation: 'v' }
      }
    }

    return null
  }

  return { render, getWallFromClick, canvas }
}
