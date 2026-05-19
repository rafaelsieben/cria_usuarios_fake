import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllTrips } from '../db/trips';
import { getExpensesByTrip, getAllSettings, setSetting } from '../db/expenses';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const db = useSQLiteContext();
  const [trips, setTrips] = useState([]);
  const [settings, setSettingsState] = useState({
    accent: '#FF6B2C',
    dark: false,
    cardStyle: 'elevated',
    lang: 'pt',
    currency: 'BRL',
    user_name: 'Pedro Almeida',
    user_email: 'pedro@exemplo.com',
    onboarded: false,
  });
  const [loading, setLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    const rows = await getAllTrips(db);
    const withExpenses = await Promise.all(
      rows.map(async (t) => {
        const expenses = await getExpensesByTrip(db, t.id);
        return { ...t, expenses };
      })
    );
    setTrips(withExpenses);
  }, [db]);

  const loadSettings = useCallback(async () => {
    const s = await getAllSettings(db);
    setSettingsState({
      accent: s.accent || '#FF6B2C',
      dark: s.dark === 'true',
      cardStyle: s.card_style || 'elevated',
      lang: s.lang || 'pt',
      currency: s.currency || 'BRL',
      user_name: s.user_name || 'Pedro Almeida',
      user_email: s.user_email || 'pedro@exemplo.com',
      onboarded: s.onboarded === 'true',
    });
  }, [db]);

  useEffect(() => {
    Promise.all([loadTrips(), loadSettings()]).finally(() => setLoading(false));
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    const dbKey = key === 'cardStyle' ? 'card_style' : key;
    await setSetting(db, dbKey, value);
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  }, [db]);

  const theme = buildTheme(settings.dark, settings.accent, settings.cardStyle);

  return (
    <AppContext.Provider value={{ trips, loadTrips, settings, updateSetting, theme, loading, db }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

function buildTheme(dark, accent, cardStyle) {
  const styles = {
    soft:     { cardRadius: 22, cardShadow: dark ? {} : { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } },
    flat:     { cardRadius: 14, cardShadow: {} },
    elevated: { cardRadius: 18, cardShadow: { shadowColor: '#000', shadowOpacity: dark ? 0.4 : 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 4 } },
  };
  const cs = styles[cardStyle] || styles.elevated;
  return {
    dark,
    accent,
    bg: dark ? '#000000' : '#F2F2F7',
    bgSecondary: dark ? '#0B0B0D' : '#EEF0F4',
    card: dark ? '#1C1C1E' : '#FFFFFF',
    cardAlt: dark ? '#2C2C2E' : '#F8F9FB',
    text: dark ? '#FFFFFF' : '#000000',
    textMuted: dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.65)',
    textTertiary: dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)',
    border: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    separator: dark ? 'rgba(84,84,88,0.55)' : 'rgba(60,60,67,0.12)',
    success: '#30D158',
    warning: '#FF9F0A',
    danger: '#FF453A',
    cardRadius: cs.cardRadius,
    cardShadow: cs.cardShadow,
  };
}
