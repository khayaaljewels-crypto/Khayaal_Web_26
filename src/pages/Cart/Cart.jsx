import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import CartLineItem from '@/components/cart/CartLineItem';
import OrderSummary from '@/components/cart/OrderSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import ProductRail from '@/components/product/ProductRail';
import Reveal from '@/components/animations/Reveal';

export default function Cart() {
  const { items, updateQuantity, removeItem, saveForLater, savedItems, moveToCart, removeSaved } = useCart();
  const { products } = useProducts();

  const recommended = products.filter((p) => p.isBestSeller && !items.some((i) => i.product.id === p.id)).slice(0, 8);

  return (
    <div className="bg-bg pb-24 pt-28 lg:pt-32">
      <div className="container-luxury">
        <Reveal className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Review Your Selection</p>
            <h1 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Your Bag</h1>
          </div>
          <Link to="/shop" className="hidden items-center gap-1.5 text-sm font-medium text-gold hover:underline sm:flex">
            <HiOutlineArrowLeft /> Continue Shopping
          </Link>
        </Reveal>

        {items.length === 0 && savedItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              {items.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-text/60">
                  Your bag is empty — items saved for later are below.
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-white px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartLineItem
                        key={item.key}
                        item={item}
                        mode="cart"
                        onQtyChange={updateQuantity}
                        onRemove={removeItem}
                        onSaveForLater={saveForLater}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {savedItems.length > 0 && (
                <div className="mt-10">
                  <p className="font-heading text-lg text-brown">Saved For Later ({savedItems.length})</p>
                  <div className="mt-4 rounded-2xl border border-border bg-white px-6">
                    <AnimatePresence initial={false}>
                      {savedItems.map((item) => (
                        <CartLineItem
                          key={item.key}
                          item={item}
                          mode="saved"
                          onRemove={removeSaved}
                          onMoveToCart={moveToCart}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              <Link to="/shop" className="mt-6 flex items-center gap-1.5 text-sm font-medium text-gold hover:underline sm:hidden">
                <HiOutlineArrowLeft /> Continue Shopping
              </Link>
            </div>

            {items.length > 0 && (
              <div className="lg:sticky lg:top-28 lg:self-start">
                <OrderSummary />
              </div>
            )}
          </div>
        )}

        {recommended.length > 0 && (
          <div className="mt-24">
            <ProductRail eyebrow="You Might Also Like" title="Recommended For You" products={recommended} />
          </div>
        )}
      </div>
    </div>
  );
}
