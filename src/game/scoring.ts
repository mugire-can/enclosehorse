import type { Grid } from './grid'
import { findEnclosedRegions, countHorsesInRegion } from './engine'

export interface ScoreResult {
  totalScore: number
  enclosedRegions: number[][][]
  horsesEnclosed: number
}

/**
 * Calculate the score for the current grid state.
 * Score = total number of horses enclosed in all regions.
 */
export function calculateScore(grid: Grid): ScoreResult {
  const enclosedRegions = findEnclosedRegions(grid)
  let totalScore = 0
  let horsesEnclosed = 0

  for (const region of enclosedRegions) {
    const horses = countHorsesInRegion(grid, region)
    horsesEnclosed += horses
    totalScore += horses
  }

  return { totalScore, enclosedRegions, horsesEnclosed }
}
