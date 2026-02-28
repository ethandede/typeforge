import { describe, it, expect } from 'vitest'
import { getDefaultElementMappings } from '../element-mapping'
import type { ScaleStep } from '../../types'

const mockSteps: ScaleStep[] = Array.from({ length: 8 }, (_, i) => ({
  name: `step-${i - 2}`,
  index: i - 2,
  sizePx: 16 * Math.pow(1.25, i - 2),
  sizeRem: (16 * Math.pow(1.25, i - 2)) / 16,
  clamp: null,
  lineHeight: 1.5,
  letterSpacing: null,
}))

describe('getDefaultElementMappings', () => {
  it('returns mappings for all standard elements', () => {
    const mappings = getDefaultElementMappings(mockSteps)
    const elements = mappings.map(m => m.element)
    expect(elements).toContain('h1')
    expect(elements).toContain('h2')
    expect(elements).toContain('h3')
    expect(elements).toContain('body')
    expect(elements).toContain('small')
  })

  it('h1 maps to highest available step', () => {
    const mappings = getDefaultElementMappings(mockSteps)
    const h1 = mappings.find(m => m.element === 'h1')!
    expect(h1.scaleStep).toBe(5) // highest index
  })

  it('body maps to step 0', () => {
    const mappings = getDefaultElementMappings(mockSteps)
    const body = mappings.find(m => m.element === 'body')!
    expect(body.scaleStep).toBe(0)
  })

  it('heading weights default to 700', () => {
    const mappings = getDefaultElementMappings(mockSteps)
    const h1 = mappings.find(m => m.element === 'h1')!
    const h2 = mappings.find(m => m.element === 'h2')!
    expect(h1.fontWeight).toBe(700)
    expect(h2.fontWeight).toBe(700)
  })

  it('body weight defaults to 400', () => {
    const mappings = getDefaultElementMappings(mockSteps)
    const body = mappings.find(m => m.element === 'body')!
    expect(body.fontWeight).toBe(400)
  })
})
