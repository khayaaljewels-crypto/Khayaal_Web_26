import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart, getItemPrice } from '@/context/CartContext';
import { useOrders } from '@/context/OrdersContext';
import { buildWhatsAppOrderLink } from '@/utils/buildWhatsAppOrderMessage';
import { useSettings } from '@/context/SettingsContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { api } from '@/utils/apiClient';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CustomerInfoForm from '@/components/checkout/CustomerInfoForm';
import OrderReview from '@/components/checkout/OrderReview';
import Reveal from '@/components/animations/Reveal';

export default function Checkout() {
  const { items, subtotal, discount, shippingFee, grandTotal, couponCode } = useCart();
  const { createOrder } = useOrders();
  const { settings } = useSettings();
  const { user: customerUser } = useCustomerAuth();
  const [step, setStep] = useState('info');
  const [customer, setCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handleInfoSubmit = (values) => {
    setCustomer(values);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    const order = createOrder({
      customer,
      items,
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      coupon: couponCode,
      notes: customer.notes,
    });

    // If the customer is signed in, also persist this order to their
    // permanent account history via the backend. This is best-effort and
    // additive — WhatsApp remains the actual order-confirmation channel with
    // the store, so a failure here (e.g. backend not running yet) must never
    // block checkout.
    if (customerUser) {
      try {
        await api.post('/api/orders', {
          recipientName: customer.name,
          recipientPhone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          landmark: customer.landmark,
          subtotal,
          discount,
          shippingFee,
          grandTotal,
          coupon: couponCode,
          notes: customer.notes,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.images[0],
            variantLabel: item.variant ?? null,
            quantity: item.quantity,
            price: getItemPrice(item),
            lineTotal: getItemPrice(item) * item.quantity,
          })),
        });
      } catch (err) {
        console.warn('Could not save order to account history:', err.message);
      }
    }

    const link = buildWhatsAppOrderLink(order, settings.whatsappNumber);
    window.open(link, '_blank', 'noopener,noreferrer');

    navigate('/order-success', { state: { order } });
  };

  return (
    <div className="bg-bg pb-24 pt-28 lg:pt-32">
      <div className="container-luxury max-w-3xl">
        <Reveal className="text-center">
          <p className="eyebrow">Almost There</p>
          <h1 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Checkout</h1>
        </Reveal>

        <div className="mt-10">
          <CheckoutSteps current={step} />
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {step === 'info' ? (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
              >
                <CustomerInfoForm initialValues={customer} onSubmit={handleInfoSubmit} />
              </motion.div>
            ) : (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
              >
                <OrderReview
                  customer={customer}
                  items={items}
                  subtotal={subtotal}
                  discount={discount}
                  shippingFee={shippingFee}
                  grandTotal={grandTotal}
                  coupon={couponCode}
                  onEdit={() => setStep('info')}
                  onConfirm={handleConfirm}
                  submitting={submitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
