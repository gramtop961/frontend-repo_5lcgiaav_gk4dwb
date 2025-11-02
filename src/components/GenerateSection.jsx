export default function GenerateSection({ disabled, onGenerate, isGenerating }) {
  return (
    <section className="w-full max-w-3xl mx-auto text-center mt-6">
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        Generate: Private Jet Scene
      </button>

      {isGenerating && (
        <div className="mt-4 flex items-center justify-center gap-3 text-indigo-100">
          <span className="h-5 w-5 border-2 border-white/30 border-t-white/90 rounded-full animate-spin"></span>
          <span className="text-sm md:text-base">Generating your success fantasy...</span>
        </div>
      )}
    </section>
  )
}
