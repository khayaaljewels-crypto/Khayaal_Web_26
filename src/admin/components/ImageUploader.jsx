import { useRef, useState } from 'react';
import { Reorder } from 'framer-motion';
import {
  HiOutlineCloudArrowUp,
  HiOutlineTrash,
  HiOutlineStar,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import { api } from '@/utils/apiClient';
import { useToast } from '@/admin/context/ToastContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_ATTR = 'image/jpeg,image/png,image/webp';
const MAX_SIZE = 10 * 1024 * 1024;

function validateFiles(files) {
  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `"${file.name}" isn't a supported format — use JPEG, PNG, or WEBP.`;
    }
    if (file.size > MAX_SIZE) {
      return `"${file.name}" is larger than the 10 MB limit.`;
    }
  }
  return '';
}

// Drag-and-drop product image manager backed by the real upload API —
// every image here is already stored on the server (uploads/products/**)
// and tracked in Postgres (product_images); nothing is a pasted URL.
export default function ImageUploader({ productId, folder, images, onImagesChange, onUploadingChange }) {
  const toast = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [cacheBust, setCacheBust] = useState({});
  const [replacingId, setReplacingId] = useState(null);
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const reorderTimeout = useRef(null);

  const setUploadingState = (value) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;
    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setUploadingState(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('folder', folder || 'uncategorized');
      const { images: created } = await api.upload(`/api/admin/products/${productId}/images`, formData);
      onImagesChange([...images, ...created]);
      toast.success(created.length > 1 ? `${created.length} images uploaded.` : 'Image uploaded.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setUploadingState(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  const handleReorder = (newOrder) => {
    onImagesChange(newOrder);
    clearTimeout(reorderTimeout.current);
    reorderTimeout.current = setTimeout(async () => {
      try {
        const { images: confirmed } = await api.put(`/api/admin/products/${productId}/images/reorder`, {
          order: newOrder.map((img) => img.id),
        });
        onImagesChange(confirmed);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    }, 400);
  };

  const handleSetThumbnail = async (id) => {
    try {
      const { images: updated } = await api.put(`/api/admin/images/${id}/thumbnail`, {});
      onImagesChange(updated);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    try {
      await api.delete(`/api/admin/images/${id}`);
      onImagesChange(images.filter((img) => img.id !== id));
      toast.success('Image deleted.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleReplaceClick = (id) => {
    setReplacingId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !replacingId) return;
    const validationError = validateFiles([file]);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      const { image } = await api.uploadPut(`/api/admin/images/${replacingId}/replace`, formData);
      setCacheBust((prev) => ({ ...prev, [image.id]: Date.now() }));
      onImagesChange(images.map((img) => (img.id === image.id ? image : img)));
      toast.success('Image replaced.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setReplacingId(null);
    }
  };

  const displaySrc = (img) => (cacheBust[img.id] ? `${img.url}?t=${cacheBust[img.id]}` : img.url);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          dragOver ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'
        }`}
      >
        <HiOutlineCloudArrowUp className="mx-auto text-3xl text-gold" />
        <p className="mt-2 text-sm font-medium text-brown">
          {uploading ? 'Uploading...' : 'Drag & drop images here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-text/40">JPEG, PNG, or WEBP — up to 10 MB each. Multiple files allowed.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_ATTR}
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>
      <input ref={replaceInputRef} type="file" accept={ACCEPTED_ATTR} className="hidden" onChange={handleReplaceFile} />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {images.length > 0 && (
        <>
          <p className="mt-4 text-xs text-text/50">Drag to reorder — the first image is the main product image.</p>
          <Reorder.Group
            as="div"
            axis="x"
            values={images}
            onReorder={handleReorder}
            className="mt-2 flex flex-wrap gap-3"
          >
            {images.map((img) => (
              <Reorder.Item
                key={img.id}
                value={img}
                as="div"
                className="group relative h-24 w-24 shrink-0 cursor-grab overflow-hidden rounded-xl border-2 border-border bg-beige active:cursor-grabbing"
              >
                <ImageWithFallback src={displaySrc(img)} alt="" className="h-full w-full object-cover" draggable={false} />
                {img.isThumbnail && (
                  <span className="absolute left-1 top-1 rounded-full bg-gold px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    Main
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-brown/60 opacity-0 transition-opacity group-hover:opacity-100">
                  {!img.isThumbnail && (
                    <button
                      type="button"
                      onClick={() => handleSetThumbnail(img.id)}
                      aria-label="Set as main image"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brown hover:text-gold"
                    >
                      <HiOutlineStar className="text-sm" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleReplaceClick(img.id)}
                    aria-label="Replace image"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brown hover:text-gold"
                  >
                    <HiOutlineArrowPath className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    aria-label="Delete image"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 hover:text-red-600"
                  >
                    <HiOutlineTrash className="text-sm" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </>
      )}
    </div>
  );
}
