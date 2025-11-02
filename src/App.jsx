import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import GenerateSection from './components/GenerateSection'
import ResultsSection from './components/ResultsSection'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('gemini_api_key')
    if (stored) setApiKey(stored)
  }, [])

  const onSaveKey = (key) => {
    setApiKey(key)
    if (key) sessionStorage.setItem('gemini_api_key', key)
    else sessionStorage.removeItem('gemini_api_key')
  }

  const onFileSelect = (newFile, err) => {
    setError(err || '')
    setGeneratedUrl('')
    if (!newFile) {
      setFile(null)
      setPreviewUrl('')
      return
    }
    setFile(newFile)
    const url = URL.createObjectURL(newFile)
    setPreviewUrl(url)
  }

  const canGenerate = useMemo(() => {
    return Boolean(apiKey && file && !isGenerating)
  }, [apiKey, file, isGenerating])

  const fileToBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        const base64 = result.split(',')[1]
        resolve(base64)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(f)
  })

  const onGenerate = async () => {
    if (!apiKey) {
      setError('Please add your API key above.')
      return
    }
    if (!file) {
      setError('Please upload a photo first.')
      return
    }

    setError('')
    setIsGenerating(true)
    setGeneratedUrl('')
    try {
      const base64 = await fileToBase64(file)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`
      const prompt = `Create a high-end corporate success fantasy scene. Compose an aspirational, cinematic image featuring the subject from the reference photo as a confident executive aboard a luxurious private jet. Lighting should be polished and professional, with tasteful luxury details (leather seats, soft window light, skyline hints). Maintain the person’s identity and overall style while elevating aesthetics. Photo-realistic, magazine quality.`

      const body = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: file.type || 'image/png',
                  data: base64,
                },
              },
            ],
          },
        ],
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to generate image')
      }

      const data = await res.json()
      // Try to locate an image in candidates -> parts -> inline_data
      const candidates = data.candidates || []
      let imagePart = null
      for (const c of candidates) {
        const parts = c?.content?.parts || []
        for (const p of parts) {
          if (p.inline_data && p.inline_data.data) {
            imagePart = p.inline_data
            break
          }
        }
        if (imagePart) break
      }

      if (!imagePart) {
        throw new Error('The API did not return an image.')
      }

      const mime = imagePart.mime_type || 'image/png'
      const dataUrl = `data:${mime};base64,${imagePart.data}`
      setGeneratedUrl(dataUrl)
    } catch (e) {
      console.error(e)
      setError('There was a problem generating the image. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onGenerateAgain = () => {
    setGeneratedUrl('')
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-[#0b1220] via-[#141b2d] to-[#2a145a] px-4 py-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
        <Header apiKey={apiKey} onSaveKey={onSaveKey} />

        <div className="w-full max-w-5xl space-y-8 text-center">
          <UploadSection onFileSelect={onFileSelect} previewUrl={previewUrl} error={error} />
          <GenerateSection disabled={!canGenerate} onGenerate={onGenerate} isGenerating={isGenerating} />
          {error && (
            <p className="text-rose-200 text-sm">{error}</p>
          )}
          <ResultsSection originalUrl={previewUrl} generatedUrl={generatedUrl} onGenerateAgain={onGenerateAgain} />
        </div>

        <footer className="text-xs text-indigo-100/60 mt-4">
          Built for inspiration. Images are generated with Google Gemini. Keep your API key private.
        </footer>
      </div>
    </div>
  )
}

export default App
