import { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash, HiOutlineXMark } from 'react-icons/hi2';
import { useTaxonomyAdmin } from '@/admin/hooks/useTaxonomyAdmin';
import { Field, inputClass } from '@/admin/components/AdminField';
import SingleImageUpload from '@/admin/components/SingleImageUpload';
import { useToast } from '@/admin/context/ToastContext';

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY_FORM = { name: '', description: '', image: '', hidden: false, displayOrder: 0 };

function CollectionModal({ collection, onClose, onSave }) {
  const [form, setForm] = useState(collection ? { ...EMPTY_FORM, ...collection } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Collection name is required.';
    if (!form.image) nextErrors.image = 'Collection banner is required.';
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
      <div
        className="max-h-[90svh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg text-brown">{collection ? 'Edit Collection' : 'Add Collection'}</p>
          <button onClick={onClose} aria-label="Close"><HiOutlineXMark className="text-text/50" /></button>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Collection Name">
            <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. The Festive Edit" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </Field>
          <Field label="Slug (auto-generated)">
            <p className="rounded-xl border border-border bg-beige/40 px-4 py-2.5 text-sm text-text/60">
              {form.slug || slugify(form.name) || '—'}
            </p>
          </Field>
          <Field label="Collection Banner">
            <SingleImageUpload value={form.image} onChange={(url) => set('image', url)} entityType="collections" error={errors.image} aspectClass="aspect-21/9" />
          </Field>
          <Field label="Collection Description">
            <textarea rows={2} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Display Order">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={form.displayOrder}
                onChange={(e) => set('displayOrder', Number(e.target.value) || 0)}
              />
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
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-border py-3 text-sm font-medium text-brown hover:border-gold">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brown py-3 text-sm font-medium text-white hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CollectionManager() {
  const { items: collections, loading, error, create, update, remove, toggleHidden } = useTaxonomyAdmin('collections');
  const toast = useToast();
  const [modalFor, setModalFor] = useState(null); // null closed, 'new', or collection object

  const handleSave = async (form) => {
    try {
      if (modalFor === 'new') {
        await create(form);
        toast.success('Collection created.');
      } else {
        await update(modalFor.id, form);
        toast.success('Collection updated.');
      }
      setModalFor(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save collection.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collection? Products already assigned to it will keep the old value.')) return;
    try {
      await remove(id);
      toast.success('Collection deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete collection.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalogue</p>
          <h1 className="mt-2 font-heading text-3xl text-brown">Collections ({collections.length})</h1>
        </div>
        <button onClick={() => setModalFor('new')} className="flex w-fit items-center gap-1.5 rounded-full bg-brown px-5 py-3 text-sm font-medium text-white hover:bg-gold">
          <HiOutlinePlus /> Add Collection
        </button>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="p-10 text-center text-sm text-text/50">Loading…</p>
      ) : collections.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="font-heading text-lg text-brown">No collections yet</p>
          <p className="mt-1 text-sm text-text/50">Add your first collection to start curating themed product groups.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="aspect-21/9 bg-beige">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-text/30">No banner</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-heading text-brown">{c.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${c.hidden ? 'bg-beige text-text/50' : 'bg-green-50 text-green-700'}`}>
                    {c.hidden ? 'Hidden' : 'Active'}
                  </span>
                </div>
                {c.description && <p className="mt-1 line-clamp-2 text-xs text-text/50">{c.description}</p>}
                <p className="mt-1 text-xs text-text/50">Order {c.displayOrder ?? 0}</p>
                <div className="mt-3 flex items-center gap-3 text-text/50">
                  <button onClick={() => setModalFor(c)} className="hover:text-gold" aria-label="Edit"><HiOutlinePencilSquare /></button>
                  <button onClick={() => toggleHidden(c.id)} className="hover:text-gold" aria-label="Toggle visibility">
                    {c.hidden ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="hover:text-red-500" aria-label="Delete"><HiOutlineTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalFor && (
        <CollectionModal collection={modalFor === 'new' ? null : modalFor} onClose={() => setModalFor(null)} onSave={handleSave} />
      )}
    </div>
  );
}
