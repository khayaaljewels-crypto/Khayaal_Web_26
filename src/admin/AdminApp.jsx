import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/admin/components/ProtectedRoute';
import AdminLayout from '@/admin/layout/AdminLayout';
import Login from '@/admin/pages/Login';

const Dashboard = lazy(() => import('@/admin/pages/Dashboard'));
const ProductList = lazy(() => import('@/admin/pages/products/ProductList'));
const ProductForm = lazy(() => import('@/admin/pages/products/ProductForm'));
const CategoryManager = lazy(() => import('@/admin/pages/categories/CategoryManager'));
const CollectionManager = lazy(() => import('@/admin/pages/categories/CollectionManager'));
const MediaLibrary = lazy(() => import('@/admin/pages/media/MediaLibrary'));
const OrderList = lazy(() => import('@/admin/pages/orders/OrderList'));
const OrderDetail = lazy(() => import('@/admin/pages/orders/OrderDetail'));
const CustomerList = lazy(() => import('@/admin/pages/customers/CustomerList'));
const CustomerDetail = lazy(() => import('@/admin/pages/customers/CustomerDetail'));
const Settings = lazy(() => import('@/admin/pages/settings/Settings'));
const MigrateData = lazy(() => import('@/admin/pages/MigrateData'));

export default function AdminApp() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F7F4F0] text-sm text-text/50">Loading...</div>}>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/products/:id/edit" element={<ProductForm />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route path="/admin/collections" element={<CollectionManager />} />
          <Route path="/admin/media" element={<MediaLibrary />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/customers" element={<CustomerList />} />
          <Route path="/admin/customers/:phone" element={<CustomerDetail />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/migrate-data" element={<MigrateData />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
