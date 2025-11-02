import { useMemo } from 'react';
import { Check, Loader2, Wand2 } from 'lucide-react';

export default function ScenesSelector({ scenes, selected, setSelected, canGenerate, isGenerating, progress, onGenerate, onClear }) {
  const allSelected = useMemo(() => selected.length === scenes.length, [selected, scenes]);

  const toggle = (key) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((k) => k !== key));
    } else {
      setSelected([...selected, key]);
    }
  };

  const toggleAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(scenes.map((s) => s.key));
  };

  return (
    <div className="rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-950 to-zinc-900/70 p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-zinc-300">2. Choose your cinematic scenes</h3>
        <button
          onClick={toggleAll}
          className="text-xs px-3 py-1.5 rounded-md border border-zinc-700/70 hover:border-zinc-600 text-zinc-300 bg-zinc-900/70"
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
      </div>

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scenes.map((s) => {
          const active = selected.includes(s.key);
          return (
            <li key={s.key}>
              <button
                onClick={() => toggle(s.key)}
                className={`w-full text-left rounded-xl border p-4 transition ${
                  active
                    ? 'border-amber-500/60 bg-zinc-900/90'
                    : 'border-zinc-700/60 bg-zinc-900/60 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-5 w-5 rounded-md border flex items-center justify-center ${
                    active ? 'border-amber-500/60 bg-amber-500/20' : 'border-zinc-700/70'
                  }`}>
                    {active && <Check size={14} className="text-amber-400" />}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{s.label}</div>
                    <div className="text-xs text-zinc-400 mt-1">{s.hint}</div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition shadow ${
            canGenerate
              ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-black hover:brightness-110'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating {progress.done}/{progress.total}
            </>
          ) : (
            <>
              <Wand2 size={16} /> Generate selected scenes
            </>
          )}
        </button>
        <button
          onClick={onClear}
          className="text-sm px-3 py-2 rounded-lg border border-zinc-700/60 hover:border-zinc-600 text-zinc-300 bg-zinc-900/70"
        >
          Clear results
        </button>
      </div>

      <p className="mt-3 text-xs text-zinc-500">Tip: For satire, pick at least two scenes. Humor scales with overachievement.</p>
    </div>
  );
}
