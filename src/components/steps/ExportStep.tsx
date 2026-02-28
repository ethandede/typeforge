import { useState, useMemo } from 'react'
import { useTypography } from '../../context/TypographyContext'
import { generateCssCustomProperties } from '../../exporters/css-custom-properties'
import { generateTailwindConfig } from '../../exporters/tailwind-config'
import { generateClaudePrompt, generateGenericAiPrompt, generateSystemPromptSnippet } from '../../exporters/ai-prompt'

type Tab = 'css' | 'tailwind' | 'claude' | 'ai' | 'system'

const TABS: { key: Tab; label: string }[] = [
  { key: 'css', label: 'CSS' },
  { key: 'tailwind', label: 'Tailwind' },
  { key: 'claude', label: 'Claude Prompt' },
  { key: 'ai', label: 'AI Prompt' },
  { key: 'system', label: 'System Prompt' },
]

export function ExportStep() {
  const { getSystem } = useTypography()
  const [activeTab, setActiveTab] = useState<Tab>('css')
  const [copied, setCopied] = useState(false)

  const system = getSystem()

  const output = useMemo(() => {
    if (!system) return ''
    switch (activeTab) {
      case 'css':
        return generateCssCustomProperties(system)
      case 'tailwind':
        return generateTailwindConfig(system)
      case 'claude':
        return generateClaudePrompt(system)
      case 'ai':
        return generateGenericAiPrompt(system)
      case 'system':
        return generateSystemPromptSnippet(system)
      default:
        return ''
    }
  }, [system, activeTab])

  async function handleCopy() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement('textarea')
      textarea.value = output
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!system) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="mb-2">Complete the previous steps to generate export code.</p>
        <p className="text-sm">You need at least: fonts selected, a scale configured, and element mappings set.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export your system</h2>
        <p className="text-gray-600">
          Copy production-ready code or AI prompts to implement your typography system.
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setCopied(false) }}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            copied
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>

      <div className="relative">
        <pre className="bg-gray-950 text-gray-100 rounded-lg p-6 overflow-x-auto text-sm leading-relaxed font-mono max-h-[600px] overflow-y-auto">
          <code>{output}</code>
        </pre>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          {activeTab === 'css' && 'Paste this CSS into your project stylesheet. The @import loads fonts from Google Fonts automatically.'}
          {activeTab === 'tailwind' && 'Add this to your Tailwind CSS configuration file (tailwind.config.ts or CSS file with @theme). Requires Tailwind v4.'}
          {activeTab === 'claude' && 'Send this prompt to Claude to implement the typography system in your project. Works with Claude Code or the web interface.'}
          {activeTab === 'ai' && 'A generic version of the implementation prompt. Works with ChatGPT, Gemini, Copilot, or any AI assistant.'}
          {activeTab === 'system' && 'Add this to your CLAUDE.md or system prompt so your AI assistant knows about your typography system.'}
        </p>
      </div>
    </div>
  )
}
