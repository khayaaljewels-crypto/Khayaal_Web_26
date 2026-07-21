import { useEffect, useState } from 'react';
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCheckCircle } from 'react-icons/hi2';
import { api } from '@/utils/apiClient';
import AddressModal from '@/components/account/AddressModal';
import Reveal from '@/components/animations/Reveal';

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(null); // null | 'new' | address object

  const load = async () => {
    setLoading(true);
    const { addresses: fetched } = await api.get('/api/me/addresses');
    setAddresses(fetched);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (form) => {
    if (modalOpen === 'new') {
      await api.post('/api/me/addresses', form);
    } else {
      await api.put(`/api/me/addresses/${modalOpen.id}`, form);
    }
    setModalOpen(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    await api.delete(`/api/me/addresses/${id}`);
    load();
  };

  const handleSetDefault = async (id) => {
    await api.post(`/api/me/addresses/${id}/default`);
    load();
  };

  return (
    <div>
      <Reveal className="flex items-center justify-between">
        <p className="font-heading text-lg text-brown">Saved Addresses</p>
        <button onClick={() => setModalOpen('new')} className="flex items-center gap-1.5 rounded-full bg-brown px-4 py-2 text-xs font-medium text-white hover:bg-gold">
          <HiOutlinePlus /> Add Address
        </button>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {loading && <p className="text-sm text-text/50">Loading...</p>}
        {!loading && addresses.length === 0 && (
          <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text/50 sm:col-span-2">
            No saved addresses yet.
          </p>
        )}
        {addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-heading text-brown">
                {a.label} {a.isDefault && <span className="ml-1.5 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">Default</span>}
              </p>
              <div className="flex items-center gap-2 text-text/40">
                {!a.isDefault && (
                  <button onClick={() => handleSetDefault(a.id)} aria-label="Set default" className="hover:text-gold">
                    <HiOutlineCheckCircle />
                  </button>
                )}
                <button onClick={() => setModalOpen(a)} aria-label="Edit" className="hover:text-gold"><HiOutlinePencilSquare /></button>
                <button onClick={() => handleDelete(a.id)} aria-label="Delete" className="hover:text-red-500"><HiOutlineTrash /></button>
              </div>
            </div>
            <p className="mt-2 text-sm text-brown">{a.recipientName} · {a.recipientPhone}</p>
            <p className="mt-1 text-xs text-text/60">
              {a.address}{a.landmark && `, Near ${a.landmark}`}, {a.city}, {a.state} - {a.pincode}
            </p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AddressModal
          initial={modalOpen === 'new' ? null : modalOpen}
          onClose={() => setModalOpen(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
