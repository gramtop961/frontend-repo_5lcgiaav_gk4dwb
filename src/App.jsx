import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import UploadSection from './components/UploadSection.jsx';
import ScenesSelector from './components/ScenesSelector.jsx';
import ResultsGrid from './components/ResultsGrid.jsx';

const SCENES = [
  {
    key: 'private_jet',
    label: 'Private Jet Arrival',
    hint: 'Silky tarmac reflections, designer weekender, champagne boarding.'
  },
  {
    key: 'boardroom_power',
    label: 'Boardroom Power Move',
    hint: 'Floor-to-ceiling glass, city skyline bokeh, decisive grin.'
  },
  {
    key: 'yacht_deal',
    label: 'Yacht Deck Deal',
    hint: 'Mediterranean teal water, linen suit, pen signing mid-sunset.'
  },
  {
    key: 'helipad_arrival',
    label: 'Helipad Arrival',
    hint: 'Rotor blur, golden-hour rim light, coat catching the wind.'
  },
  {
    key: 'ipo_bell',
    label: 'IPO Bell Ringing',
    hint: 'Confetti, ticker boards, humblebrag grin—satirical yet classy.'
  },
  {
    key: 'awards_roast',
    label: 'Awards Night Roast',
    hint: 'Black-tie crowd laughing, spotlight, gold-leaf backdrop.'
  }
];

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedScenes, setSelectedScenes] = useState([SCENES[0].key]);
  const [results, setResults] = useState({}); // { sceneKey: { dataUrl, loading, error } }
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    const stored = sessionStorage.getItem('GEMINI_API_KEY');
    if (stored) setApiKey(stored);
  }, []);

  const canGenerate = useMemo(
    () => !!apiKey && imageFile && selectedScenes.length > 0 && !isGenerating,
    [apiKey, imageFile, selectedScenes, isGenerating]
  );

  const handleSaveKey = (key) => {
    setApiKey(key);
    try {
      sessionStorage.setItem('GEMINI_API_KEY', key);
    } catch {}
  };

  const handleImageSelect = (file, previewUrl) => {
    setImageFile(file);
    setImagePreview(previewUrl);
    setResults({});
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          const base64 = result.split(',')[1] || result;
          resolve(base64);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const buildPrompt = (sceneLabel) => `Create a photo‑realistic, cinematic, luxury corporate satire scene: ${sceneLabel}.
- Keep subject recognizable from the provided photo. Maintain natural skin tone and identity.
- Funny, self-aware, satirical tone but tasteful and aspirational.
- Rich contrast, premium lighting (soft key + cinematic rim), creamy bokeh, subtle film grain.
- Ultra high-end styling: tailored wardrobe, premium materials, elegant color palette.
- No text or watermarks. 3:2 composition, shallow depth of field.`;

  const callGeminiImage = async (key, base64, sceneLabel) => {
    const prompt = buildPrompt(sceneLabel);
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inline_data: { mime_type: imageFile.type || 'image/jpeg', data: base64 } }
          ]
        }
      ]
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(key)}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    // Try to find base64 image in candidates parts
    const candidates = data.candidates || [];
    for (const c of candidates) {
      const parts = c.content?.parts || c.content || [];
      for (const p of parts) {
        if (p.inline_data?.data) {
          return `data:image/jpeg;base64,${p.inline_data.data}`;
        }
        if (p.inline_data?.mime_type && p.inline_data?.data) {
          return `data:${p.inline_data.mime_type};base64,${p.inline_data.data}`;
        }
        // Some responses may nest under p.data
        if (p.data && typeof p.data === 'string') {
          return `data:image/jpeg;base64,${p.data}`;
        }
      }
    }
    throw new Error('No image data returned by API');
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setProgress({ done: 0, total: selectedScenes.length });
    setResults(prev => {
      const next = { ...prev };
      selectedScenes.forEach(k => {
        next[k] = { dataUrl: null, loading: true, error: null };
      });
      return next;
    });

    try {
      const base64 = await fileToBase64(imageFile);
      for (const sceneKey of selectedScenes) {
        const scene = SCENES.find(s => s.key === sceneKey);
        try {
          const imgUrl = await callGeminiImage(apiKey, base64, scene?.label || sceneKey);
          setResults(prev => ({
            ...prev,
            [sceneKey]: { dataUrl: imgUrl, loading: false, error: null }
          }));
        } catch (err) {
          setResults(prev => ({
            ...prev,
            [sceneKey]: { dataUrl: null, loading: false, error: err.message || 'Failed' }
          }));
        } finally {
          setProgress(p => ({ ...p, done: p.done + 1 }));
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateOne = async (sceneKey) => {
    if (!apiKey || !imageFile) return;
    setResults(prev => ({ ...prev, [sceneKey]: { ...(prev[sceneKey]||{}), loading: true, error: null } }));
    try {
      const base64 = await fileToBase64(imageFile);
      const scene = SCENES.find(s => s.key === sceneKey);
      const imgUrl = await callGeminiImage(apiKey, base64, scene?.label || sceneKey);
      setResults(prev => ({ ...prev, [sceneKey]: { dataUrl: imgUrl, loading: false, error: null } }));
    } catch (err) {
      setResults(prev => ({ ...prev, [sceneKey]: { dataUrl: null, loading: false, error: err.message || 'Failed' } }));
    }
  };

  const clearResults = () => {
    setResults({});
    setProgress({ done: 0, total: 0 });
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0B0E] text-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[70%] rounded-full blur-3xl opacity-20" style={{
          background: 'radial-gradient(ellipse at center, #7C6A46 0%, transparent 60%)'
        }} />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-10 space-y-10">
        <Header apiKey={apiKey} onSaveKey={handleSaveKey} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UploadSection onImageSelect={handleImageSelect} imagePreview={imagePreview} />
          </div>
          <div className="lg:col-span-2">
            <ScenesSelector
              scenes={SCENES}
              selected={selectedScenes}
              setSelected={setSelectedScenes}
              canGenerate={canGenerate}
              isGenerating={isGenerating}
              progress={progress}
              onGenerate={handleGenerate}
              onClear={clearResults}
            />
          </div>
        </section>

        <ResultsGrid
          scenes={SCENES}
          results={results}
          onRegenerate={handleRegenerateOne}
        />
      </main>
    </div>
  );
}
