import { describe, it, expect } from 'vitest'
import { generateClaudePrompt, generateGenericAiPrompt, generateSystemPromptSnippet } from '../ai-prompt'
import type { TypographySystem } from '../../types'

function buildMockSystem(): TypographySystem {
  return {
    scaleConfig: { method: 'modular-scale', baseSize: 16, ratio: 1.25, stepsAbove: 3, stepsBelow: 1 },
    headingFont: { family: 'Playfair Display', weights: [400, 700], category: 'serif' },
    bodyFont: { family: 'Inter', weights: [400, 500], category: 'sans-serif' },
    monoFont: null,
    scaleSteps: [
      { name: 'step--1', index: -1, sizePx: 12.8, sizeRem: 0.8, clamp: null, lineHeight: 1.6, letterSpacing: null },
      { name: 'step-0', index: 0, sizePx: 16, sizeRem: 1, clamp: null, lineHeight: 1.5, letterSpacing: null },
      { name: 'step-1', index: 1, sizePx: 20, sizeRem: 1.25, clamp: null, lineHeight: 1.4, letterSpacing: null },
      { name: 'step-2', index: 2, sizePx: 25, sizeRem: 1.563, clamp: null, lineHeight: 1.35, letterSpacing: '-0.01em' },
      { name: 'step-3', index: 3, sizePx: 31.25, sizeRem: 1.953, clamp: null, lineHeight: 1.3, letterSpacing: '-0.02em' },
    ],
    elementMappings: [
      { element: 'h1', scaleStep: 3, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', textTransform: 'none', marginBottom: 'var(--space-lg)' },
      { element: 'body', scaleStep: 0, fontWeight: 400, lineHeight: 1.5, letterSpacing: null, textTransform: 'none', marginBottom: 'var(--space-md)' },
    ],
    spacingSteps: [],
  }
}

describe('generateClaudePrompt', () => {
  it('includes implementation instructions', () => {
    const prompt = generateClaudePrompt(buildMockSystem())
    expect(prompt).toContain('Implement')
    expect(prompt).toContain('typography')
  })

  it('includes font families', () => {
    const prompt = generateClaudePrompt(buildMockSystem())
    expect(prompt).toContain('Playfair Display')
    expect(prompt).toContain('Inter')
  })

  it('includes scale method and values', () => {
    const prompt = generateClaudePrompt(buildMockSystem())
    expect(prompt).toContain('modular-scale')
    expect(prompt).toContain('1.25')
  })

  it('includes element mappings', () => {
    const prompt = generateClaudePrompt(buildMockSystem())
    expect(prompt).toContain('h1')
    expect(prompt).toContain('700')
  })
})

describe('generateGenericAiPrompt', () => {
  it('is framework-agnostic', () => {
    const prompt = generateGenericAiPrompt(buildMockSystem())
    expect(prompt).not.toContain('Claude')
    expect(prompt).toContain('typography')
  })
})

describe('generateSystemPromptSnippet', () => {
  it('is concise (under 1000 chars for simple system)', () => {
    const snippet = generateSystemPromptSnippet(buildMockSystem())
    expect(snippet.length).toBeLessThan(1000)
  })

  it('contains key font info', () => {
    const snippet = generateSystemPromptSnippet(buildMockSystem())
    expect(snippet).toContain('Playfair Display')
    expect(snippet).toContain('Inter')
  })
})
