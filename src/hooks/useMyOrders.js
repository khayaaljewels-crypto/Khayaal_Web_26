import { useEffect, useState, useCallback } from 'react';
import { api } from '@/utils/apiClient';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

export function useMyOrders() {
  const { user } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { orders: fetched } = await api.get('/api/orders/me');
      setOrders(fetched);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { orders, loading, error, refresh };
}
