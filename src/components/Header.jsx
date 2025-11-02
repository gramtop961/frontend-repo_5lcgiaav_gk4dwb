import { useState } from 'react';
import { Crown, KeyRound } from 'lucide-react';

export default function Header({ apiKey, onSaveKey }) {
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(!!apiKey);

  const handleSave = () => {
    onSaveKey(localKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-zinc-900 to-neutral-800 border border-zinc-700/60">
            <Crown className="text-amber-400" size={22} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Corporate Success Fantasy Generator
          </h1>
        </div>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Cinematic, luxurious, and self‑aware satire. Upload a photo, pick your scenes, and let the jet fuel your legend.
        </p>
      </div>

      <div className="w-full md:w-auto">
        <label className="text-xs uppercase text-zinc-400 tracking-wider">Google Gemini API Key</label>
        <div className="mt-2 flex items-center gap-2">
          <div className="relative flex-1 md:w-96">
            <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              className="w-full bg-zinc-900/70 border border-zinc-700/60 rounded-lg px-9 py-2 outline-none focus:ring-2 focus:ring-amber-500/40"
              placeholder="Paste your API key"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-medium shadow hover:brightness-110 transition"
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">Key is stored only in this browser session.</p>
      </div>
    </header>
  );
}
