import { useEffect, lazy, Suspense, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CompareProvider } from '@/context/CompareContext';
import { UIProvider } from '@/context/UIContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { CollectionsProvider } from '@/context/CollectionsContext';
import { OccasionsProvider } from '@/context/OccasionsContext';
import { OrdersProvider } from '@/context/OrdersContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import PageLoader from '@/components/animations/PageLoader';
import ScrollProgress from '@/components/animations/ScrollProgress';
import CustomCursor from '@/components/animations/CustomCursor';
import BackToTop from '@/components/ui/BackToTop';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ScrollToTop from '@/routes/ScrollToTop';
import AppRoutes from '@/routes/AppRoutes';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Lazy-loaded as one unit (see AdminRoot.jsx) — this is what keeps the full
// firebase/auth SDK (the largest single piece of the old main bundle) out of
// every storefront visitor's initial load, since only /admin ever needs it.
const AdminRoot = lazy(() => import('@/admin/AdminRoot'));

function StorefrontShell() {
  const [isLoading, setIsLoading] = useState(true);
  useLenis();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <ScrollProgress />
      <CustomCursor />
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen pb-20 lg:pb-0">
        <AppRoutes />
      </main>
      <Footer />
      <MobileBottomNav />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}

function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="min-h-svh" />}>
        <AdminRoot />
      </Suspense>
    );
  }

  return (
    <ToastProvider>
      <CustomerAuthProvider>
        <UIProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <StorefrontShell />
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </UIProvider>
      </CustomerAuthProvider>
    </ToastProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <SettingsProvider>
          <ProductsProvider>
            <CategoriesProvider>
              <CollectionsProvider>
                <OccasionsProvider>
                  <OrdersProvider>
                    <Root />
                  </OrdersProvider>
                </OccasionsProvider>
              </CollectionsProvider>
            </CategoriesProvider>
          </ProductsProvider>
        </SettingsProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
