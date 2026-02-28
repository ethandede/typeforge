import type { TailwindScaleConfig, ScaleStep } from '../types'
import { generateClamp } from './fluid-scale'

interface TailwindDefault {
  name: string
  sizePx: number
  lineHeight: number
}

export const TAILWIND_DEFAULTS: TailwindDefault[] = [
  { name: 'text-xs', sizePx: 12, lineHeight: 1.333 },
  { name: 'text-sm', sizePx: 14, lineHeight: 1.429 },
  { name: 'text-base', sizePx: 16, lineHeight: 1.5 },
  { name: 'text-lg', sizePx: 18, lineHeight: 1.556 },
  { name: 'text-xl', sizePx: 20, lineHeight: 1.4 },
  { name: 'text-2xl', sizePx: 24, lineHeight: 1.333 },
  { name: 'text-3xl', sizePx: 30, lineHeight: 1.267 },
  { name: 'text-4xl', sizePx: 36, lineHeight: 1.222 },
  { name: 'text-5xl', sizePx: 48, lineHeight: 1.167 },
  { name: 'text-6xl', sizePx: 60, lineHeight: 1.1 },
  { name: 'text-7xl', sizePx: 72, lineHeight: 1.1 },
  { name: 'text-8xl', sizePx: 96, lineHeight: 1.1 },
  { name: 'text-9xl', sizePx: 128, lineHeight: 1.1 },
]

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function computeTailwindScale(config: TailwindScaleConfig): ScaleStep[] {
  const { overrides, useFluid, fluidMinViewport = 320, fluidMaxViewport = 1440 } = config

  return TAILWIND_DEFAULTS.map((def, i) => {
    const override = overrides[def.name]
    const sizePx = override?.size ?? def.sizePx
    const lineHeight = override?.lineHeight ?? def.lineHeight
    const letterSpacing = override?.letterSpacing ?? (sizePx >= 32 ? '-0.02em' : sizePx >= 24 ? '-0.01em' : null)

    let clamp: string | null = null
    if (useFluid) {
      const minSize = roundTo(sizePx * 0.8, 2)
      clamp = generateClamp(minSize, sizePx, fluidMinViewport, fluidMaxViewport)
    }

    return {
      name: def.name,
      index: i,
      sizePx,
      sizeRem: roundTo(sizePx / 16, 3),
      clamp,
      lineHeight,
      letterSpacing,
    }
  })
}
