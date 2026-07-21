import { useState } from 'react';
import { HiOutlineMapPin, HiOutlineTruck, HiOutlineArrowPath, HiOutlineBanknotes } from 'react-icons/hi2';

export default function PincodeChecker({ deliveryDays, codAvailable, returnDays }) {
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
        <p className="mt-3 text-xs text-gold">Delivery available at this pincode.</p>
      )}

      <div className="mt-4 space-y-2.5 border-t border-border pt-4">
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineTruck className="text-gold" />
          Estimated delivery in {deliveryDays} days
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineBanknotes className="text-gold" />
          {codAvailable ? 'Cash on Delivery available' : 'Prepaid orders only'}
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text/70">
          <HiOutlineArrowPath className="text-gold" />
          {returnDays}-day easy returns
        </div>
      </div>
    </div>
  );
}
