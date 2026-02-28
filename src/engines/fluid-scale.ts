import type { FluidScaleConfig, ScaleStep } from '../types'

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

function computeLineHeight(sizePx: number): number {
  // Line height decreases as font size increases
  // Body text (~16px): 1.5–1.6
  // Headings (~32-48px): 1.1–1.2
  // Small text (~12px): 1.6–1.7
  if (sizePx <= 12) return 1.667
  if (sizePx <= 16) return 1.5 + (16 - sizePx) * 0.0417 // lerp 1.5→1.667
  if (sizePx <= 24) return 1.5 - (sizePx - 16) * 0.0188 // lerp 1.5→1.35
  if (sizePx <= 48) return 1.35 - (sizePx - 24) * 0.00625 // lerp 1.35→1.2
  return 1.1
}

function computeLetterSpacing(sizePx: number): string | null {
  // Subtle negative tracking for large headings
  if (sizePx >= 32) return '-0.02em'
  if (sizePx >= 24) return '-0.01em'
  return null
}

/**
 * Generate a CSS clamp() value for fluid typography.
 * Uses the Utopia formula: clamp(minRem, calc(intercept + slope * vw), maxRem)
 *
 * The slope and intercept are computed so the value equals minSize at minViewport
 * and maxSize at maxViewport, with linear interpolation between.
 */
export function generateClamp(
  minSize: number,
  maxSize: number,
  minViewport: number,
  maxViewport: number,
): string {
  const minRem = roundTo(minSize / 16, 4)
  const maxRem = roundTo(maxSize / 16, 4)

  // slope = (maxSize - minSize) / (maxViewport - minViewport)
  const slope = (maxSize - minSize) / (maxViewport - minViewport)
  const vw = roundTo(slope * 100, 4)

  // intercept = minSize - slope * minViewport (in px), then convert to rem
  const intercept = roundTo((minSize - slope * minViewport) / 16, 4)

  // Build the preferred value: intercept_rem + slope_vw
  const sign = intercept >= 0 ? '+' : '-'
  const absIntercept = roundTo(Math.abs(intercept), 4)

  const preferred = `${absIntercept}rem ${sign} ${vw}vw`

  return `clamp(${minRem}rem, calc(${preferred}), ${maxRem}rem)`
}

/**
 * Compute a full fluid type scale using Utopia-style dual-ratio interpolation.
 *
 * Each step applies minRatio^i to minBaseSize (for the small viewport) and
 * maxRatio^i to maxBaseSize (for the large viewport), then generates a
 * clamp() that smoothly transitions between the two.
 *
 * Always generates 2 steps below base and `config.steps` steps above base.
 */
export function computeFluidScale(config: FluidScaleConfig): ScaleStep[] {
  const {
    minViewport, maxViewport,
    minBaseSize, maxBaseSize,
    minRatio, maxRatio,
    steps: stepsAbove,
  } = config
  const stepsBelow = 2
  const result: ScaleStep[] = []

  for (let i = -stepsBelow; i <= stepsAbove; i++) {
    const minSize = roundTo(minBaseSize * Math.pow(minRatio, i), 2)
    const maxSize = roundTo(maxBaseSize * Math.pow(maxRatio, i), 2)

    const clamp = generateClamp(minSize, maxSize, minViewport, maxViewport)
    const lineHeight = roundTo(computeLineHeight(maxSize), 3)

    result.push({
      name: `step-${i}`,
      index: i,
      sizePx: maxSize,
      sizeRem: roundTo(maxSize / 16, 3),
      clamp,
      lineHeight,
      letterSpacing: computeLetterSpacing(maxSize),
    })
  }

  return result.sort((a, b) => a.index - b.index)
}
