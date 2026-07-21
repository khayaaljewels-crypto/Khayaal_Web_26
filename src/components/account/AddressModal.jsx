import { useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { Field, inputClass } from '@/admin/components/AdminField';

const EMPTY = { label: 'Home', recipientName: '', recipientPhone: '', address: '', city: '', state: '', pincode: '', landmark: '', isDefault: false };

export default function AddressModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-heading text-lg text-brown">{initial ? 'Edit Address' : 'Add Address'}</p>
          <button onClick={onClose}><HiOutlineXMark className="text-text/50" /></button>
        </div>
        <div className="mt-4 space-y-3">
          <Field label="Label">
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('label', l)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    form.label === l ? 'border-gold bg-gold/10 text-gold' : 'border-border text-brown/70'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Full Name"><input className={inputClass} value={form.recipientName} onChange={(e) => set('recipientName', e.target.value)} /></Field>
          <Field label="Phone"><input className={inputClass} value={form.recipientPhone} onChange={(e) => set('recipientPhone', e.target.value)} /></Field>
          <Field label="Address"><textarea rows={2} className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><input className={inputClass} value={form.city} onChange={(e) => set('city', e.target.value)} /></Field>
            <Field label="State"><input className={inputClass} value={form.state} onChange={(e) => set('state', e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="PIN Code"><input className={inputClass} value={form.pincode} onChange={(e) => set('pincode', e.target.value)} /></Field>
            <Field label="Landmark (Optional)"><input className={inputClass} value={form.landmark} onChange={(e) => set('landmark', e.target.value)} /></Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-text/70">
            <input type="checkbox" checked={Boolean(form.isDefault)} onChange={(e) => set('isDefault', e.target.checked)} />
            Set as default address
          </label>
        </div>
        <button
          onClick={() => onSave(form)}
          disabled={!form.recipientName?.trim() || !form.address?.trim()}
          className="mt-6 w-full rounded-full bg-brown py-3 text-sm font-medium text-white hover:bg-gold disabled:opacity-50"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}
