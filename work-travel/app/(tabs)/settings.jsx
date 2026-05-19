import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView, TextInput, Switch, Alert,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';

const ACCENTS = ['#FF6B2C', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#0EA5E9', '#8B5CF6'];
const CARD_STYLES = ['elevated', 'flat', 'outlined'];

export default function SettingsScreen() {
  const { settings, updateSetting, theme } = useApp();
  const lang = settings.lang;
  const L = require('../../src/constants/i18n').STR[lang];

  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(settings.user_name || '');
  const [editEmail, setEditEmail] = useState(false);
  const [emailVal, setEmailVal] = useState(settings.user_email || '');

  const saveName = async () => {
    if (nameVal.trim()) await updateSetting('user_name', nameVal.trim());
    setEditName(false);
  };

  const saveEmail = async () => {
    await updateSetting('user_email', emailVal.trim());
    setEditEmail(false);
  };

  const cardStyleLabel = {
    elevated: lang === 'pt' ? 'Elevado' : 'Elevated',
    flat: lang === 'pt' ? 'Plano' : 'Flat',
    outlined: lang === 'pt' ? 'Contorno' : 'Outlined',
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.header}>
          <Text style={[s.title, { color: theme.text }]}>{L.settings}</Text>
        </View>

        {/* Account section */}
        <View style={s.groupLabel}>
          <Text style={[s.groupText, { color: theme.textMuted }]}>{L.account.toUpperCase()}</Text>
        </View>
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Name row */}
          <View style={[s.row, { borderBottomWidth: 1, borderColor: theme.separator }]}>
            <Text style={[s.rowLabel, { color: theme.textMuted }]}>{L.name}</Text>
            {editName ? (
              <View style={s.editRow}>
                <TextInput
                  value={nameVal}
                  onChangeText={setNameVal}
                  style={[s.editInput, { color: theme.text, borderColor: theme.accent }]}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={saveName}
                />
                <Pressable onPress={saveName}>
                  <Text style={[s.saveBtn, { color: theme.accent }]}>{L.save}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => { setNameVal(settings.user_name || ''); setEditName(true); }} style={s.editRow}>
                <Text style={[s.rowValue, { color: theme.text }]}>{settings.user_name || '—'}</Text>
                <Text style={[s.editLabel, { color: theme.accent }]}>{L.edit}</Text>
              </Pressable>
            )}
          </View>

          {/* Email row */}
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: theme.textMuted }]}>{L.email}</Text>
            {editEmail ? (
              <View style={s.editRow}>
                <TextInput
                  value={emailVal}
                  onChangeText={setEmailVal}
                  style={[s.editInput, { color: theme.text, borderColor: theme.accent }]}
                  autoFocus
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={saveEmail}
                />
                <Pressable onPress={saveEmail}>
                  <Text style={[s.saveBtn, { color: theme.accent }]}>{L.save}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => { setEmailVal(settings.user_email || ''); setEditEmail(true); }} style={s.editRow}>
                <Text style={[s.rowValue, { color: theme.text }]}>{settings.user_email || '—'}</Text>
                <Text style={[s.editLabel, { color: theme.accent }]}>{L.edit}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Appearance */}
        <View style={s.groupLabel}>
          <Text style={[s.groupText, { color: theme.textMuted }]}>{(lang === 'pt' ? 'Aparência' : 'Appearance').toUpperCase()}</Text>
        </View>
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Dark mode */}
          <View style={[s.row, { borderBottomWidth: 1, borderColor: theme.separator }]}>
            <Text style={[s.rowLabel, { color: theme.text }]}>{L.theme}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>{settings.dark ? L.dark : L.light}</Text>
              <Switch
                value={settings.dark}
                onValueChange={(v) => updateSetting('dark', v ? 'true' : 'false')}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Language */}
          <View style={[s.row, { borderBottomWidth: 1, borderColor: theme.separator }]}>
            <Text style={[s.rowLabel, { color: theme.text }]}>{L.language}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['pt', 'en'].map((l) => (
                <Pressable
                  key={l}
                  onPress={() => updateSetting('lang', l)}
                  style={[s.langBtn, {
                    backgroundColor: settings.lang === l ? theme.accent : theme.card,
                    borderColor: settings.lang === l ? theme.accent : theme.border,
                  }]}>
                  <Text style={[s.langLabel, { color: settings.lang === l ? '#fff' : theme.textMuted }]}>
                    {l === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Accent color */}
          <View style={[s.row, { borderBottomWidth: 1, borderColor: theme.separator }]}>
            <Text style={[s.rowLabel, { color: theme.text }]}>{L.accentColor}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {ACCENTS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => updateSetting('accent', c)}
                  style={[s.colorDot, { backgroundColor: c }, settings.accent === c && s.colorDotActive]}>
                  {settings.accent === c && (
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Card style */}
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: theme.text }]}>{L.cardStyle}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {CARD_STYLES.map((cs) => (
                <Pressable
                  key={cs}
                  onPress={() => updateSetting('cardStyle', cs)}
                  style={[s.csBtn, {
                    backgroundColor: settings.cardStyle === cs ? theme.accent : theme.card,
                    borderColor: settings.cardStyle === cs ? theme.accent : theme.border,
                  }]}>
                  <Text style={[s.csLabel, { color: settings.cardStyle === cs ? '#fff' : theme.textMuted }]}>
                    {cardStyleLabel[cs]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Currency */}
        <View style={s.groupLabel}>
          <Text style={[s.groupText, { color: theme.textMuted }]}>{(lang === 'pt' ? 'Moeda' : 'Currency').toUpperCase()}</Text>
        </View>
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: theme.text }]}>{lang === 'pt' ? 'Moeda padrão' : 'Default currency'}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {['BRL', 'USD', 'EUR'].map((c) => (
                <Pressable
                  key={c}
                  onPress={() => updateSetting('currency', c)}
                  style={[s.langBtn, {
                    backgroundColor: (settings.currency || 'BRL') === c ? theme.accent : theme.card,
                    borderColor: (settings.currency || 'BRL') === c ? theme.accent : theme.border,
                  }]}>
                  <Text style={[s.langLabel, { color: (settings.currency || 'BRL') === c ? '#fff' : theme.textMuted }]}>{c}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* App info */}
        <View style={s.groupLabel}>
          <Text style={[s.groupText, { color: theme.textMuted }]}>{(lang === 'pt' ? 'Sobre' : 'About').toUpperCase()}</Text>
        </View>
        <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[s.row, { borderBottomWidth: 1, borderColor: theme.separator }]}>
            <Text style={[s.rowLabel, { color: theme.textMuted }]}>App</Text>
            <Text style={[s.rowValue, { color: theme.text }]}>Work Travel</Text>
          </View>
          <View style={s.row}>
            <Text style={[s.rowLabel, { color: theme.textMuted }]}>{lang === 'pt' ? 'Versão' : 'Version'}</Text>
            <Text style={[s.rowValue, { color: theme.textMuted }]}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6 },
  groupLabel: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 6 },
  groupText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8 },
  card: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, flexWrap: 'wrap', gap: 8 },
  rowLabel: { fontSize: 15 },
  rowValue: { fontSize: 15, fontWeight: '500' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' },
  editInput: { flex: 1, fontSize: 14, borderBottomWidth: 1, paddingVertical: 2, maxWidth: 180 },
  saveBtn: { fontSize: 14, fontWeight: '700' },
  editLabel: { fontSize: 13, fontWeight: '600' },
  langBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  langLabel: { fontSize: 12, fontWeight: '600' },
  colorDot: { width: 26, height: 26, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  colorDotActive: { borderWidth: 2, borderColor: '#fff' },
  csBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  csLabel: { fontSize: 11, fontWeight: '600' },
});
