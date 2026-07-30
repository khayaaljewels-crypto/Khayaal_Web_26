import { useRef, useState } from 'react';
import { HiOutlineCloudArrowUp, HiOutlineTrash, HiOutlineArrowPath } from 'react-icons/hi2';
import { api } from '@/utils/apiClient';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_ATTR = 'image/jpeg,image/png,image/webp';
const MAX_SIZE = 10 * 1024 * 1024;

function validateFile(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" isn't a supported format — use JPEG, PNG, or WEBP.`;
  }
  if (file.size > MAX_SIZE) {
    return `"${file.name}" is larger than the 10 MB limit.`;
  }
  return '';
}

// Single-image drag-and-drop uploader for entities that only need one
// picture (category tile, collection banner, occasion tile). Product
// galleries use the separate multi-image `ImageUploader` component.
export default function SingleImageUpload({ value, onChange, entityType, error, aspectClass = 'aspect-video' }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState('');
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError('');
    setUploading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const result = await api.uploadWithProgress(`/api/admin/uploads/${entityType}`, formData, setProgress);
      onChange(result.url);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) uploadFile(file);
  };

  const showError = error || localError;

  if (value && !uploading) {
    return (
      <div>
        <div className={`group relative ${aspectClass} overflow-hidden rounded-2xl border ${showError ? 'border-red-300' : 'border-border'} bg-beige`}>
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brown/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-brown hover:text-gold"
            >
              <HiOutlineArrowPath /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600"
            >
              <HiOutlineTrash /> Remove
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED_ATTR} className="hidden" onChange={handleSelect} />
        {showError && <p className="mt-1.5 text-xs text-red-500">{showError}</p>}
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`flex ${aspectClass} cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-colors ${
          showError ? 'border-red-300 bg-red-50/40' : dragOver ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'
        }`}
      >
        {uploading ? (
          <>
            <p className="text-sm font-medium text-brown">Uploading... {progress}%</p>
            <div className="mt-3 h-1.5 w-32 overflow-hidden rounded-full bg-beige">
              <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <>
            <HiOutlineCloudArrowUp className="text-2xl text-gold" />
            <p className="mt-2 text-xs font-medium text-brown">Drag &amp; drop, or click to browse</p>
            <p className="mt-1 text-[11px] text-text/40">JPEG, PNG, or WEBP — up to 10 MB</p>
          </>
        )}
        <input ref={inputRef} type="file" accept={ACCEPTED_ATTR} className="hidden" onChange={handleSelect} />
      </div>
      {showError && <p className="mt-1.5 text-xs text-red-500">{showError}</p>}
    </div>
  );
}
