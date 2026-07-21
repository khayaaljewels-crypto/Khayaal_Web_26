const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700',
  Confirmed: 'bg-blue-50 text-blue-700',
  Processing: 'bg-indigo-50 text-indigo-700',
  Ready: 'bg-purple-50 text-purple-700',
  Completed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-beige text-brown'}`}>
      {status}
    </span>
  );
}
