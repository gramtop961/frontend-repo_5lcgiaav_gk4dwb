import { Download, Loader2, RefreshCw } from 'lucide-react';

export default function ResultsGrid({ scenes, results, onRegenerate }) {
  const hasResults = Object.values(results).some((r) => r?.dataUrl || r?.loading || r?.error);

  if (!hasResults) return null;

  const download = (dataUrl, fileName) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  };

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-300">3. Results</h3>
        <p className="text-xs text-zinc-500">Click regenerate on any card to remix that scene.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {scenes.map((s) => {
          const r = results[s.key];
          if (!r) return null;
          return (
            <article key={s.key} className="rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-950 to-zinc-900/70 overflow-hidden">
              <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className="text-xs text-zinc-500">{s.hint}</div>
                </div>
                <div>
                  {r.loading && <Loader2 className="animate-spin text-zinc-400" size={18} />}
                </div>
              </div>

              <div className="p-4">
                {r.error && (
                  <div className="text-xs text-red-400 mb-3">{r.error}</div>
                )}

                {r.dataUrl ? (
                  <img src={r.dataUrl} alt={s.label} className="w-full h-auto rounded-lg border border-zinc-800/60" />
                ) : (
                  <div className="h-60 rounded-lg border border-dashed border-zinc-700/60 bg-zinc-900/50 flex items-center justify-center text-zinc-500 text-sm">
                    {r.loading ? 'Brewing luxury...' : 'No image yet'}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onRegenerate(s.key)}
                    className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700/60 hover:border-zinc-600 text-zinc-300 bg-zinc-900/70"
                  >
                    <RefreshCw size={16} /> Regenerate
                  </button>

                  {r.dataUrl && (
                    <button
                      onClick={() => download(r.dataUrl, `${s.key}.jpg`)}
                      className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 text-black font-medium hover:brightness-110"
                    >
                      <Download size={16} /> Download
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
