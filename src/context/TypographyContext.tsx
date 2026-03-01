import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type {
  ScaleMethod,
  ScaleConfig,
  ScaleStep,
  FontSelection,
  ElementMapping,
  SpacingStep,
  TypographySystem,
  FontPairing,
} from '../types'
import { computeModularScale } from '../engines/modular-scale'
import { computeFluidScale } from '../engines/fluid-scale'
import { computeTailwindScale } from '../engines/tailwind-scale'
import { computeSpacingScale } from '../engines/spacing'
import { getDefaultElementMappings } from '../engines/element-mapping'

// --- State ---

export interface TypographyState {
  currentStep: number // 0-5
  scaleMethod: ScaleMethod | null
  scaleConfig: ScaleConfig | null
  headingFont: FontSelection | null
  bodyFont: FontSelection | null
  monoFont: FontSelection | null
  scaleSteps: ScaleStep[]
  elementMappings: ElementMapping[]
  spacingSteps: SpacingStep[]
}

const initialState: TypographyState = {
  currentStep: 0,
  scaleMethod: null,
  scaleConfig: null,
  headingFont: null,
  bodyFont: null,
  monoFont: null,
  scaleSteps: [],
  elementMappings: [],
  spacingSteps: [],
}

// --- Actions ---

type Action =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_SCALE_METHOD'; method: ScaleMethod }
  | { type: 'CLEAR_SCALE_METHOD' }
  | { type: 'SET_SCALE_CONFIG'; config: ScaleConfig }
  | { type: 'SET_HEADING_FONT'; font: FontSelection }
  | { type: 'SET_BODY_FONT'; font: FontSelection }
  | { type: 'SET_MONO_FONT'; font: FontSelection | null }
  | { type: 'SET_ELEMENT_MAPPINGS'; mappings: ElementMapping[] }
  | { type: 'LOAD_PAIRING'; pairing: FontPairing }
  | { type: 'GO_NEXT' }
  | { type: 'GO_BACK' }

// --- Helpers ---

function computeScaleSteps(config: ScaleConfig): ScaleStep[] {
  switch (config.method) {
    case 'modular-scale':
      return computeModularScale(config)
    case 'utopia-fluid':
      return computeFluidScale(config)
    case 'tailwind':
      return computeTailwindScale(config)
    default:
      return []
  }
}

function computeSpacing(config: ScaleConfig): SpacingStep[] {
  switch (config.method) {
    case 'modular-scale':
      return computeSpacingScale(config.baseSize, config.ratio)
    case 'utopia-fluid':
      return computeSpacingScale(
        config.maxBaseSize,
        config.maxRatio,
        config.minViewport,
        config.maxViewport,
        config.minBaseSize,
        config.minRatio,
      )
    case 'tailwind':
      return computeSpacingScale(16, 1.25)
    default:
      return computeSpacingScale(16, 1.25)
  }
}

function recomputeDerived(config: ScaleConfig) {
  const scaleSteps = computeScaleSteps(config)
  const elementMappings = getDefaultElementMappings(scaleSteps)
  const spacingSteps = computeSpacing(config)
  return { scaleSteps, elementMappings, spacingSteps }
}

function getDefaultConfigForMethod(method: ScaleMethod): ScaleConfig {
  switch (method) {
    case 'modular-scale':
      return {
        method: 'modular-scale',
        baseSize: 16,
        ratio: 1.2,
        stepsAbove: 6,
        stepsBelow: 2,
      }
    case 'utopia-fluid':
      return {
        method: 'utopia-fluid',
        minViewport: 320,
        maxViewport: 1440,
        minBaseSize: 16,
        maxBaseSize: 20,
        minRatio: 1.2,
        maxRatio: 1.333,
        steps: 5,
      }
    case 'tailwind':
      return {
        method: 'tailwind',
        overrides: {},
        useFluid: false,
      }
    default:
      return {
        method: 'modular-scale',
        baseSize: 16,
        ratio: 1.2,
        stepsAbove: 6,
        stepsBelow: 2,
      }
  }
}

function getDefaultConfigForPairing(pairing: FontPairing): ScaleConfig {
  return getDefaultConfigForMethod(pairing.method)
}

// --- Reducer ---

function reducer(state: TypographyState, action: Action): TypographyState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: Math.max(0, Math.min(5, action.step)) }

    case 'SET_SCALE_METHOD': {
      const config = getDefaultConfigForMethod(action.method)
      const derived = recomputeDerived(config)
      return {
        ...state,
        scaleMethod: action.method,
        scaleConfig: config,
        ...derived,
      }
    }

    case 'CLEAR_SCALE_METHOD':
      return {
        ...state,
        scaleMethod: null,
        scaleConfig: null,
        scaleSteps: [],
        elementMappings: [],
        spacingSteps: [],
      }

    case 'SET_SCALE_CONFIG': {
      const derived = recomputeDerived(action.config)
      return {
        ...state,
        scaleConfig: action.config,
        scaleMethod: action.config.method,
        ...derived,
      }
    }

    case 'SET_HEADING_FONT':
      return { ...state, headingFont: action.font }

    case 'SET_BODY_FONT':
      return { ...state, bodyFont: action.font }

    case 'SET_MONO_FONT':
      return { ...state, monoFont: action.font }

    case 'SET_ELEMENT_MAPPINGS':
      return { ...state, elementMappings: action.mappings }

    case 'LOAD_PAIRING': {
      const pairing = action.pairing
      const config = getDefaultConfigForPairing(pairing)
      const derived = recomputeDerived(config)
      return {
        ...state,
        scaleMethod: pairing.method,
        scaleConfig: config,
        headingFont: pairing.headingFont,
        bodyFont: pairing.bodyFont,
        monoFont: pairing.monoFont ?? null,
        currentStep: 2, // Jump to ScaleStep
        ...derived,
      }
    }

    case 'GO_NEXT':
      return { ...state, currentStep: Math.min(5, state.currentStep + 1) }

    case 'GO_BACK':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) }

    default:
      return state
  }
}

// --- Context ---

interface TypographyContextValue {
  state: TypographyState
  dispatch: React.Dispatch<Action>
  getSystem: () => TypographySystem | null
}

const TypographyContext = createContext<TypographyContextValue | null>(null)

export function TypographyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  function getSystem(): TypographySystem | null {
    if (!state.scaleConfig || !state.headingFont || !state.bodyFont || state.scaleSteps.length === 0) {
      return null
    }
    return {
      scaleConfig: state.scaleConfig,
      headingFont: state.headingFont,
      bodyFont: state.bodyFont,
      monoFont: state.monoFont,
      scaleSteps: state.scaleSteps,
      elementMappings: state.elementMappings,
      spacingSteps: state.spacingSteps,
    }
  }

  return (
    <TypographyContext.Provider value={{ state, dispatch, getSystem }}>
      {children}
    </TypographyContext.Provider>
  )
}

export function useTypography() {
  const ctx = useContext(TypographyContext)
  if (!ctx) {
    throw new Error('useTypography must be used within a TypographyProvider')
  }
  return ctx
}
