import { HiOutlineTruck, HiOutlineArrowPath, HiOutlineBanknotes } from 'react-icons/hi2';
import { SHIPPING_POLICY } from '@/data/shippingPolicy';

export default function PincodeChecker({ returnDays }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="space-y-2.5">
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
