import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';
import { Field, inputClass } from '@/admin/components/AdminField';

function StoreSettingsForm() {
  const { settings, updateSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <p className="font-heading text-lg text-brown">Store Information</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Store Name"><input className={inputClass} value={form.storeName} onChange={(e) => set('storeName', e.target.value)} /></Field>
        <Field label="Contact Number"><input className={inputClass} value={form.contactNumber} onChange={(e) => set('contactNumber', e.target.value)} /></Field>
        <Field label="WhatsApp Number (country code, no +)"><input className={inputClass} value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="919037246978" /></Field>
        <Field label="Email"><input type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label="Address" className="sm:col-span-2"><input className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
        <Field label="Instagram URL"><input className={inputClass} value={form.instagram} onChange={(e) => set('instagram', e.target.value)} /></Field>
        <Field label="Facebook URL"><input className={inputClass} value={form.facebook} onChange={(e) => set('facebook', e.target.value)} /></Field>
        <Field label="Pinterest URL"><input className={inputClass} value={form.pinterest} onChange={(e) => set('pinterest', e.target.value)} /></Field>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" className="rounded-full bg-brown px-6 py-2.5 text-sm font-medium text-white hover:bg-gold">Save Changes</button>
        {saved && <span className="text-xs text-green-600">Saved.</span>}
      </div>
    </form>
  );
}

function ChangePasswordForm() {
  const { changePassword } = useAdminAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (next !== confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const result = await changePassword(current, next);
    if (result.ok) {
      setMessage({ type: 'success', text: 'Password updated.' });
      setCurrent(''); setNext(''); setConfirm('');
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <p className="font-heading text-lg text-brown">Change Admin Password</p>
      <Field label="Current Password"><input type="password" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
      <Field label="New Password"><input type="password" className={inputClass} value={next} onChange={(e) => setNext(e.target.value)} /></Field>
      <Field label="Confirm New Password"><input type="password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
      {message && (
        <p className={`text-xs ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>{message.text}</p>
      )}
      <button type="submit" className="rounded-full bg-brown px-6 py-2.5 text-sm font-medium text-white hover:bg-gold">Update Password</button>
      <p className="text-[11px] leading-relaxed text-text/40">
        Reminder: this password gate runs entirely in the browser — it deters casual access but is not real
        security against someone with devtools access to this device.
      </p>
    </form>
  );
}

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Configuration</p>
        <h1 className="mt-2 font-heading text-3xl text-brown">Settings</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <StoreSettingsForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
