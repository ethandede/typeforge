import type { SpacingStep } from '../types'
import { generateClamp } from './fluid-scale'

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

const SPACING_NAMES = [
  { name: '--space-3xs', index: -3 },
  { name: '--space-2xs', index: -2 },
  { name: '--space-xs', index: -1 },
  { name: '--space-sm', index: 0 },
  { name: '--space-md', index: 1 },
  { name: '--space-lg', index: 2 },
  { name: '--space-xl', index: 3 },
  { name: '--space-2xl', index: 4 },
  { name: '--space-3xl', index: 5 },
]

/**
 * Generate a spacing scale derived from the same base and ratio as the type scale.
 * --space-md = baseSize. Steps up/down scale by ratio.
 * Optional fluid params generate clamp() values.
 */
export function computeSpacingScale(
  baseSize: number,
  ratio: number,
  minViewport?: number,
  maxViewport?: number,
  minBaseSize?: number,
  minRatio?: number,
): SpacingStep[] {
  return SPACING_NAMES.map(({ name, index }) => {
    const exponent = index - 1 // offset so index 1 (--space-md) = base^0 = baseSize
    const sizePx = roundTo(baseSize * Math.pow(ratio, exponent), 2)
    const sizeRem = roundTo(sizePx / 16, 3)

    let clamp: string | null = null
    if (minViewport && maxViewport && minBaseSize && minRatio) {
      const minSizePx = roundTo(minBaseSize * Math.pow(minRatio, exponent), 2)
      clamp = generateClamp(minSizePx, sizePx, minViewport, maxViewport)
    }

    return { name, sizePx, sizeRem, clamp }
  })
}
