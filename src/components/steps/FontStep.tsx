import { useState, useEffect, useMemo } from 'react'
import { useTypography } from '../../context/TypographyContext'
import type { FontSelection } from '../../types'
import { pairings } from '../../data/pairings'

const POPULAR_FONTS: { family: string; category: FontSelection['category']; weights: number[] }[] = [
  { family: 'Inter', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Roboto', category: 'sans-serif', weights: [300, 400, 500, 700] },
  { family: 'Open Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Lato', category: 'sans-serif', weights: [300, 400, 700, 900] },
  { family: 'Montserrat', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Source Sans 3', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Poppins', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Raleway', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Work Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Nunito', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'DM Sans', category: 'sans-serif', weights: [400, 500, 600, 700] },
  { family: 'Plus Jakarta Sans', category: 'sans-serif', weights: [400, 500, 600, 700, 800] },
  { family: 'Space Grotesk', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Archivo', category: 'sans-serif', weights: [400, 500, 600, 700] },
  { family: 'IBM Plex Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Sora', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Manrope', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Lexend', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Outfit', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Albert Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Karla', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Cabin', category: 'sans-serif', weights: [400, 500, 600, 700] },
  { family: 'Rubik', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Fira Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Josefin Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Noto Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Geologica', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Nunito Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800, 900] },
  { family: 'Merriweather', category: 'serif', weights: [300, 400, 700, 900] },
  { family: 'Lora', category: 'serif', weights: [400, 500, 600, 700] },
  { family: 'DM Serif Display', category: 'serif', weights: [400] },
  { family: 'Source Serif 4', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'PT Serif', category: 'serif', weights: [400, 700] },
  { family: 'Crimson Text', category: 'serif', weights: [400, 600, 700] },
  { family: 'Crimson Pro', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Libre Baskerville', category: 'serif', weights: [400, 700] },
  { family: 'EB Garamond', category: 'serif', weights: [400, 500, 600, 700] },
  { family: 'Bitter', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Cormorant Garamond', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Spectral', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Vollkorn', category: 'serif', weights: [400, 500, 600, 700, 800, 900] },
  { family: 'Fraunces', category: 'serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Old Standard TT', category: 'serif', weights: [400, 700] },
  { family: 'Oswald', category: 'sans-serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Bebas Neue', category: 'display', weights: [400] },
  { family: 'JetBrains Mono', category: 'monospace', weights: [300, 400, 500, 600, 700] },
  { family: 'Fira Code', category: 'monospace', weights: [300, 400, 500, 600, 700] },
  { family: 'Roboto Mono', category: 'monospace', weights: [300, 400, 500, 600, 700] },
]

function loadGoogleFont(family: string, weights: number[]) {
  const id = `gf-${family.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights.join(';')}&display=swap`
  document.head.appendChild(link)
}

const ALL_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

function FontSelector({
  label,
  current,
  onChange,
}: {
  label: string
  current: FontSelection | null
  onChange: (font: FontSelection) => void
}) {
  const [query, setQuery] = useState(current?.family ?? '')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedWeights, setSelectedWeights] = useState<number[]>(current?.weights ?? [400])

  const filtered = useMemo(() => {
    if (!query) return POPULAR_FONTS
    const q = query.toLowerCase()
    return POPULAR_FONTS.filter(f => f.family.toLowerCase().includes(q))
  }, [query])

  function selectFont(font: typeof POPULAR_FONTS[number]) {
    setQuery(font.family)
    setShowDropdown(false)
    const weights = selectedWeights.filter(w => font.weights.includes(w))
    const finalWeights = weights.length > 0 ? weights : [font.weights[Math.floor(font.weights.length / 2)]]
    setSelectedWeights(finalWeights)
    loadGoogleFont(font.family, finalWeights)
    onChange({
      family: font.family,
      weights: finalWeights,
      category: font.category,
    })
  }

  function toggleWeight(weight: number) {
    const fontData = POPULAR_FONTS.find(f => f.family === query)
    if (!fontData) return
    const newWeights = selectedWeights.includes(weight)
      ? selectedWeights.filter(w => w !== weight)
      : [...selectedWeights, weight].sort((a, b) => a - b)
    if (newWeights.length === 0) return
    setSelectedWeights(newWeights)
    loadGoogleFont(fontData.family, newWeights)
    onChange({
      family: fontData.family,
      weights: newWeights,
      category: fontData.category,
    })
  }

  const fontData = POPULAR_FONTS.find(f => f.family === query)

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search fonts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filtered.slice(0, 20).map(f => (
              <button
                key={f.family}
                onClick={() => selectFont(f)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-sm">{f.family}</span>
                <span className="text-xs text-gray-400">{f.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {fontData && (
        <div className="flex flex-wrap gap-2">
          {ALL_WEIGHTS.filter(w => fontData.weights.includes(w)).map(w => (
            <button
              key={w}
              onClick={() => toggleWeight(w)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                selectedWeights.includes(w)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function FontStep() {
  const { state, dispatch } = useTypography()

  // Load current fonts on mount
  useEffect(() => {
    if (state.headingFont) {
      loadGoogleFont(state.headingFont.family, state.headingFont.weights)
    }
    if (state.bodyFont) {
      loadGoogleFont(state.bodyFont.family, state.bodyFont.weights)
    }
  }, [])

  // Find recommended pairings based on selected heading font
  const recommendations = useMemo(() => {
    if (!state.headingFont) return []
    return pairings.filter(
      p => p.headingFont.family === state.headingFont?.family
    )
  }, [state.headingFont])

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your fonts</h2>
        <p className="text-gray-600">
          Select a heading and body font. Weights determine which styles are loaded from Google Fonts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FontSelector
            label="Heading Font"
            current={state.headingFont}
            onChange={font => dispatch({ type: 'SET_HEADING_FONT', font })}
          />
          <FontSelector
            label="Body Font"
            current={state.bodyFont}
            onChange={font => dispatch({ type: 'SET_BODY_FONT', font })}
          />

          {recommendations.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Recommended pairings with {state.headingFont?.family}:</p>
              <div className="space-y-2">
                {recommendations.map(p => (
                  <button
                    key={p.id}
                    onClick={() => dispatch({ type: 'LOAD_PAIRING', pairing: p })}
                    className="w-full text-left px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <span className="font-medium">{p.bodyFont.family}</span>
                    <span className="text-gray-400 ml-2">{p.mood.join(', ')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-500 mb-4">Live Preview</p>
          <div
            className="text-3xl font-bold mb-3 text-gray-900"
            style={{ fontFamily: state.headingFont ? `"${state.headingFont.family}", serif` : 'serif' }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <div
            className="text-base text-gray-700 leading-relaxed"
            style={{ fontFamily: state.bodyFont ? `"${state.bodyFont.family}", sans-serif` : 'sans-serif' }}
          >
            Typography is the craft of endowing human language with a durable visual form, and thus with
            an independent existence. Its heartbeat is the contrast between heading and body text, between
            the voice that commands attention and the voice that sustains it.
          </div>
        </div>
      </div>
    </div>
  )
}
