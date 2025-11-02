import { Image, Upload } from 'lucide-react';

export default function UploadSection({ onImageSelect, imagePreview }) {
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!valid.includes(file.type)) {
      alert('Please upload a JPG or PNG image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full rounded-2xl border border-zinc-700/60 bg-gradient-to-b from-zinc-950 to-zinc-900/70 p-5">
      <h3 className="text-sm font-medium text-zinc-300 mb-3">1. Upload a portrait</h3>
      <label className="block cursor-pointer">
        <div className="flex items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900/60 p-6 hover:border-zinc-600 transition">
          <Upload size={18} className="text-zinc-400" />
          <span className="text-sm text-zinc-300">Choose JPG or PNG</span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </label>

      {imagePreview ? (
        <div className="mt-4">
          <div className="text-xs text-zinc-400 mb-1">Preview</div>
          <div className="rounded-xl overflow-hidden border border-zinc-700/60 bg-black/40 inline-block max-w-full">
            <img src={imagePreview} alt="preview" className="max-w-[420px] w-full object-contain" />
          </div>
        </div>
      ) : (
        <div className="mt-4 text-xs text-zinc-500 flex items-center gap-2">
          <Image size={14} /> Recommended: well-lit, single-person portrait.
        </div>
      )}
    </div>
  );
}
