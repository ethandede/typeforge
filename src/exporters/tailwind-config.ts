import type { TypographySystem, FontSelection } from '../types'

function googleFontsUrl(fonts: FontSelection[]): string {
  const families = fonts
    .map(f => `family=${f.family.replace(/ /g, '+')}:wght@${f.weights.join(';')}`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

function fontStack(font: FontSelection): string {
  const fallbacks: Record<string, string> = {
    serif: 'Georgia, "Times New Roman", serif',
    'sans-serif': 'ui-sans-serif, system-ui, sans-serif',
    display: 'ui-sans-serif, system-ui, sans-serif',
    handwriting: 'cursive',
    monospace: 'ui-monospace, SFMono-Regular, monospace',
  }
  return `"${font.family}", ${fallbacks[font.category] ?? 'sans-serif'}`
}

export function generateTailwindConfig(system: TypographySystem): string {
  const { headingFont, bodyFont, monoFont, scaleSteps, spacingSteps } = system
  const lines: string[] = []

  const fontsToLoad = [headingFont, bodyFont, ...(monoFont ? [monoFont] : [])]
  lines.push(`@import url('${googleFontsUrl(fontsToLoad)}');`)
  lines.push('')

  lines.push('@theme {')

  lines.push('  /* Font families */')
  lines.push(`  --font-heading: ${fontStack(headingFont)};`)
  lines.push(`  --font-body: ${fontStack(bodyFont)};`)
  if (monoFont) {
    lines.push(`  --font-mono: ${fontStack(monoFont)};`)
  }
  lines.push('')

  lines.push('  /* Font sizes */')
  for (const step of scaleSteps) {
    const value = step.clamp ?? `${step.sizeRem}rem`
    lines.push(`  --font-size-${step.name}: ${value};`)
  }
  lines.push('')

  lines.push('  /* Line heights */')
  for (const step of scaleSteps) {
    lines.push(`  --line-height-${step.name}: ${step.lineHeight};`)
  }
  lines.push('')

  const stepsWithTracking = scaleSteps.filter(s => s.letterSpacing)
  if (stepsWithTracking.length > 0) {
    lines.push('  /* Letter spacing */')
    for (const step of stepsWithTracking) {
      lines.push(`  --letter-spacing-${step.name}: ${step.letterSpacing};`)
    }
    lines.push('')
  }

  lines.push('  /* Spacing scale */')
  for (const step of spacingSteps) {
    const varName = step.name.replace('--space-', '--spacing-')
    const value = step.clamp ?? `${step.sizeRem}rem`
    lines.push(`  ${varName}: ${value};`)
  }

  lines.push('}')

  return lines.join('\n')
}
