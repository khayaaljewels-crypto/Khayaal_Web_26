const STATUS_STYLES = {
  New: 'bg-blue-50 text-blue-700',
  Confirmed: 'bg-indigo-50 text-indigo-700',
  Packing: 'bg-amber-50 text-amber-700',
  'Ready to Ship': 'bg-amber-50 text-amber-700',
  Shipped: 'bg-purple-50 text-purple-700',
  Delivered: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
  Returned: 'bg-red-50 text-red-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-beige text-brown'}`}>
      {status}
    </span>
  );
}
