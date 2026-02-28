import { useTypography } from '../../context/TypographyContext'
import type {
  ScaleMethod,
  ModularScaleConfig,
  FluidScaleConfig,
  TailwindScaleConfig,
} from '../../types'
import { SCALE_RATIOS } from '../../types'
import { TAILWIND_DEFAULTS } from '../../engines/tailwind-scale'

const METHOD_INFO: { method: ScaleMethod; title: string; description: string }[] = [
  {
    method: 'modular-scale',
    title: 'Modular Scale',
    description: 'A mathematical scale based on a base size and ratio. Produces harmonious, proportional type sizes. Best for traditional web projects.',
  },
  {
    method: 'utopia-fluid',
    title: 'Utopia Fluid',
    description: 'Responsive type that scales smoothly between viewport sizes using CSS clamp(). No breakpoints needed. Ideal for modern responsive design.',
  },
  {
    method: 'tailwind',
    title: 'Tailwind',
    description: 'Start with Tailwind CSS default sizes and customize individual steps. Great if you are already using Tailwind and want to fine-tune the defaults.',
  },
]

function MethodSelector() {
  const { dispatch } = useTypography()

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a scale method</h2>
      <p className="text-gray-600 mb-6">
        This determines how your type sizes are calculated. You can always change this later.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {METHOD_INFO.map(m => (
          <button
            key={m.method}
            onClick={() => dispatch({ type: 'SET_SCALE_METHOD', method: m.method })}
            className="text-left bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{m.title}</h3>
            <p className="text-sm text-gray-600">{m.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function ModularScaleControls() {
  const { state, dispatch } = useTypography()
  const config = state.scaleConfig as ModularScaleConfig

  function update(partial: Partial<ModularScaleConfig>) {
    dispatch({ type: 'SET_SCALE_CONFIG', config: { ...config, ...partial } })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Base Size (px)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={12}
            max={24}
            step={1}
            value={config.baseSize}
            onChange={e => update({ baseSize: Number(e.target.value) })}
            className="flex-1"
          />
          <input
            type="number"
            min={8}
            max={32}
            value={config.baseSize}
            onChange={e => update({ baseSize: Number(e.target.value) })}
            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ratio</label>
        <select
          value={config.ratio}
          onChange={e => update({ ratio: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {SCALE_RATIOS.map(r => (
            <option key={r.value} value={r.value}>{r.name} ({r.value})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Steps Above</label>
          <input
            type="number"
            min={1}
            max={10}
            value={config.stepsAbove}
            onChange={e => update({ stepsAbove: Number(e.target.value) })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Steps Below</label>
          <input
            type="number"
            min={0}
            max={5}
            value={config.stepsBelow}
            onChange={e => update({ stepsBelow: Number(e.target.value) })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  )
}

function FluidScaleControls() {
  const { state, dispatch } = useTypography()
  const config = state.scaleConfig as FluidScaleConfig

  function update(partial: Partial<FluidScaleConfig>) {
    dispatch({ type: 'SET_SCALE_CONFIG', config: { ...config, ...partial } })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Viewport (px)</label>
          <input
            type="number"
            min={280}
            max={600}
            value={config.minViewport}
            onChange={e => update({ minViewport: Number(e.target.value) })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Viewport (px)</label>
          <input
            type="number"
            min={900}
            max={2560}
            value={config.maxViewport}
            onChange={e => update({ maxViewport: Number(e.target.value) })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Base Size (px)</label>
          <input
            type="number"
            min={12}
            max={20}
            value={config.minBaseSize}
            onChange={e => update({ minBaseSize: Number(e.target.value) })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Base Size (px)</label>
          <input
            type="number"
            min={14}
            max={28}
            value={config.maxBaseSize}
            onChange={e => update({ maxBaseSize: Number(e.target.value) })}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Ratio</label>
          <select
            value={config.minRatio}
            onChange={e => update({ minRatio: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {SCALE_RATIOS.map(r => (
              <option key={r.value} value={r.value}>{r.name} ({r.value})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Ratio</label>
          <select
            value={config.maxRatio}
            onChange={e => update({ maxRatio: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {SCALE_RATIOS.map(r => (
              <option key={r.value} value={r.value}>{r.name} ({r.value})</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Steps Above Base</label>
        <input
          type="number"
          min={1}
          max={10}
          value={config.steps}
          onChange={e => update({ steps: Number(e.target.value) })}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

function TailwindScaleControls() {
  const { state, dispatch } = useTypography()
  const config = state.scaleConfig as TailwindScaleConfig

  function updateOverride(name: string, field: 'size' | 'lineHeight', value: number) {
    const current = config.overrides[name] ?? {
      size: TAILWIND_DEFAULTS.find(d => d.name === name)!.sizePx,
      lineHeight: TAILWIND_DEFAULTS.find(d => d.name === name)!.lineHeight,
    }
    const newOverrides = {
      ...config.overrides,
      [name]: { ...current, [field]: value },
    }
    dispatch({ type: 'SET_SCALE_CONFIG', config: { ...config, overrides: newOverrides } })
  }

  function toggleFluid() {
    dispatch({
      type: 'SET_SCALE_CONFIG',
      config: {
        ...config,
        useFluid: !config.useFluid,
        fluidMinViewport: config.fluidMinViewport ?? 320,
        fluidMaxViewport: config.fluidMaxViewport ?? 1440,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={config.useFluid}
            onChange={toggleFluid}
            className="rounded border-gray-300"
          />
          Enable fluid sizing (generates clamp() values)
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Size (px)</th>
              <th className="py-2 pr-4">Line Height</th>
              <th className="py-2">Preview</th>
            </tr>
          </thead>
          <tbody>
            {TAILWIND_DEFAULTS.map(def => {
              const override = config.overrides[def.name]
              const size = override?.size ?? def.sizePx
              const lh = override?.lineHeight ?? def.lineHeight

              return (
                <tr key={def.name} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-mono text-gray-600">{def.name}</td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min={8}
                      max={200}
                      step={1}
                      value={size}
                      onChange={e => updateOverride(def.name, 'size', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min={0.8}
                      max={2.5}
                      step={0.01}
                      value={lh}
                      onChange={e => updateOverride(def.name, 'lineHeight', Number(e.target.value))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="py-2">
                    <span style={{ fontSize: `${size}px`, lineHeight: lh }}>Aa</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ScalePreview() {
  const { state } = useTypography()

  if (state.scaleSteps.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Computed Scale</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-4">Step</th>
              <th className="py-2 pr-4">px</th>
              <th className="py-2 pr-4">rem</th>
              <th className="py-2 pr-4">Line Height</th>
              {state.scaleSteps.some(s => s.clamp) && <th className="py-2">Clamp</th>}
            </tr>
          </thead>
          <tbody>
            {state.scaleSteps.map(step => (
              <tr key={step.name} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-mono text-gray-600">{step.name}</td>
                <td className="py-2 pr-4">{step.sizePx}</td>
                <td className="py-2 pr-4">{step.sizeRem}</td>
                <td className="py-2 pr-4">{step.lineHeight}</td>
                {state.scaleSteps.some(s => s.clamp) && (
                  <td className="py-2 font-mono text-xs text-gray-500">{step.clamp ?? '—'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Visual Preview</h3>
        <div className="space-y-2">
          {[...state.scaleSteps].reverse().map(step => (
            <div key={step.name} className="flex items-baseline gap-3">
              <span className="text-xs font-mono text-gray-400 w-16 shrink-0">{step.name}</span>
              <span
                style={{
                  fontSize: `${Math.min(step.sizePx, 72)}px`,
                  lineHeight: step.lineHeight,
                  fontFamily: state.headingFont ? `"${state.headingFont.family}", serif` : 'serif',
                }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ScaleStep() {
  const { state, dispatch } = useTypography()

  if (!state.scaleMethod) {
    return <MethodSelector />
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Configure your scale</h2>
        <button
          onClick={() => dispatch({ type: 'SET_SCALE_METHOD', method: state.scaleMethod! })}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-500">Method:</span>
            <span className="text-sm font-semibold text-gray-900">
              {METHOD_INFO.find(m => m.method === state.scaleMethod)?.title}
            </span>
            <button
              onClick={() => dispatch({ type: 'CLEAR_SCALE_METHOD' })}
              className="text-xs text-blue-600 hover:text-blue-800 ml-2"
            >
              change method
            </button>
          </div>

          {state.scaleMethod === 'modular-scale' && <ModularScaleControls />}
          {state.scaleMethod === 'utopia-fluid' && <FluidScaleControls />}
          {state.scaleMethod === 'tailwind' && <TailwindScaleControls />}
        </div>

        <div>
          <ScalePreview />
        </div>
      </div>
    </div>
  )
}
