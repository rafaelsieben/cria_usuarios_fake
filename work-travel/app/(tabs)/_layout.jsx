import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useApp } from '../../src/context/AppContext';

function TabIcon({ focused, color, label, icon }) {
  return (
    <View style={{ alignItems: 'center', gap: 3 }}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={{ fontSize: 10, fontWeight: focused ? '700' : '500', color, letterSpacing: 0.1 }}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { theme, settings } = useApp();
  const lang = settings.lang;
  const L = require('../../src/constants/i18n').STR[lang];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.dark ? 'rgba(10,10,12,0.95)' : 'rgba(255,255,255,0.95)',
          borderTopColor: theme.separator,
          borderTopWidth: 0.5,
          height: 82,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label={L.tabCalendar} icon="📅" />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label={L.tabTrips} icon="🧳" />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label={L.tabReports} icon="📊" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} label={L.tabSettings} icon="⚙️" />
          ),
        }}
      />
    </Tabs>
  );
}
