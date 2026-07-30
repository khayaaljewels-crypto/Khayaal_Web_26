import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/admin/components/AdminSidebar';
import AdminTopbar from '@/admin/components/AdminTopbar';
import { ToastProvider } from '@/admin/context/ToastContext';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#F7F4F0]">
        <AdminSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
