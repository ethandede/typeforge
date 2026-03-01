import type { TypographySystem, FontSelection } from '../types'

function googleFontsUrl(fonts: FontSelection[]): string {
  const families = fonts
    .map(f => {
      const weights = f.weights.join(';')
      return `family=${f.family.replace(/ /g, '+')}:wght@${weights}`
    })
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

function fontStack(font: FontSelection): string {
  const fallbacks: Record<string, string> = {
    serif: 'Georgia, "Times New Roman", Times, serif',
    'sans-serif': 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
    display: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
    handwriting: 'cursive',
    monospace: '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace',
  }
  return `"${font.family}", ${fallbacks[font.category] ?? 'sans-serif'}`
}

export function generateCssCustomProperties(system: TypographySystem): string {
  const { headingFont, bodyFont, monoFont, scaleSteps, elementMappings, spacingSteps } = system
  const lines: string[] = []

  // Google Fonts import
  const fontsToLoad = [headingFont, bodyFont, ...(monoFont ? [monoFont] : [])]
  lines.push(`@import url('${googleFontsUrl(fontsToLoad)}');`)
  lines.push('')

  // :root block
  lines.push(':root {')
  lines.push('  /* Font families */')
  lines.push(`  --font-heading: ${fontStack(headingFont)};`)
  lines.push(`  --font-body: ${fontStack(bodyFont)};`)
  if (monoFont) {
    lines.push(`  --font-mono: ${fontStack(monoFont)};`)
  }
  lines.push('')

  // Scale steps
  lines.push('  /* Type scale */')
  for (const step of scaleSteps) {
    const value = step.clamp ?? `${step.sizeRem}rem`
    lines.push(`  --${step.name}: ${value};`)
  }
  lines.push('')

  // Line heights
  lines.push('  /* Line heights */')
  for (const step of scaleSteps) {
    lines.push(`  --lh-${step.name}: ${step.lineHeight};`)
  }
  lines.push('')

  // Spacing
  lines.push('  /* Spacing scale */')
  for (const step of spacingSteps) {
    const value = step.clamp ?? `${step.sizeRem}rem`
    lines.push(`  ${step.name}: ${value};`)
  }

  lines.push('}')
  lines.push('')

  // Element styles
  lines.push('/* Element styles */')
  for (const mapping of elementMappings) {
    const step = scaleSteps.find(s => s.index === mapping.scaleStep)
    if (!step) continue

    const selector = mapping.element === 'body' ? 'body' : mapping.element
    const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(mapping.element)

    lines.push(`${selector} {`)
    lines.push(`  font-family: var(--font-${isHeading ? 'heading' : 'body'});`)
    lines.push(`  font-size: var(--${step.name});`)
    lines.push(`  font-weight: ${mapping.fontWeight};`)
    lines.push(`  line-height: var(--lh-${step.name});`)
    if (mapping.letterSpacing) {
      lines.push(`  letter-spacing: ${mapping.letterSpacing};`)
    }
    if (mapping.textTransform !== 'none') {
      lines.push(`  text-transform: ${mapping.textTransform};`)
    }
    if (mapping.marginTop !== '0') {
      lines.push(`  margin-top: ${mapping.marginTop};`)
    }
    lines.push(`  margin-bottom: ${mapping.marginBottom};`)
    lines.push('}')
    lines.push('')
  }

  return lines.join('\n')
}
