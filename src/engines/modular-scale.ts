import type { ModularScaleConfig, ScaleStep } from '../types'

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

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function computeModularScale(config: ModularScaleConfig): ScaleStep[] {
  const { baseSize, ratio, stepsAbove, stepsBelow } = config
  const steps: ScaleStep[] = []

  for (let i = -stepsBelow; i <= stepsAbove; i++) {
    const sizePx = roundTo(baseSize * Math.pow(ratio, i), 2)
    const sizeRem = roundTo(sizePx / 16, 3)
    const lineHeight = roundTo(computeLineHeight(sizePx), 3)

    steps.push({
      name: `step-${i}`,
      index: i,
      sizePx,
      sizeRem,
      clamp: null,
      lineHeight,
      letterSpacing: computeLetterSpacing(sizePx),
    })
  }

  return steps.sort((a, b) => a.index - b.index)
}
