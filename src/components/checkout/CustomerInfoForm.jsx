import { useState } from 'react';
import GoldButton from '@/components/buttons/GoldButton';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra',
  'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other',
];

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-brown">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none';

export default function CustomerInfoForm({ initialValues, onSubmit }) {
  const [values, setValues] = useState(
    initialValues ?? {
      name: '',
      phone: '',
      whatsapp: '',
      sameAsPhone: true,
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      notes: '',
      agreeTerms: false,
    }
  );
  const [errors, setErrors] = useState({});

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Full name is required';
    if (!/^\d{10}$/.test(values.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    if (!values.sameAsPhone && !/^\d{10}$/.test(values.whatsapp.trim())) e.whatsapp = 'Enter a valid 10-digit WhatsApp number';
    if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) e.email = 'Enter a valid email address';
    if (!values.address.trim()) e.address = 'Delivery address is required';
    if (!values.city.trim()) e.city = 'City is required';
    if (!values.state.trim()) e.state = 'State is required';
    if (!/^\d{6}$/.test(values.pincode.trim())) e.pincode = 'Enter a valid 6-digit PIN code';
    if (!values.agreeTerms) e.agreeTerms = 'Please accept the Terms & Conditions to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...values, whatsapp: values.sameAsPhone ? values.phone : values.whatsapp });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-white p-6 sm:p-8">
      <p className="font-heading text-lg text-brown">Contact Details</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.name}>
          <input className={inputClass} value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="Anjali Nair" />
        </Field>
        <Field label="Mobile Number" required error={errors.phone}>
          <input
            className={inputClass}
            inputMode="numeric"
            maxLength={10}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
            placeholder="9876543210"
          />
        </Field>
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs text-text/70">
          <input type="checkbox" checked={values.sameAsPhone} onChange={(e) => set('sameAsPhone', e.target.checked)} />
          WhatsApp number is the same as mobile number
        </label>
        {!values.sameAsPhone && (
          <div className="mt-3">
            <Field label="WhatsApp Number" required error={errors.whatsapp}>
              <input
                className={inputClass}
                inputMode="numeric"
                maxLength={10}
                value={values.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
              />
            </Field>
          </div>
        )}
      </div>

      <Field label="Email (Optional)" error={errors.email}>
        <input className={inputClass} type="email" value={values.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" />
      </Field>

      <p className="pt-2 font-heading text-lg text-brown">Delivery Address</p>

      <Field label="Complete Address" required error={errors.address}>
        <textarea
          className={inputClass}
          rows={3}
          value={values.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder="House / Flat No., Street, Area"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="City" required error={errors.city}>
          <input className={inputClass} value={values.city} onChange={(e) => set('city', e.target.value)} placeholder="Kozhikode" />
        </Field>
        <Field label="State" required error={errors.state}>
          <select className={inputClass} value={values.state} onChange={(e) => set('state', e.target.value)}>
            <option value="">Select</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="PIN Code" required error={errors.pincode}>
          <input
            className={inputClass}
            inputMode="numeric"
            maxLength={6}
            value={values.pincode}
            onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
            placeholder="673001"
          />
        </Field>
      </div>

      <Field label="Landmark (Optional)">
        <input className={inputClass} value={values.landmark} onChange={(e) => set('landmark', e.target.value)} placeholder="Near..." />
      </Field>

      <Field label="Order Notes (Optional)">
        <textarea
          className={inputClass}
          rows={2}
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Gift wrap, delivery instructions, etc."
        />
      </Field>

      <div>
        <label className="flex items-start gap-2 text-xs text-text/70">
          <input
            type="checkbox"
            checked={values.agreeTerms}
            onChange={(e) => set('agreeTerms', e.target.checked)}
            className="mt-0.5"
          />
          I agree to the Terms &amp; Conditions and Privacy Policy.
        </label>
        {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
      </div>

      <GoldButton type="submit" className="w-full justify-center">
        Continue to Order Review
      </GoldButton>
    </form>
  );
}
