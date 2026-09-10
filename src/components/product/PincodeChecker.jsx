import { useState } from 'react';
import { HiOutlineMapPin, HiOutlineTruck, HiOutlineArrowPath, HiOutlineBanknotes } from 'react-icons/hi2';
import { SHIPPING_POLICY } from '@/data/shippingPolicy';

export default function PincodeChecker({ returnDays }) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setResult({ valid: false });
      return;
    }
    setResult({ valid: true });
  };

  return (
    <div className="rounded-2xl border border-border p-5">
      <form onSubmit={handleCheck} className="flex items-center gap-2">
        <div className="relative flex-1">
          <HiOutlineMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter delivery pincode"
            className="w-full rounded-full border border-border py-2.5 pl-9 pr-4 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-brown px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-gold"
        >
          Check
        </button>
      </form>

      {result && !result.valid && (
        <p className="mt-3 text-xs text-red-500">Please enter a valid 6-digit pincode.</p>
      )}
      {result?.valid && (
        <p className="mt-3 text-xs text-gold">Free delivery is available at this pincode.</p>
      )}

      <div className="mt-4 space-y-2.5 border-t border-border pt-4">
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineTruck className="text-gold" />
          {SHIPPING_POLICY.freeShipping}
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineBanknotes className="text-gold" />
          {SHIPPING_POLICY.payment}
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineArrowPath className="text-gold" />
          {returnDays}-day easy returns
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineTruck className="text-gold" />
          {SHIPPING_POLICY.deliveryTimeline}
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineTruck className="text-gold" />
          {SHIPPING_POLICY.packaging}
        </div>
      </div>
    </div>
  );
}
