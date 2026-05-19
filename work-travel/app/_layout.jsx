import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '../src/db/database';
import { AppProvider, useApp } from '../src/context/AppContext';

function InnerLayout() {
  const { theme } = useApp();
  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trip/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="work-travel.db" onInit={initDatabase} useSuspense={false}>
      <AppProvider>
        <InnerLayout />
      </AppProvider>
    </SQLiteProvider>
  );
}
