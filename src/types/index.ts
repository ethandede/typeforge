// --- Scale Methods ---

export type ScaleMethod =
  | 'modular-scale'
  | 'utopia-fluid'
  | 'tailwind'
  | 'bootstrap'
  | 'shadcn'

export type ScaleRatio = {
  name: string
  value: number
}

export const SCALE_RATIOS: ScaleRatio[] = [
  { name: 'Major Second', value: 1.125 },
  { name: 'Minor Third', value: 1.2 },
  { name: 'Major Third', value: 1.25 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Augmented Fourth', value: 1.414 },
  { name: 'Perfect Fifth', value: 1.5 },
  { name: 'Golden Ratio', value: 1.618 },
]

// --- Scale Configurations ---

export interface ModularScaleConfig {
  method: 'modular-scale'
  baseSize: number       // px
  ratio: number
  stepsAbove: number
  stepsBelow: number
}

export interface FluidScaleConfig {
  method: 'utopia-fluid'
  minViewport: number    // px
  maxViewport: number    // px
  minBaseSize: number    // px
  maxBaseSize: number    // px
  minRatio: number
  maxRatio: number
  steps: number          // steps above base
}

export interface TailwindScaleConfig {
  method: 'tailwind'
  overrides: Record<string, { size: number; lineHeight: number; letterSpacing?: string }>
  useFluid: boolean
  fluidMinViewport?: number
  fluidMaxViewport?: number
}

export interface BootstrapScaleConfig {
  method: 'bootstrap'
  overrides: Record<string, number>  // Sass variable name -> rem value
  useRfs: boolean
}

export interface ShadcnScaleConfig {
  method: 'shadcn'
  overrides: Record<string, { size: number; lineHeight: number; letterSpacing?: string }>
}

export type ScaleConfig =
  | ModularScaleConfig
  | FluidScaleConfig
  | TailwindScaleConfig
  | BootstrapScaleConfig
  | ShadcnScaleConfig

// --- Computed Scale ---

export interface ScaleStep {
  name: string          // e.g., 'step-3', 'text-xl', '$h1-font-size'
  index: number
  sizePx: number
  sizeRem: number
  clamp: string | null  // clamp() value for fluid, null for static
  lineHeight: number
  letterSpacing: string | null
}

// --- Fonts ---

export interface FontSelection {
  family: string
  weights: number[]
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace'
}

export interface FontPairing {
  id: string
  headingFont: FontSelection
  bodyFont: FontSelection
  monoFont?: FontSelection
  method: ScaleMethod
  mood: string[]
  useCase: string[]
  notes: string
}

// --- Element Mapping ---

export type HtmlElement =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body' | 'small' | 'caption' | 'blockquote' | 'code' | 'overline'

export interface ElementMapping {
  element: HtmlElement
  scaleStep: number
  fontWeight: number
  lineHeight: number
  letterSpacing: string | null
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  marginTop: string
  marginBottom: string
}

// --- Spacing ---

export interface SpacingStep {
  name: string         // e.g., '--space-md'
  sizePx: number
  sizeRem: number
  clamp: string | null
}

// --- Full System ---

export interface TypographySystem {
  scaleConfig: ScaleConfig
  headingFont: FontSelection
  bodyFont: FontSelection
  monoFont: FontSelection | null
  scaleSteps: ScaleStep[]
  elementMappings: ElementMapping[]
  spacingSteps: SpacingStep[]
}

// --- Export ---

export type ExportFormat =
  | 'css-custom-properties'
  | 'scss'
  | 'tailwind-v4'
  | 'shadcn'
  | 'bootstrap'
  | 'design-tokens'
  | 'claude-prompt'
  | 'ai-prompt'
  | 'system-prompt'
