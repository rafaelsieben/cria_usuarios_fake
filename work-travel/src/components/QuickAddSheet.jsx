import React, { useState, useRef } from 'react';
import {
  View, Text, Modal, TextInput, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { CATEGORIES, CATEGORY_KEYS } from '../constants/categories';
import { tripStatus, fmtDateRange, fmtMoney } from '../constants/helpers';
import { createExpense } from '../db/expenses';

export default function QuickAddSheet({ visible, onClose, onSave, trips, defaultTripId, theme, lang }) {
  const db = useSQLiteContext();
  const L = require('../constants/i18n').STR[lang];
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('food');
  const [desc, setDesc] = useState('');
  const [tripId, setTripId] = useState(defaultTripId || null);
  const [pickingTrip, setPickingTrip] = useState(!defaultTripId);
  const inputRef = useRef(null);

  const selectedTrip = trips.find((t) => t.id === tripId);
  const eligible = trips
    .filter((t) => {
      const st = tripStatus(t);
      return st.state !== 'past' || st.days <= 14;
    })
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const canSave = amount && parseFloat(amount) > 0 && tripId;

  const handleSave = async () => {
    if (!canSave) return;
    const today = new Date().toISOString().slice(0, 10);
    const id = await createExpense(db, {
      trip_id: tripId,
      date: today,
      category: cat,
      amount: parseFloat(amount),
      description: desc || (lang === 'pt' ? CATEGORIES[cat].labelPt : CATEGORIES[cat].labelEn),
    });
    onSave({ id, trip_id: tripId, date: today, category: cat, amount: parseFloat(amount), description: desc });
    setAmount(''); setDesc(''); setCat('food');
    onClose();
  };

  const handleClose = () => {
    setAmount(''); setDesc(''); setCat('food'); setPickingTrip(!defaultTripId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.overlay}>
        <Pressable style={s.backdrop} onPress={handleClose} />
        <View style={[s.sheet, { backgroundColor: theme.card }]}>
          <View style={[s.handle, { backgroundColor: theme.textTertiary }]} />

          {pickingTrip ? (
            <>
              <View style={s.header}>
                <Pressable onPress={handleClose}><Text style={[s.headerBtn, { color: theme.accent }]}>{L.cancel}</Text></Pressable>
                <Text style={[s.headerTitle, { color: theme.text }]}>{lang === 'pt' ? 'Escolher viagem' : 'Choose trip'}</Text>
                <View style={{ width: 60 }} />
              </View>
              <ScrollView style={{ maxHeight: 400 }} contentContainerStyle={{ padding: 16, gap: 10 }}>
                {eligible.map((t) => {
                  const st = tripStatus(t);
                  const label = st.state === 'ongoing' ? L.ongoing : st.state === 'upcoming' ? L.inDays(st.days) : L.daysAgo(st.days);
                  return (
                    <Pressable key={t.id} onPress={() => { setTripId(t.id); setPickingTrip(false); }}
                      style={[s.tripRow, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                      <View style={[s.tripDot, { backgroundColor: st.state === 'ongoing' ? theme.accent : theme.accent + '22' }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[s.tripCity, { color: theme.text }]}>{t.city}</Text>
                        <Text style={[s.tripDates, { color: theme.textMuted }]}>{fmtDateRange(t.startDate, t.endDate, L.monthNames)} · {label}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <>
              <View style={s.header}>
                <Pressable onPress={handleClose}><Text style={[s.headerBtn, { color: theme.accent }]}>{L.cancel}</Text></Pressable>
                <Text style={[s.headerTitle, { color: theme.text }]}>{L.newExpense}</Text>
                <Pressable onPress={handleSave} disabled={!canSave}>
                  <Text style={[s.headerBtn, { color: canSave ? theme.accent : theme.textTertiary, fontWeight: '700' }]}>{L.save}</Text>
                </Pressable>
              </View>

              {/* Trip chip */}
              {selectedTrip && (
                <Pressable onPress={() => setPickingTrip(true)} style={[s.tripChip, { backgroundColor: theme.dark ? 'rgba(118,118,128,0.2)' : 'rgba(118,118,128,0.12)' }]}>
                  <View style={[s.chipDot, { backgroundColor: theme.accent }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.chipLabel, { color: theme.textMuted }]}>{(tripStatus(selectedTrip).state === 'ongoing' ? L.ongoing : lang === 'pt' ? 'Viagem' : 'Trip').toUpperCase()}</Text>
                    <Text style={[s.chipCity, { color: theme.text }]}>{selectedTrip.city} · {fmtDateRange(selectedTrip.startDate, selectedTrip.endDate, L.monthNames)}</Text>
                  </View>
                  <Text style={[s.chipChange, { color: theme.accent }]}>{lang === 'pt' ? 'Trocar' : 'Change'}</Text>
                </Pressable>
              )}

              {/* Amount */}
              <View style={s.amtRow}>
                <Text style={[s.amtCurrency, { color: theme.textMuted }]}>R$</Text>
                <TextInput
                  ref={inputRef}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={theme.textTertiary}
                  value={amount}
                  onChangeText={setAmount}
                  style={[s.amtInput, { color: theme.text }]}
                  autoFocus
                />
              </View>

              {/* Category grid */}
              <View style={s.catGrid}>
                {CATEGORY_KEYS.map((k) => {
                  const c = CATEGORIES[k];
                  const on = cat === k;
                  return (
                    <Pressable key={k} onPress={() => setCat(k)}
                      style={[s.catBtn, { backgroundColor: on ? c.color : theme.card }]}>
                      <View style={[s.catIcon, { backgroundColor: on ? 'rgba(255,255,255,0.2)' : c.color + '22' }]}>
                        <Text style={{ fontSize: 16 }}>{catEmoji(k)}</Text>
                      </View>
                      <Text style={[s.catLabel, { color: on ? '#fff' : theme.text }]} numberOfLines={1}>
                        {lang === 'pt' ? c.labelPt : c.labelEn}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Description */}
              <View style={{ paddingHorizontal: 16 }}>
                <TextInput
                  value={desc} onChangeText={setDesc}
                  placeholder={lang === 'pt' ? 'Descrição (opcional)' : 'Description (optional)'}
                  placeholderTextColor={theme.textMuted}
                  style={[s.descInput, { backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }]}
                />
              </View>

              {/* Save button */}
              <View style={{ padding: 16 }}>
                <Pressable onPress={handleSave} disabled={!canSave}
                  style={[s.saveBtn, { backgroundColor: canSave ? theme.accent : theme.dark ? '#2C2C2E' : '#E5E5EA' }]}>
                  <Text style={[s.saveBtnText, { color: canSave ? '#fff' : theme.textTertiary }]}>
                    {amount ? `${L.save} ${fmtMoney(parseFloat(amount))}` : L.save}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function catEmoji(k) {
  return { flight: '✈️', hotel: '🏨', transport: '🚗', food: '🍽️', parking: '🅿️', carRental: '🔑', leisure: '🎭', other: '•' }[k] || '•';
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingBottom: 34 },
  handle: { width: 36, height: 5, borderRadius: 999, marginHorizontal: 'auto', marginTop: 8, marginBottom: 4, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 8 },
  headerBtn: { fontSize: 17, fontWeight: '500' },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  tripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  tripDot: { width: 38, height: 38, borderRadius: 10 },
  tripCity: { fontSize: 15, fontWeight: '600' },
  tripDates: { fontSize: 12, marginTop: 1 },
  tripChip: { marginHorizontal: 16, marginBottom: 14, borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  chipDot: { width: 24, height: 24, borderRadius: 999 },
  chipLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },
  chipCity: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  chipChange: { fontSize: 13, fontWeight: '600' },
  amtRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  amtCurrency: { fontSize: 28, fontWeight: '500' },
  amtInput: { fontSize: 56, fontWeight: '700', letterSpacing: -1.2, minWidth: 80 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  catBtn: { width: '22%', paddingVertical: 12, borderRadius: 14, alignItems: 'center', gap: 6 },
  catIcon: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: 10.5, fontWeight: '600', textAlign: 'center' },
  descInput: { borderRadius: 12, padding: 13, fontSize: 15, borderWidth: 1 },
  saveBtn: { borderRadius: 14, padding: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
});
