import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(null);
const STORAGE_KEY = 'khayaal_settings_v1';

const DEFAULT_SETTINGS = {
  storeName: 'Khayaal Jewels',
  contactNumber: '919037246978',
  whatsappNumber: '919037246978',
  email: 'hello@khayaaljewels.com',
  address: 'Kozhikode, Kerala, India',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  pinterest: 'https://pinterest.com',
};

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));
  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  const value = { settings, updateSettings, resetSettings };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
