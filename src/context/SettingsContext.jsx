import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(null);
const STORAGE_KEY = 'khayaal_settings_v2';

const DEFAULT_SETTINGS = {
  storeName: 'Khayaal Jewels',
  contactNumber: '+919037246978',
  whatsappNumber: '919037246978',
  email: 'khayaaljewels@gmail.com',
  address: 'Kozhikode, Kerala, India',
  instagram: 'https://www.instagram.com/khayaal_jewels?stkn=OXNyOWFvZnl6b3Zj',
  instagramHandle: 'khayaal_jewels',
  facebook: 'https://www.facebook.com/share/19mWCvhg63/',
  pinterest: 'https://pinterest.com',
  productPolicies: {
    careGuide: [
      'Keep away from water, sweat, perfume, lotions, and chemicals.',
      'Store each piece separately in a soft pouch or jewellery box.',
      'Handle gently and avoid dropping, pulling, or applying pressure.',
      'Wipe gently with a soft, dry cloth after use.',
    ],
    shipping: [
      'Free shipping is available across India.',
      'Cash on delivery is not available. All orders are prepaid.',
      'Delivery timelines may vary based on the destination.',
      'Every piece is carefully packaged to ensure it reaches you safely.',
    ],
    returns: [
      'Returns and exchanges are not accepted unless the item is damaged or incorrect.',
      'Damaged or incorrect items must be reported within 24 hours of delivery.',
      'An unboxing video and clear photos are required for claims.',
      'Eligible claims will be reviewed and resolved accordingly.',
    ],
  },
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
