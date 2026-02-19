import type { Grid } from '../game/grid'
import { toggleWall } from '../game/grid'
import type { CanvasRenderer } from '../renderer/canvas'
import { updateHUD, showFeedback } from './hud'

/**
 * Set up event listeners for game controls.
 */
export function setupControls(
  renderer: CanvasRenderer,
  grid: Grid,
  onReset: () => void
): void {
  // Canvas click handler for placing walls
  renderer.canvas.addEventListener('click', (event: MouseEvent) => {
    const rect = renderer.canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const wall = renderer.getWallFromClick(x, y)
    if (wall) {
      const result = toggleWall(grid, wall)

      if (result === null) {
        showFeedback('❌ No walls remaining!')
      } else if (result === true) {
        showFeedback('✓ Wall placed')
      } else {
        showFeedback('✗ Wall removed')
      }

      renderer.render()
      updateHUD(grid)
    }
  })

  // Reset button
  const resetBtn = document.getElementById('btn-reset')
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showFeedback('🔄 New puzzle loaded')
      onReset()
    })
  }

  // Update initial HUD
  updateHUD(grid)
}
