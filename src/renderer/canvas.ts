import type { Grid, WallPosition } from '../game/grid'
import { calculateScore } from '../game/scoring'

const CELL_SIZE = 70
const PADDING = 50
const DOT_RADIUS = 5.5
const WALL_WIDTH = 6
const HORSE_FONT_SIZE = 40
const EDGE_DETECTION_THRESHOLD = 0.25
const SHADOW_OFFSET = 2

const COLORS = {
  background: '#f5f7fa',
  gridLine: '#cbd5e1',
  dot: '#64748b',
  dotActive: '#3b82f6',
  wallInactive: '#94a3b8',
  wallActive: '#ef4444',
  wallPlaced: '#1e293b',
  wallHover: '#0f172a',
  enclosedFill: 'rgba(34, 197, 94, 0.12)',
  enclosedBorder: 'rgba(34, 197, 94, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  highlight: 'rgba(59, 130, 246, 0.2)',
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

    for (const region of enclosedRegions) {
      // Draw gradient fill for enclosed regions
      const regionPath = new Path2D()
      for (const cell of region) {
        const r = cell[0]!
        const c = cell[1]!
        const x = PADDING + c * CELL_SIZE
        const y = PADDING + r * CELL_SIZE
        
        if (r === region[0]![0]! && c === region[0]![1]!) {
          regionPath.moveTo(x, y)
        }
        regionPath.rect(x, y, CELL_SIZE, CELL_SIZE)
      }

      ctx.fillStyle = COLORS.enclosedFill
      ctx.fill(regionPath)

      // Draw animated borders around enclosed cells
      ctx.strokeStyle = COLORS.enclosedBorder
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke(regionPath)

      // Add glow effect
      ctx.shadowColor = 'rgba(34, 197, 94, 0.3)'
      ctx.shadowBlur = 6
      ctx.stroke(regionPath)
      ctx.shadowColor = 'transparent'
    }
  }

  function drawGridLines(): void {
    // Draw subtle background grid
    ctx.strokeStyle = COLORS.gridLine
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6

    for (let i = 0; i <= grid.rows; i++) {
      const y = PADDING + i * CELL_SIZE
      ctx.beginPath()
      ctx.moveTo(PADDING, y)
      ctx.lineTo(PADDING + grid.cols * CELL_SIZE, y)
      ctx.stroke()
    }

    for (let i = 0; i <= grid.cols; i++) {
      const x = PADDING + i * CELL_SIZE
      ctx.beginPath()
      ctx.moveTo(x, PADDING)
      ctx.lineTo(x, PADDING + grid.rows * CELL_SIZE)
      ctx.stroke()
    }

    ctx.globalAlpha = 1

    // Draw intersection points with enhanced styling
    for (let r = 0; r <= grid.rows; r++) {
      for (let c = 0; c <= grid.cols; c++) {
        const x = PADDING + c * CELL_SIZE
        const y = PADDING + r * CELL_SIZE

        // Outer glow
        ctx.fillStyle = COLORS.shadow
        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS + 2, 0, Math.PI * 2)
        ctx.fill()

        // Main dot
        ctx.fillStyle = COLORS.dot
        ctx.beginPath()
        ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.beginPath()
        ctx.arc(x - 1.5, y - 1.5, DOT_RADIUS * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  function drawWalls(): void {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const wallKey of grid.walls) {
      const [rowStr, colStr, orientation] = wallKey.split(',')
      const row = parseInt(rowStr!, 10)
      const col = parseInt(colStr!, 10)

      const x = PADDING + col * CELL_SIZE
      const y = PADDING + row * CELL_SIZE

      // Draw shadow for depth
      ctx.strokeStyle = COLORS.shadow
      ctx.lineWidth = WALL_WIDTH + 2
      ctx.globalAlpha = 0.3

      if (orientation === 'h') {
        ctx.beginPath()
        ctx.moveTo(x + SHADOW_OFFSET, y + SHADOW_OFFSET)
        ctx.lineTo(x + CELL_SIZE + SHADOW_OFFSET, y + SHADOW_OFFSET)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.moveTo(x + SHADOW_OFFSET, y + SHADOW_OFFSET)
        ctx.lineTo(x + SHADOW_OFFSET, y + CELL_SIZE + SHADOW_OFFSET)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      // Draw main wall with gradient
      const gradient = ctx.createLinearGradient(
        orientation === 'h' ? x : x,
        orientation === 'h' ? y : y,
        orientation === 'h' ? x + CELL_SIZE : x,
        orientation === 'h' ? y : y + CELL_SIZE
      )
      gradient.addColorStop(0, COLORS.wallPlaced)
      gradient.addColorStop(1, COLORS.wallActive)

      ctx.strokeStyle = gradient
      ctx.lineWidth = WALL_WIDTH

      if (orientation === 'h') {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + CELL_SIZE, y)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + CELL_SIZE)
        ctx.stroke()
      }

      // Add glow effect around walls
      ctx.shadowColor = 'rgba(239, 68, 68, 0.4)'
      ctx.shadowBlur = 8
      ctx.lineWidth = WALL_WIDTH
      if (orientation === 'h') {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + CELL_SIZE, y)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x, y + CELL_SIZE)
        ctx.stroke()
      }
      ctx.shadowColor = 'transparent'
    }
  }

  function drawHorses(): void {
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        if (grid.cells[r]![c]!.hasHorse) {
          const x = PADDING + c * CELL_SIZE + CELL_SIZE / 2
          const y = PADDING + r * CELL_SIZE + CELL_SIZE / 2

          // Draw horse background circle
          ctx.fillStyle = 'rgba(251, 191, 36, 0.2)'
          ctx.beginPath()
          ctx.arc(x, y, CELL_SIZE / 2 - 5, 0, Math.PI * 2)
          ctx.fill()

          // Draw circle border
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y, CELL_SIZE / 2 - 5, 0, Math.PI * 2)
          ctx.stroke()

          // Draw horse emoji with shadow
          ctx.font = `bold ${HORSE_FONT_SIZE}px Arial`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
          ctx.shadowBlur = 4
          ctx.shadowOffsetX = 1
          ctx.shadowOffsetY = 1
          ctx.fillText('🐴', x, y)
          ctx.shadowColor = 'transparent'
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

  let hoveredWall: WallPosition | null = null

  function drawHoveredWall(): void {
    if (!hoveredWall) return

    const x = PADDING + hoveredWall.col * CELL_SIZE
    const y = PADDING + hoveredWall.row * CELL_SIZE

    ctx.strokeStyle = COLORS.highlight
    ctx.lineWidth = WALL_WIDTH + 3
    ctx.lineCap = 'round'
    ctx.globalAlpha = 0.5

    if (hoveredWall.orientation === 'h') {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + CELL_SIZE, y)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + CELL_SIZE)
      ctx.stroke()
    }

    ctx.globalAlpha = 1
  }

  function render(): void {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, width, height)

    drawEnclosedRegions()
    drawGridLines()
    drawWalls()
    drawHoveredWall()
    drawHorses()
  }

  // Track mouse movement for hover effects
  canvas.addEventListener('mousemove', (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    hoveredWall = getWallFromClick(x, y)
    render()
  })

  canvas.addEventListener('mouseleave', () => {
    hoveredWall = null
    render()
  })

  return { render, getWallFromClick, canvas }
}
