export default function ResultsSection({ originalUrl, generatedUrl, onGenerateAgain }) {
  if (!generatedUrl) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = generatedUrl
    link.download = 'success-fantasy.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="w-full max-w-5xl mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <p className="mb-2 text-indigo-100 font-medium">Original Photo</p>
          <div className="flex justify-center">
            <img src={originalUrl} alt="Original" className="w-full max-w-md rounded-lg border border-white/20 shadow" />
          </div>
        </div>
        <div className="text-center">
          <p className="mb-2 text-indigo-100 font-medium">Your Success Fantasy</p>
          <div className="flex flex-col items-center gap-3">
            <img src={generatedUrl} alt="Generated" className="w-full max-w-md rounded-lg border border-white/20 shadow" />
            <div className="flex gap-3">
              <button onClick={handleDownload} className="px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold shadow hover:shadow-md">Download Image</button>
              <button onClick={onGenerateAgain} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow hover:opacity-95">Generate Again</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
