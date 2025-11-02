import { useState, useEffect } from 'react'

export default function Header({ apiKey, onSaveKey }) {
  const [localKey, setLocalKey] = useState(apiKey || '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLocalKey(apiKey || '')
  }, [apiKey])

  const handleSave = () => {
    onSaveKey(localKey.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <header className="w-full max-w-5xl mx-auto text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">MOTIVATOR 3000</h1>
        <p className="text-base md:text-lg text-indigo-100/90">Transform yourself into aspirational scenarios</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-3 md:gap-4 justify-center">
        <label htmlFor="apiKey" className="text-sm font-medium text-white/90">Google Gemini API Key</label>
        <input
          id="apiKey"
          type="password"
          value={localKey}
          onChange={(e) => setLocalKey(e.target.value)}
          placeholder="Paste your API key"
          className="w-full md:w-96 px-3 py-2 rounded-lg bg-white/90 text-gray-900 outline-none focus:ring-2 ring-indigo-400 shadow-sm"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow hover:opacity-95 active:opacity-90"
        >
          Save Key
        </button>
        {saved && <span className="text-sm text-emerald-200">Saved to this session</span>}
      </div>
    </header>
  )
}
