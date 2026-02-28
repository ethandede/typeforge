import { useTypography } from '../context/TypographyContext'
import { LandingStep } from './steps/LandingStep'
import { FontStep } from './steps/FontStep'
import { ScaleStep } from './steps/ScaleStep'
import { MappingStep } from './steps/MappingStep'
import { PreviewStep } from './steps/PreviewStep'
import { ExportStep } from './steps/ExportStep'

const STEPS = [
  { label: 'Start', component: LandingStep },
  { label: 'Fonts', component: FontStep },
  { label: 'Scale', component: ScaleStep },
  { label: 'Mapping', component: MappingStep },
  { label: 'Preview', component: PreviewStep },
  { label: 'Export', component: ExportStep },
]

function canProceed(step: number, state: ReturnType<typeof useTypography>['state']): boolean {
  switch (step) {
    case 0: return true // Landing — always can proceed
    case 1: return !!(state.headingFont && state.bodyFont)
    case 2: return state.scaleSteps.length > 0
    case 3: return state.elementMappings.length > 0
    case 4: return true // Preview — always can proceed to export
    case 5: return false // Export — last step, no next
    default: return false
  }
}

export function Wizard() {
  const { state, dispatch } = useTypography()
  const { currentStep } = state

  const StepComponent = STEPS[currentStep].component

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <button
              onClick={() => dispatch({ type: 'SET_STEP', step: i })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                i === currentStep
                  ? 'bg-gray-900 text-white'
                  : i < currentStep
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                i === currentStep
                  ? 'bg-white text-gray-900'
                  : i < currentStep
                    ? 'bg-gray-400 text-white'
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {i < currentStep ? '\u2713' : i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-1 ${i < currentStep ? 'bg-gray-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current step */}
      <div className="mb-8">
        <StepComponent />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={() => dispatch({ type: 'GO_BACK' })}
          disabled={currentStep === 0}
          className={`px-5 py-2 rounded-lg text-sm transition-colors ${
            currentStep === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          Back
        </button>

        {currentStep < STEPS.length - 1 && (
          <button
            onClick={() => dispatch({ type: 'GO_NEXT' })}
            disabled={!canProceed(currentStep, state)}
            className={`px-5 py-2 rounded-lg text-sm transition-colors ${
              canProceed(currentStep, state)
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === STEPS.length - 2 ? 'Export' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}
