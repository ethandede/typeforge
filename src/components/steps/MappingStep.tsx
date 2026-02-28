import { useTypography } from '../../context/TypographyContext'
import type { ElementMapping, HtmlElement } from '../../types'

const ELEMENT_LABELS: Record<HtmlElement, string> = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  body: 'Body Text',
  small: 'Small',
  caption: 'Caption',
  blockquote: 'Blockquote',
  code: 'Code',
  overline: 'Overline',
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

export function MappingStep() {
  const { state, dispatch } = useTypography()
  const { scaleSteps, elementMappings } = state

  // Ensure fonts are loaded
  if (state.headingFont) loadGoogleFont(state.headingFont.family, state.headingFont.weights)
  if (state.bodyFont) loadGoogleFont(state.bodyFont.family, state.bodyFont.weights)

  function updateMapping(index: number, partial: Partial<ElementMapping>) {
    const updated = [...elementMappings]
    updated[index] = { ...updated[index], ...partial }
    dispatch({ type: 'SET_ELEMENT_MAPPINGS', mappings: updated })
  }

  if (scaleSteps.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Configure a scale first to set up element mappings.
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Map elements to scale</h2>
        <p className="text-gray-600">
          Assign a type scale step, font weight, and line height to each HTML element.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3">Element</th>
                <th className="py-2 pr-3">Scale Step</th>
                <th className="py-2 pr-3">Weight</th>
                <th className="py-2 pr-3">Line Height</th>
                <th className="py-2">Transform</th>
              </tr>
            </thead>
            <tbody>
              {elementMappings.map((mapping, i) => (
                <tr key={mapping.element} className="border-b border-gray-100">
                  <td className="py-2 pr-3">
                    <span className="font-mono text-gray-600">&lt;{mapping.element}&gt;</span>
                    <span className="text-xs text-gray-400 ml-1">{ELEMENT_LABELS[mapping.element]}</span>
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={mapping.scaleStep}
                      onChange={e => updateMapping(i, { scaleStep: Number(e.target.value) })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm w-28"
                    >
                      {scaleSteps.map(s => (
                        <option key={s.index} value={s.index}>
                          {s.name} ({s.sizePx}px)
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      min={100}
                      max={900}
                      step={100}
                      value={mapping.fontWeight}
                      onChange={e => updateMapping(i, { fontWeight: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="number"
                      min={0.8}
                      max={2.5}
                      step={0.05}
                      value={mapping.lineHeight}
                      onChange={e => updateMapping(i, { lineHeight: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="py-2">
                    <select
                      value={mapping.textTransform}
                      onChange={e => updateMapping(i, { textTransform: e.target.value as ElementMapping['textTransform'] })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="none">none</option>
                      <option value="uppercase">uppercase</option>
                      <option value="lowercase">lowercase</option>
                      <option value="capitalize">capitalize</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500 mb-4">Live Preview</p>
          <div className="space-y-4">
            {elementMappings.map(mapping => {
              const step = scaleSteps.find(s => s.index === mapping.scaleStep)
              if (!step) return null

              const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(mapping.element)
              const isCode = mapping.element === 'code'
              const fontFamily = isCode && state.monoFont
                ? `"${state.monoFont.family}", monospace`
                : isHeading && state.headingFont
                  ? `"${state.headingFont.family}", serif`
                  : state.bodyFont
                    ? `"${state.bodyFont.family}", sans-serif`
                    : 'sans-serif'

              return (
                <div key={mapping.element} className="flex items-baseline gap-3">
                  <span className="text-xs font-mono text-gray-400 w-20 shrink-0">
                    {mapping.element}
                  </span>
                  <span
                    style={{
                      fontSize: `${Math.min(step.sizePx, 48)}px`,
                      fontWeight: mapping.fontWeight,
                      lineHeight: mapping.lineHeight,
                      fontFamily,
                      textTransform: mapping.textTransform,
                      letterSpacing: mapping.letterSpacing ?? undefined,
                    }}
                  >
                    {ELEMENT_LABELS[mapping.element]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
