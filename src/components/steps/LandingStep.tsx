import { useState, useEffect } from 'react'
import { useTypography } from '../../context/TypographyContext'
import { pairings } from '../../data/pairings'
import type { FontPairing } from '../../types'

function loadGoogleFont(family: string, weights: number[]) {
  const id = `gf-${family.replace(/\s+/g, '-').toLowerCase()}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weights.join(';')}&display=swap`
  document.head.appendChild(link)
}

const METHOD_LABELS: Record<string, string> = {
  'modular-scale': 'Modular',
  'utopia-fluid': 'Fluid',
  'tailwind': 'Tailwind',
  'bootstrap': 'Bootstrap',
  'shadcn': 'shadcn',
}

const METHOD_COLORS: Record<string, string> = {
  'modular-scale': 'bg-violet-100 text-violet-700',
  'utopia-fluid': 'bg-blue-100 text-blue-700',
  'tailwind': 'bg-cyan-100 text-cyan-700',
  'bootstrap': 'bg-purple-100 text-purple-700',
  'shadcn': 'bg-orange-100 text-orange-700',
}

function PairingCard({ pairing, onClick }: { pairing: FontPairing; onClick: () => void }) {
  useEffect(() => {
    loadGoogleFont(pairing.headingFont.family, pairing.headingFont.weights)
    loadGoogleFont(pairing.bodyFont.family, pairing.bodyFont.weights)
  }, [pairing])

  return (
    <button
      onClick={onClick}
      className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${METHOD_COLORS[pairing.method] ?? 'bg-gray-100 text-gray-700'}`}>
          {METHOD_LABELS[pairing.method] ?? pairing.method}
        </span>
        {pairing.mood.map(m => (
          <span key={m} className="text-xs text-gray-400">{m}</span>
        ))}
      </div>
      <div
        className="text-2xl font-bold mb-1 group-hover:text-gray-900 transition-colors"
        style={{ fontFamily: `"${pairing.headingFont.family}", serif` }}
      >
        {pairing.headingFont.family}
      </div>
      <div
        className="text-sm text-gray-600 mb-3"
        style={{ fontFamily: `"${pairing.bodyFont.family}", sans-serif` }}
      >
        {pairing.bodyFont.family} &mdash; {pairing.notes.slice(0, 80)}...
      </div>
      <div className="flex gap-2 flex-wrap">
        {pairing.useCase.map(u => (
          <span key={u} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">
            {u}
          </span>
        ))}
      </div>
    </button>
  )
}

export function LandingStep() {
  const { dispatch } = useTypography()
  const [search, setSearch] = useState('')

  const filtered = pairings.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.headingFont.family.toLowerCase().includes(q) ||
      p.bodyFont.family.toLowerCase().includes(q) ||
      p.mood.some(m => m.toLowerCase().includes(q)) ||
      p.useCase.some(u => u.toLowerCase().includes(q)) ||
      p.method.toLowerCase().includes(q)
    )
  })

  function handleSelectPairing(pairing: FontPairing) {
    dispatch({ type: 'LOAD_PAIRING', pairing })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a starting point</h2>
        <p className="text-gray-600">
          Pick a curated font pairing to get started quickly, or build your system from scratch.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by font, mood, or use case..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => dispatch({ type: 'GO_NEXT' })}
          className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          Start from scratch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <PairingCard key={p.id} pairing={p} onClick={() => handleSelectPairing(p)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No pairings match your search. Try a different term or start from scratch.
        </div>
      )}
    </div>
  )
}
