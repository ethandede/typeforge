import { useState, useMemo } from 'react'
import { useTypography } from '../../context/TypographyContext'

type Template = 'article' | 'landing' | 'dashboard' | 'docs'
type Viewport = 'desktop' | 'tablet' | 'mobile'

const VIEWPORT_WIDTHS: Record<Viewport, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
}

function loadGoogleFont(family: string, weights: number[]) {
  const id = `gf-${family.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights.join(';')}&display=swap`
  document.head.appendChild(link)
}

function resolveSpacingVar(varRef: string, spacingSteps: { name: string; sizePx: number }[]): string {
  const match = varRef.match(/^var\((--.+)\)$/)
  if (!match) return varRef
  const step = spacingSteps.find(s => s.name === match[1])
  return step ? `${step.sizePx}px` : '16px'
}

function useComputedStyles() {
  const { state } = useTypography()

  return useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {}
    const headingFont = state.headingFont
      ? `"${state.headingFont.family}", serif`
      : 'Georgia, serif'
    const bodyFont = state.bodyFont
      ? `"${state.bodyFont.family}", sans-serif`
      : 'system-ui, sans-serif'

    for (const mapping of state.elementMappings) {
      const step = state.scaleSteps.find(s => s.index === mapping.scaleStep)
      if (!step) continue
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(mapping.element)

      styles[mapping.element] = {
        fontFamily: isHeading ? headingFont : bodyFont,
        fontSize: `${step.sizePx}px`,
        fontWeight: mapping.fontWeight,
        lineHeight: mapping.lineHeight,
        letterSpacing: mapping.letterSpacing ?? undefined,
        textTransform: mapping.textTransform !== 'none' ? mapping.textTransform : undefined,
        marginTop: resolveSpacingVar(mapping.marginTop, state.spacingSteps),
        marginBottom: resolveSpacingVar(mapping.marginBottom, state.spacingSteps),
      }
    }

    return { styles, headingFont, bodyFont }
  }, [state.elementMappings, state.scaleSteps, state.headingFont, state.bodyFont, state.spacingSteps])
}

function ArticleTemplate({ styles }: { styles: Record<string, React.CSSProperties> }) {
  return (
    <article>
      <div style={styles.overline}>Design Systems</div>
      <h1 style={styles.h1}>Building a Typography System That Scales</h1>
      <p style={styles.body}>
        Typography is one of those things that separates good interfaces from great ones. When the type
        system works, nobody notices. When it doesn't, everything feels slightly off — the hierarchy is
        unclear, the reading experience is uncomfortable, and the design loses coherence as content grows.
      </p>
      <h2 style={styles.h2}>Why Type Scales Matter</h2>
      <p style={styles.body}>
        A type scale gives you a constrained set of sizes to work with. Instead of picking font sizes
        ad hoc for each component, you choose from a predetermined set of values that share a mathematical
        relationship. This creates visual consistency across your entire application without requiring
        constant design review for every new piece of content.
      </p>
      <blockquote style={{ ...styles.blockquote, borderLeft: '3px solid #d1d5db', paddingLeft: '1em' }}>
        Good typography is invisible. Bad typography is everywhere.
      </blockquote>
      <h3 style={styles.h3}>Modular vs. Fluid Scales</h3>
      <p style={styles.body}>
        Modular scales use a fixed ratio between steps. A ratio of 1.25 (Major Third) applied to a 16px
        base produces 20px, 25px, 31.25px, and so on. Each step is proportionally larger than the last,
        creating a harmonious progression that echoes musical intervals.
      </p>
      <h4 style={styles.h4}>When to Use Each Approach</h4>
      <p style={styles.body}>
        Fixed scales work well when you know your target viewport and have defined breakpoints. Fluid
        scales shine when you want a single definition that adapts continuously across all screen sizes.
      </p>
      <h5 style={styles.h5}>A Note on Browser Support</h5>
      <p style={styles.body}>
        CSS clamp() is supported in all modern browsers. If you need to support older browsers,
        the modular scale approach with media queries is a reliable fallback.
      </p>
      <h6 style={styles.h6}>Further Reading</h6>
      <p style={styles.body}>
        For a deeper dive into the mathematics behind type scales, see the resources linked in the
        documentation section of this guide.
      </p>
      <p style={styles.small}>
        Published on February 28, 2026 by EE Creative
      </p>
    </article>
  )
}

function LandingTemplate({ styles }: { styles: Record<string, React.CSSProperties> }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2em' }}>
        <div style={styles.overline}>Introducing TypeForge</div>
        <h1 style={styles.h1}>Design your typography system in minutes, not days</h1>
        <p style={{ ...styles.body, maxWidth: '600px', margin: '0 auto' }}>
          Stop guessing at font sizes. TypeForge generates mathematically harmonious type scales,
          pairs them with curated Google Fonts, and exports production-ready CSS or Tailwind config.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 style={styles.h3}>Curated Pairings</h3>
          <p style={styles.body}>
            28 hand-picked Google Fonts combinations tested across multiple contexts and use cases.
          </p>
        </div>
        <div>
          <h3 style={styles.h3}>Three Scale Methods</h3>
          <p style={styles.body}>
            Modular, Utopia Fluid, or Tailwind defaults. Each tuned for different project needs.
          </p>
        </div>
        <div>
          <h3 style={styles.h3}>AI-Ready Export</h3>
          <p style={styles.body}>
            Generate prompts for Claude, ChatGPT, or any AI assistant to implement your system.
          </p>
        </div>
      </div>

      <h2 style={styles.h2}>How it works</h2>
      <div>
        <h4 style={styles.h4}>1. Pick your fonts</h4>
        <p style={styles.body}>Choose from curated pairings or bring your own.</p>
        <h4 style={styles.h4}>2. Configure the scale</h4>
        <p style={styles.body}>Set base size, ratio, and number of steps.</p>
        <h4 style={styles.h4}>3. Export and ship</h4>
        <p style={styles.body}>Copy CSS custom properties, Tailwind config, or AI prompts.</p>
      </div>

      <h5 style={styles.h5}>Trusted by developers worldwide</h5>
      <p style={styles.small}>Join thousands of developers who use TypeForge to build consistent type systems.</p>
    </div>
  )
}

function DashboardTemplate({ styles }: { styles: Record<string, React.CSSProperties> }) {
  return (
    <div>
      <h1 style={styles.h1}>Dashboard</h1>
      <p style={styles.body}>Welcome back. Here's what happened while you were away.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {['Revenue', 'Users', 'Sessions', 'Conversion'].map(metric => (
          <div key={metric} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1em' }}>
            <div style={styles.caption}>{metric}</div>
            <h2 style={{ ...styles.h2, marginBottom: '0' }}>$12,450</h2>
            <div style={styles.small}>+12.5% from last month</div>
          </div>
        ))}
      </div>

      <h3 style={styles.h3}>Recent Activity</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ ...styles.caption, textAlign: 'left', padding: '0.5em 0' }}>Event</th>
            <th style={{ ...styles.caption, textAlign: 'left', padding: '0.5em 0' }}>User</th>
            <th style={{ ...styles.caption, textAlign: 'left', padding: '0.5em 0' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {['New signup', 'Purchase completed', 'Support ticket opened'].map(event => (
            <tr key={event} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ ...styles.body, padding: '0.5em 0' }}>{event}</td>
              <td style={{ ...styles.body, padding: '0.5em 0' }}>user@example.com</td>
              <td style={{ ...styles.small, padding: '0.5em 0' }}>Feb 28, 2026</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 style={styles.h4}>Quick Actions</h4>
      <p style={styles.body}>
        Manage users, view reports, or configure your account settings from the sidebar.
      </p>

      <h5 style={styles.h5}>API Endpoint</h5>
      <code style={{ ...styles.code, background: '#f3f4f6', padding: '0.25em 0.5em', borderRadius: '4px' }}>
        GET /api/v1/dashboard/metrics
      </code>

      <h6 style={styles.h6}>Last updated: February 28, 2026</h6>
    </div>
  )
}

function DocsTemplate({ styles }: { styles: Record<string, React.CSSProperties> }) {
  return (
    <div>
      <div style={styles.overline}>API Reference</div>
      <h1 style={styles.h1}>Typography System API</h1>
      <p style={styles.body}>
        This document covers the public API for the TypeForge typography system. All methods are
        available as named exports from the main package.
      </p>

      <h2 style={styles.h2}>Installation</h2>
      <pre style={{ ...styles.code, background: '#f3f4f6', padding: '1em', borderRadius: '8px', overflow: 'auto' }}>
        npm install @typeforge/core
      </pre>

      <h2 style={styles.h2}>Scale Engines</h2>
      <h3 style={styles.h3}>computeModularScale(config)</h3>
      <p style={styles.body}>
        Generates a modular type scale based on a base size and ratio. Returns an array of scale steps
        with computed pixel sizes, rem values, and line heights.
      </p>

      <h4 style={styles.h4}>Parameters</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1em' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ ...styles.caption, textAlign: 'left', padding: '0.5em 0' }}>Name</th>
            <th style={{ ...styles.caption, textAlign: 'left', padding: '0.5em 0' }}>Type</th>
            <th style={{ ...styles.caption, textAlign: 'left', padding: '0.5em 0' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ ...styles.body, padding: '0.5em 0' }}>
              <code style={{ ...styles.code, background: '#f3f4f6', padding: '0.15em 0.4em', borderRadius: '3px' }}>baseSize</code>
            </td>
            <td style={{ ...styles.body, padding: '0.5em 0' }}>number</td>
            <td style={{ ...styles.body, padding: '0.5em 0' }}>Base font size in pixels (default: 16)</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
            <td style={{ ...styles.body, padding: '0.5em 0' }}>
              <code style={{ ...styles.code, background: '#f3f4f6', padding: '0.15em 0.4em', borderRadius: '3px' }}>ratio</code>
            </td>
            <td style={{ ...styles.body, padding: '0.5em 0' }}>number</td>
            <td style={{ ...styles.body, padding: '0.5em 0' }}>Scale ratio (e.g., 1.25 for Major Third)</td>
          </tr>
        </tbody>
      </table>

      <h4 style={styles.h4}>Returns</h4>
      <p style={styles.body}>
        <code style={{ ...styles.code, background: '#f3f4f6', padding: '0.15em 0.4em', borderRadius: '3px' }}>ScaleStep[]</code>
        — An array of scale step objects.
      </p>

      <h5 style={styles.h5}>ScaleStep Properties</h5>
      <p style={styles.body}>
        Each step includes name, index, sizePx, sizeRem, lineHeight, letterSpacing, and an optional
        clamp value for fluid scales.
      </p>

      <h6 style={styles.h6}>Deprecated</h6>
      <p style={styles.small}>
        The legacy computeScale() function has been removed in v2.0. Use computeModularScale() instead.
      </p>
    </div>
  )
}

export function PreviewStep() {
  const { state } = useTypography()
  const [template, setTemplate] = useState<Template>('article')
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const { styles } = useComputedStyles()

  // Ensure fonts are loaded
  if (state.headingFont) loadGoogleFont(state.headingFont.family, state.headingFont.weights)
  if (state.bodyFont) loadGoogleFont(state.bodyFont.family, state.bodyFont.weights)

  if (state.scaleSteps.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Configure a scale first to see the preview.
      </div>
    )
  }

  const TemplateComponent = {
    article: ArticleTemplate,
    landing: LandingTemplate,
    dashboard: DashboardTemplate,
    docs: DocsTemplate,
  }[template]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview your system</h2>
        <p className="text-gray-600">
          See how your typography choices look in real content layouts.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {([['article', 'Article'], ['landing', 'Landing'], ['dashboard', 'Dashboard'], ['docs', 'Docs']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTemplate(key)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                template === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 ml-auto">
          {([['desktop', 'Desktop'], ['tablet', 'Tablet'], ['mobile', 'Mobile']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setViewport(key)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                viewport === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
        <div
          className="bg-white border border-gray-200 rounded-lg p-8 transition-all duration-300"
          style={{
            width: `${VIEWPORT_WIDTHS[viewport]}px`,
            maxWidth: '100%',
            overflow: 'auto',
          }}
        >
          <TemplateComponent styles={styles} />
        </div>
      </div>
    </div>
  )
}
