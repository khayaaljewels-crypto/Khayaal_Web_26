import { useState } from 'react';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash, HiOutlineXMark } from 'react-icons/hi2';
import { useCategories } from '@/context/CategoriesContext';
import { useProducts } from '@/context/ProductsContext';
import { Field, inputClass } from '@/admin/components/AdminField';

function CategoryModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(category ?? { name: '', image: '', description: '' });
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg text-brown">{category ? 'Edit Category' : 'Add Category'}</p>
          <button onClick={onClose}><HiOutlineXMark className="text-text/50" /></button>
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Name">
            <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Image URL">
            <input className={inputClass} value={form.image} onChange={(e) => set('image', e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea rows={2} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
        </div>
        <button
          onClick={() => onSave(form)}
          disabled={!form.name.trim()}
          className="mt-6 w-full rounded-full bg-brown py-3 text-sm font-medium text-white hover:bg-gold disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default function CategoryManager() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleHidden } = useCategories();
  const { products } = useProducts();
  const [modalFor, setModalFor] = useState(null); // null closed, 'new', or category object

  const countFor = (slug) => products.filter((p) => p.category === slug).length;

  const handleSave = (form) => {
    if (modalFor === 'new') addCategory(form);
    else updateCategory(modalFor.id, form);
    setModalFor(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category? Products already assigned to it will keep the old value.')) deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalogue</p>
          <h1 className="mt-2 font-heading text-3xl text-brown">Categories ({categories.length})</h1>
        </div>
        <button onClick={() => setModalFor('new')} className="flex items-center gap-1.5 rounded-full bg-brown px-5 py-3 text-sm font-medium text-white hover:bg-gold">
          <HiOutlinePlus /> Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="aspect-[3/1.4] bg-beige">
              {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" />}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-heading text-brown">{c.name}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${c.hidden ? 'bg-beige text-text/50' : 'bg-green-50 text-green-700'}`}>
                  {c.hidden ? 'Hidden' : 'Visible'}
                </span>
              </div>
              <p className="mt-1 text-xs text-text/50">{countFor(c.slug)} products</p>
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

      {modalFor && (
        <CategoryModal category={modalFor === 'new' ? null : modalFor} onClose={() => setModalFor(null)} onSave={handleSave} />
      )}
    </div>
  );
}
