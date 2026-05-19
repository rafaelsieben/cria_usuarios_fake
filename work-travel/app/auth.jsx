import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../src/context/AppContext';

export default function AuthScreen() {
  const { theme, updateSetting, settings } = useApp();
  const lang = settings.lang;
  const L = require('../src/constants/i18n').STR[lang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const canStart = name.trim().length > 0;

  const handleStart = async () => {
    if (!canStart) return;
    await updateSetting('user_name', name.trim());
    if (email.trim()) await updateSetting('user_email', email.trim());
    await updateSetting('onboarded', 'true');
    router.replace('/(tabs)/');
  };

  return (
    <LinearGradient colors={['#0a0a0c', '#1a1a2e', '#16213e']} style={s.bg}>
      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.kav}>
          {/* Brand */}
          <View style={s.brand}>
            <View style={s.icon}>
              <Text style={s.iconText}>✈</Text>
            </View>
            <Text style={s.brandName}>Work Travel</Text>
          </View>

          {/* Hero copy */}
          <View style={s.hero}>
            <Text style={s.heroSub}>{lang === 'pt' ? 'SUAS VIAGENS, ORGANIZADAS' : 'YOUR TRIPS, ORGANIZED'}</Text>
            <Text style={s.heroTitle}>{L.welcomeTitle}</Text>
            <Text style={s.heroBody}>{L.welcomeSub}</Text>
          </View>

          {/* Form */}
          <View style={s.form}>
            <TextInput
              value={name} onChangeText={setName}
              placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'}
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={s.input}
              autoFocus
            />
            <TextInput
              value={email} onChangeText={setEmail}
              placeholder="email@exemplo.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={s.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Pressable onPress={handleStart} disabled={!canStart}
              style={[s.cta, { backgroundColor: canStart ? '#fff' : 'rgba(255,255,255,0.18)' }]}>
              <Text style={[s.ctaText, { color: canStart ? '#0a0a0c' : 'rgba(255,255,255,0.4)' }]}>
                {L.getStarted}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  kav: { flex: 1, justifyContent: 'flex-end', padding: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 48 },
  icon: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.3)' },
  iconText: { fontSize: 22 },
  brandName: { fontSize: 18, fontWeight: '700', color: '#fff', letterSpacing: -0.2 },
  hero: { marginBottom: 32 },
  heroSub: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 12 },
  heroTitle: { fontSize: 34, fontWeight: '700', color: '#fff', letterSpacing: -0.9, lineHeight: 40, marginBottom: 12 },
  heroBody: { fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 24 },
  form: { gap: 10 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 16, fontSize: 16, color: '#fff' },
  cta: { padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  ctaText: { fontSize: 17, fontWeight: '700' },
});
