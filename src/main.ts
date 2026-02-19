import { generateDailyPuzzle, getTodayString } from './game/puzzle'
import { createRenderer } from './renderer/canvas'
import { setupControls } from './ui/controls'
import { updateHUD } from './ui/hud'

function init(): void {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null
  const dateDisplay = document.getElementById('date-display')

  if (!canvas) {
    console.error('Canvas element not found')
    return
  }

  if (dateDisplay) {
    dateDisplay.textContent = getTodayString()
  }

  let grid = generateDailyPuzzle()
  let renderer = createRenderer(canvas, grid)

  function reset(): void {
    grid = generateDailyPuzzle()
    renderer = createRenderer(canvas!, grid)
    setupControls(renderer, grid, reset)
    renderer.render()
    updateHUD(grid)
  }

  setupControls(renderer, grid, reset)
  renderer.render()
  updateHUD(grid)
}

// Start the game when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
