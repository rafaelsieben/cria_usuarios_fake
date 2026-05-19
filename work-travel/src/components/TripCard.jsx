import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getCityGradient } from '../constants/categories';
import { tripSpent, tripPending, tripStatus, fmtMoneyShort, fmtDateRange } from '../constants/helpers';

export default function TripCard({ trip, theme, lang, onPress }) {
  const L = require('../constants/i18n').STR[lang];
  const v = getCityGradient(trip.city);
  const spent = tripSpent(trip.expenses);
  const pct = Math.min(spent / trip.budget, 1);
  const pending = tripPending(trip);
  const status = tripStatus(trip);
  const over = spent > trip.budget;

  const statusLabel = (() => {
    if (status.state === 'ongoing') return L.ongoing;
    if (status.state === 'upcoming') {
      if (status.days === 0) return L.today;
      if (status.days === 1) return L.tomorrow;
      return L.inDays(status.days);
    }
    return L.daysAgo(status.days);
  })();

  const statusColor =
    status.state === 'ongoing' ? theme.accent :
    status.state === 'upcoming' ? theme.text : theme.textMuted;

  return (
    <Pressable onPress={onPress} style={[s.card, { backgroundColor: theme.card, borderColor: theme.border, borderRadius: 18 }, theme.cardShadow]}>
      {/* Gradient thumb */}
      <LinearGradient colors={v} start={[0, 0]} end={[1, 1]} style={s.thumb}>
        <Text style={s.thumbCity}>{trip.city[0]}</Text>
      </LinearGradient>

      {/* Body */}
      <View style={s.body}>
        <View style={s.row}>
          <View style={s.col}>
            <Text style={[s.statusLabel, { color: statusColor }]}>{statusLabel.toUpperCase()}</Text>
            <Text style={[s.city, { color: theme.text }]} numberOfLines={1}>{trip.city}</Text>
            <Text style={[s.dates, { color: theme.textMuted }]}>{fmtDateRange(trip.startDate, trip.endDate, L.monthNames)}</Text>
          </View>
          <View style={s.amtCol}>
            <Text style={[s.amount, { color: over ? theme.danger : theme.text }]}>{fmtMoneyShort(spent)}</Text>
            <Text style={[s.budget, { color: theme.textMuted }]}>/ {fmtMoneyShort(trip.budget)}</Text>
          </View>
        </View>

        {pending.length > 0 && status.state !== 'past' && (
          <View style={[s.pendingPill, { backgroundColor: theme.warning + '22' }]}>
            <Text style={[s.pendingText, { color: theme.warning }]}>{L.itemsPending(pending.length)}</Text>
          </View>
        )}

        {/* Progress bar */}
        <View style={[s.track, { backgroundColor: 'rgba(120,120,128,0.18)' }]}>
          <View style={[s.progress, { width: `${pct * 100}%`, backgroundColor: over ? theme.danger : theme.accent }]} />
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', overflow: 'hidden', borderWidth: 1, marginBottom: 10 },
  thumb: { width: 88, justifyContent: 'center', alignItems: 'center' },
  thumbCity: { color: 'rgba(255,255,255,0.4)', fontSize: 32, fontWeight: '700' },
  body: { flex: 1, padding: 12, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  col: { flex: 1 },
  statusLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.4, marginBottom: 2 },
  city: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  dates: { fontSize: 12, marginTop: 2 },
  amtCol: { alignItems: 'flex-end' },
  amount: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  budget: { fontSize: 10.5 },
  pendingPill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  pendingText: { fontSize: 11, fontWeight: '600' },
  track: { height: 3, borderRadius: 999, overflow: 'hidden' },
  progress: { height: 3, borderRadius: 999 },
});
