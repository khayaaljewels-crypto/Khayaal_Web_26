import { useState } from 'react';
import { api } from '@/utils/apiClient';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { Field, inputClass } from '@/admin/components/AdminField';
import Reveal from '@/components/animations/Reveal';
import { useToast } from '@/context/ToastContext';

export default function MyProfile() {
  const { user, refresh } = useCustomerAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/me', { fullName, phone });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(err.message || 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Reveal className="rounded-2xl border border-border bg-white p-6 sm:p-8">
      <p className="font-heading text-lg text-brown">My Profile</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full Name">
          <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Field>
        <Field label="Email">
          <input className={`${inputClass} bg-beige/40 text-text/50`} value={user?.email ?? ''} disabled />
        </Field>
        <Field label="Phone Number">
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
        </Field>
        <div className="flex items-end gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="rounded-full bg-brown px-6 py-2.5 text-sm font-medium text-white hover:bg-gold disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && <span className="text-xs text-green-600">Saved.</span>}
        </div>
      </form>
      <p className="mt-6 text-xs text-text/40">
        Your default delivery address is managed separately under Saved Addresses.
      </p>
    </Reveal>
  );
}
