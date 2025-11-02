export default function UploadSection({ onFileSelect, previewUrl, error }) {
  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      onFileSelect(null, 'Please upload a JPG or PNG image.')
      return
    }
    onFileSelect(file, null)
  }

  return (
    <section className="w-full max-w-3xl mx-auto text-center space-y-4">
      <div>
        <label className="inline-flex items-center justify-center px-6 py-4 rounded-xl cursor-pointer bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleChange}
          />
          Upload Your Photo
        </label>
      </div>
      {error && (
        <p className="text-sm text-rose-200">{error}</p>
      )}
      {previewUrl && (
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-[400px] w-full rounded-lg border border-white/20 shadow-md"
          />
        </div>
      )}
    </section>
  )
}
