import type { ElementMapping, HtmlElement, ScaleStep } from '../types'

interface MappingDefault {
  element: HtmlElement
  stepOffset: number  // offset from max step (0 = highest, -1 = second highest, etc.)
  fontWeight: number
  textTransform: ElementMapping['textTransform']
  marginTop: string
  marginBottom: string
}

const DEFAULTS: MappingDefault[] = [
  { element: 'h1', stepOffset: 0, fontWeight: 700, textTransform: 'none', marginTop: '0', marginBottom: 'var(--space-lg)' },
  { element: 'h2', stepOffset: -1, fontWeight: 700, textTransform: 'none', marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' },
  { element: 'h3', stepOffset: -2, fontWeight: 600, textTransform: 'none', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-sm)' },
  { element: 'h4', stepOffset: -3, fontWeight: 600, textTransform: 'none', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xs)' },
  { element: 'h5', stepOffset: -4, fontWeight: 600, textTransform: 'none', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xs)' },
  { element: 'h6', stepOffset: -5, fontWeight: 600, textTransform: 'uppercase', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xs)' },
  { element: 'body', stepOffset: -99, fontWeight: 400, textTransform: 'none', marginTop: '0', marginBottom: 'var(--space-md)' },
  { element: 'small', stepOffset: -100, fontWeight: 400, textTransform: 'none', marginTop: '0', marginBottom: 'var(--space-xs)' },
  { element: 'caption', stepOffset: -100, fontWeight: 400, textTransform: 'none', marginTop: '0', marginBottom: 'var(--space-xs)' },
  { element: 'blockquote', stepOffset: -99, fontWeight: 400, textTransform: 'none', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-lg)' },
  { element: 'code', stepOffset: -101, fontWeight: 400, textTransform: 'none', marginTop: '0', marginBottom: 'var(--space-md)' },
  { element: 'overline', stepOffset: -101, fontWeight: 600, textTransform: 'uppercase', marginTop: '0', marginBottom: 'var(--space-xs)' },
]

export function getDefaultElementMappings(steps: ScaleStep[]): ElementMapping[] {
  const maxIndex = Math.max(...steps.map(s => s.index))
  const minIndex = Math.min(...steps.map(s => s.index))

  return DEFAULTS.map(def => {
    let targetIndex: number

    if (def.stepOffset <= -99) {
      // Special cases: body=0, small/caption=-1, blockquote=1, code/overline=-2
      const specialMap: Record<string, number> = {
        body: 0,
        small: -1,
        caption: -1,
        blockquote: 1,
        code: -2,
        overline: -2,
      }
      targetIndex = specialMap[def.element] ?? 0
    } else {
      targetIndex = maxIndex + def.stepOffset
    }

    // Clamp to available range
    targetIndex = Math.max(minIndex, Math.min(maxIndex, targetIndex))

    const step = steps.find(s => s.index === targetIndex)!

    return {
      element: def.element,
      scaleStep: targetIndex,
      fontWeight: def.fontWeight,
      lineHeight: step.lineHeight,
      letterSpacing: step.letterSpacing,
      textTransform: def.textTransform,
      marginTop: def.marginTop,
      marginBottom: def.marginBottom,
    }
  })
}
