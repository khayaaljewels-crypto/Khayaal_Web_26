  import { Suspense, lazy } from 'react';
  import { Routes, Route, Navigate } from 'react-router-dom';

  const Home = lazy(() => import('@/pages/Home/Home'));
  const Shop = lazy(() => import('@/pages/Shop/Shop'));
  const ProductDetail = lazy(() => import('@/pages/Product/ProductDetail'));
  const Cart = lazy(() => import('@/pages/Cart/Cart'));
  const Wishlist = lazy(() => import('@/pages/Wishlist/Wishlist'));
  const Checkout = lazy(() => import('@/pages/Checkout/Checkout'));
  const OrderSuccess = lazy(() => import('@/pages/OrderSuccess/OrderSuccess'));
  const About = lazy(() => import('@/pages/About/About'));
  const Contact = lazy(() => import('@/pages/Contact/Contact'));
  const FAQ = lazy(() => import('@/pages/FAQ/FAQ'));
  const TrackOrder = lazy(() => import('@/pages/Track/TrackOrder'));
  const NotFound = lazy(() => import('@/pages/NotFound'));

  const AccountLayout = lazy(() => import('@/pages/Account/AccountLayout'));
  const AccountDashboard = lazy(() => import('@/pages/Account/Dashboard'));
  const MyProfile = lazy(() => import('@/pages/Account/MyProfile'));
  const OrderHistory = lazy(() => import('@/pages/Account/OrderHistory'));
  const SavedAddresses = lazy(() => import('@/pages/Account/SavedAddresses'));

  export default function AppRoutes() {
    return (
      <Suspense fallback={<div className="min-h-[70svh]" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          {/* /profile and /orders now live under /my-account — kept as redirects so existing links never break */}
          <Route path="/profile" element={<Navigate to="/my-account" replace />} />
          <Route path="/orders" element={<Navigate to="/my-account/orders" replace />} />

          <Route path="/my-account" element={<AccountLayout />}>
            <Route index element={<AccountDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="addresses" element={<SavedAddresses />} />
          </Route>

          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    );
  }
