import { formatPrice } from './format';

export function buildWhatsAppOrderMessage(order) {
  const { id, customer, items, subtotal, discount, shippingFee, grandTotal, coupon, notes } = order;

  const productLines = items
    .map((item) => {
      const variantSuffix = item.variantLabel ? ` (${item.variantLabel})` : '';
      return `${item.name}${variantSuffix} ×${item.quantity} — ${formatPrice(item.lineTotal)}`;
    })
    .join('\n');

  const addressLines = [
    customer.address,
    customer.landmark ? `Near ${customer.landmark}` : null,
    `${customer.city}, ${customer.state} - ${customer.pincode}`,
  ]
    .filter(Boolean)
    .join('\n');

  const lines = [
    '🛍️ NEW KHAYAAL ORDER',
    '',
    `Order ID: ${id}`,
    '',
    'Customer:',
    customer.name,
    '',
    'Phone:',
    customer.phone,
    ...(customer.whatsapp && customer.whatsapp !== customer.phone ? ['', 'WhatsApp:', customer.whatsapp] : []),
    ...(customer.email ? ['', 'Email:', customer.email] : []),
    '',
    'Delivery Address:',
    addressLines,
    '',
    'Products:',
    '',
    productLines,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    ...(discount > 0 ? [`Discount (${coupon}): -${formatPrice(discount)}`] : []),
    `Shipping: ${shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}`,
    '',
    `Grand Total: ${formatPrice(grandTotal)}`,
    ...(notes ? ['', 'Notes:', notes] : []),
    '',
    `Date: ${new Date(order.createdAt).toLocaleString('en-IN')}`,
  ];

  return lines.join('\n');
}

export function buildWhatsAppOrderLink(order, whatsappNumber) {
  const message = encodeURIComponent(buildWhatsAppOrderMessage(order));
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}
