import { useState } from 'react';
import {
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useTaxonomyAdmin } from '@/admin/hooks/useTaxonomyAdmin';
import { Field, inputClass } from '@/admin/components/AdminField';
import SingleImageUpload from '@/admin/components/SingleImageUpload';
import { useToast } from '@/admin/context/ToastContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY_FORM = { name: '', image: '', description: '', hidden: false, displayOrder: 0 };

function OccasionModal({ occasion, onClose, onSave }) {
  const [form, setForm] = useState(occasion ? { ...EMPTY_FORM, ...occasion } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSave = async () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Occasion name is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[90svh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg text-brown">{occasion ? 'Edit Occasion' : 'Add Occasion'}</p>
          <button onClick={onClose} aria-label="Close"><HiOutlineXMark className="text-text/50" /></button>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Occasion Name">
            <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </Field>
          <Field label="Slug (auto-generated)">
            <p className="rounded-xl border border-border bg-beige/40 px-4 py-2.5 text-sm text-text/60">
              {form.slug || slugify(form.name) || '—'}
            </p>
          </Field>
          <Field label="Occasion Image">
            <SingleImageUpload value={form.image} onChange={(path) => set('image', path)} entityType="occasions" />
          </Field>
          <Field label="Description">
            <textarea rows={2} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Display Order">
              <input type="number" min="0" className={inputClass} value={form.displayOrder} onChange={(e) => set('displayOrder', Number(e.target.value) || 0)} />
            </Field>
            <Field label="Status">
              <select className={inputClass} value={form.hidden ? 'hidden' : 'active'} onChange={(e) => set('hidden', e.target.value === 'hidden')}>
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </Field>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-brown hover:border-gold">Cancel</button>
          <button type="button" onClick={handleSave} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brown py-3 text-sm font-medium text-white hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60">
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OccasionManager() {
  const { items: occasions, loading, error, create, update, remove, toggleHidden } = useTaxonomyAdmin('occasions');
  const toast = useToast();
  const [modalFor, setModalFor] = useState(null);

  const handleSave = async (form) => {
    try {
      if (modalFor === 'new') {
        await create(form);
        toast.success('Occasion created.');
      } else {
        await update(modalFor.id, form);
        toast.success('Occasion updated.');
      }
      setModalFor(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save occasion.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this occasion? Products already assigned to it will keep the old value.')) return;
    try {
      await remove(id);
      toast.success('Occasion deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete occasion.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalogue</p>
          <h1 className="mt-2 font-heading text-3xl text-brown">Occasions ({occasions.length})</h1>
        </div>
        <button onClick={() => setModalFor('new')} className="flex w-fit items-center gap-1.5 rounded-full bg-brown px-5 py-3 text-sm font-medium text-white hover:bg-gold"><HiOutlinePlus /> Add Occasion</button>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="p-10 text-center text-sm text-text/50">Loading…</p>
      ) : occasions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="font-heading text-lg text-brown">No occasions yet</p>
          <p className="mt-1 text-sm text-text/50">Add an occasion to organize products by when they are worn.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <div key={occasion.id} className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="aspect-[3/1.4] bg-beige">
                <ImageWithFallback src={occasion.image} alt={occasion.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-heading text-brown">{occasion.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${occasion.hidden ? 'bg-beige text-text/50' : 'bg-green-50 text-green-700'}`}>{occasion.hidden ? 'Hidden' : 'Active'}</span>
                </div>
                {occasion.description && <p className="mt-1 line-clamp-2 text-xs text-text/50">{occasion.description}</p>}
                <p className="mt-1 text-xs text-text/50">Order {occasion.displayOrder ?? 0}</p>
                <div className="mt-3 flex items-center gap-3 text-text/50">
                  <button onClick={() => setModalFor(occasion)} className="hover:text-gold" aria-label="Edit"><HiOutlinePencilSquare /></button>
                  <button onClick={() => toggleHidden(occasion.id)} className="hover:text-gold" aria-label="Toggle visibility">{occasion.hidden ? <HiOutlineEye /> : <HiOutlineEyeSlash />}</button>
                  <button onClick={() => handleDelete(occasion.id)} className="hover:text-red-500" aria-label="Delete"><HiOutlineTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalFor && <OccasionModal occasion={modalFor === 'new' ? null : modalFor} onClose={() => setModalFor(null)} onSave={handleSave} />}
    </div>
  );
}
