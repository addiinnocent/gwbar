/**
 * Adapted from gw1tools/gw1builds (MIT) — lib/gw/skill-scaling.ts
 *
 * GW1 skill descriptions contain ranges like "82...172 Health" where:
 * - 82 = value at attribute rank 0
 * - 172 = value at attribute rank 15
 *
 * Values interpolate linearly between the anchors and extrapolate
 * beyond rank 15 up to the in-game cap of ~20.
 */

/**
 * Calculate scaled value using GW1 linear interpolation
 */
export function calculateScaledValue(
  min: number,
  max: number,
  attributeLevel: number
): number {
  const level = Math.max(0, Math.min(20, attributeLevel))
  return Math.round(min + ((max - min) * level) / 15)
}

/**
 * Format a skill description as a plain string with calculated values
 */
export function formatSkillDescription(
  description: string,
  attributeLevel: number
): string {
  const rangePattern = /(\d+)\.\.\.(\d+)/g
  return description.replace(rangePattern, (_, min, max) => {
    return String(calculateScaledValue(parseInt(min, 10), parseInt(max, 10), attributeLevel))
  })
}
