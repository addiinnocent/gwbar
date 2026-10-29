/**
 * Adapted from gw1tools/gw1builds (MIT) — lib/gw/attributes.ts
 * @see https://wiki.guildwars.com/wiki/Attribute_point
 */

/** Maximum base rank for an attribute (before runes/headgear) */
export const MAX_BASE_ATTRIBUTE_RANK = 12

/** Total attribute points available at level 20 */
export const MAX_ATTRIBUTE_POINTS = 200

/**
 * Total attribute points required to reach each rank
 */
const TOTAL_COST_BY_RANK: readonly number[] = [
  0,   // Rank 0
  1,   // Rank 1
  3,   // Rank 2
  6,   // Rank 3
  10,  // Rank 4
  15,  // Rank 5
  21,  // Rank 6
  28,  // Rank 7
  37,  // Rank 8
  48,  // Rank 9
  61,  // Rank 10
  77,  // Rank 11
  97,  // Rank 12
]

/**
 * Cost to increase from rank N-1 to rank N
 */
const INCREMENTAL_COST_BY_RANK: readonly number[] = [
  0,   // N/A (rank 0)
  1,   // 0→1
  2,   // 1→2
  3,   // 2→3
  4,   // 3→4
  5,   // 4→5
  6,   // 5→6
  7,   // 6→7
  9,   // 7→8
  11,  // 8→9
  13,  // 9→10
  16,  // 10→11
  20,  // 11→12
]

/**
 * Get the TOTAL points required to reach a given rank
 * @example getTotalPointCost(12) // 97
 */
export function getTotalPointCost(rank: number): number {
  if (rank <= 0) return 0
  if (rank >= 12) return TOTAL_COST_BY_RANK[12]
  return TOTAL_COST_BY_RANK[rank]
}

/**
 * Get the INCREMENTAL cost to go from current rank to the next rank
 * @example getIncrementalCost(7) // 9 (cost to go from 7→8)
 */
export function getIncrementalCost(currentRank: number): number {
  const nextRank = currentRank + 1
  if (nextRank > 12) return 0
  return INCREMENTAL_COST_BY_RANK[nextRank]
}

/**
 * Calculate total points spent from an attributes record
 */
export function calculateTotalPointsSpent(
  attributes: Record<string | number, number>
): number {
  return Object.values(attributes).reduce(
    (sum, rank) => sum + getTotalPointCost(rank),
    0
  )
}

/**
 * Calculate remaining attribute points
 */
export function calculateRemainingPoints(
  attributes: Record<string | number, number>
): number {
  return MAX_ATTRIBUTE_POINTS - calculateTotalPointsSpent(attributes)
}
