import { TypographyProvider } from './context/TypographyContext'
import { Wizard } from './components/Wizard'

function App() {
  return (
    <TypographyProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">TypeForge</h1>
            <span className="text-sm text-gray-500">Typography System Builder</span>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Wizard />
        </main>
        <footer className="border-t border-gray-200 px-6 py-4 mt-auto">
          <div className="max-w-6xl mx-auto text-sm text-gray-500">
            Built by <a href="https://ethanede.com" className="underline hover:text-gray-700">EE Creative</a> · Open source on GitHub
          </div>
        </footer>
      </div>
    </TypographyProvider>
  )
}

export default App
