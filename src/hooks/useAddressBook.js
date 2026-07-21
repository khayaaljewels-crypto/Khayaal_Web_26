import { useEffect, useState } from 'react';

function storageKey(uid) {
  return `khayaal_addresses_${uid}`;
}

function readStored(uid) {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useAddressBook(uid) {
  const [addresses, setAddresses] = useState(() => (uid ? readStored(uid) : []));

  useEffect(() => {
    setAddresses(uid ? readStored(uid) : []);
  }, [uid]);

  useEffect(() => {
    if (uid) localStorage.setItem(storageKey(uid), JSON.stringify(addresses));
  }, [uid, addresses]);

  const addAddress = (address) => {
    const id = `addr-${Date.now().toString(36)}`;
    setAddresses((prev) => {
      const isFirst = prev.length === 0;
      return [...prev, { id, isDefault: isFirst, ...address }];
    });
  };

  const updateAddress = (id, patch) =>
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const removeAddress = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  const setDefault = (id) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));

  return { addresses, addAddress, updateAddress, removeAddress, setDefault };
}
