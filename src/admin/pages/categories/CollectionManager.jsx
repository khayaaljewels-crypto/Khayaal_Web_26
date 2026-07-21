import { useState } from 'react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { useCollections } from '@/context/CollectionsContext';
import { useProducts } from '@/context/ProductsContext';
import { inputClass } from '@/admin/components/AdminField';

export default function CollectionManager() {
  const { collections, addCollection, deleteCollection, toggleHidden } = useCollections();
  const { products } = useProducts();
  const [name, setName] = useState('');

  const countFor = (collectionName) => products.filter((p) => p.collection === collectionName).length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCollection(name.trim());
    setName('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this collection?')) deleteCollection(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Catalogue</p>
        <h1 className="mt-2 font-heading text-3xl text-brown">Collections ({collections.length})</h1>
      </div>

      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection name, e.g. Festive Edit"
          className={`max-w-xs ${inputClass}`}
        />
        <button type="submit" className="flex items-center gap-1.5 rounded-full bg-brown px-5 py-2.5 text-sm font-medium text-white hover:bg-gold">
          <HiOutlinePlus /> Add
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-text/40">
              <th className="p-4">Name</th>
              <th className="p-4">Products</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-b-0">
                <td className="p-4 font-medium text-brown">{c.name}</td>
                <td className="p-4 text-text/60">{countFor(c.name)}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${c.hidden ? 'bg-beige text-text/50' : 'bg-green-50 text-green-700'}`}>
                    {c.hidden ? 'Hidden' : 'Visible'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3 text-text/50">
                    <button onClick={() => toggleHidden(c.id)} className="hover:text-gold" aria-label="Toggle visibility">
                      {c.hidden ? <HiOutlineEye /> : <HiOutlineEyeSlash />}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="hover:text-red-500" aria-label="Delete"><HiOutlineTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
