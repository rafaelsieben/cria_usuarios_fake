import { Redirect } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { settings, loading } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator color="#FF6B2C" />
      </View>
    );
  }

  return settings.onboarded ? <Redirect href="/(tabs)/" /> : <Redirect href="/auth" />;
}
