import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getCityGradient } from '../constants/categories';
import { tripSpent, tripPending, tripStatus, fmtMoneyShort, fmtDateRange, daysBetween, parseDate } from '../constants/helpers';

export default function HeroCard({ trip, theme, lang, onPress }) {
  const L = require('../constants/i18n').STR[lang];
  const v = getCityGradient(trip.city);
  const status = tripStatus(trip);
  const isOngoing = status.state === 'ongoing';
  const spent = tripSpent(trip.expenses);
  const pct = Math.min(spent / trip.budget, 1);
  const pending = tripPending(trip);
  const today = new Date();

  const countdown = (() => {
    if (isOngoing) {
      const total = daysBetween(parseDate(trip.startDate), parseDate(trip.endDate));
      const elapsed = daysBetween(parseDate(trip.startDate), today);
      const remaining = Math.max(0, total - elapsed);
      if (remaining === 0) return lang === 'pt' ? 'Último dia' : 'Last day';
      return lang === 'pt' ? `${remaining} dias restantes` : `${remaining} days left`;
    }
    if (status.state === 'upcoming') {
      if (status.days === 0) return lang === 'pt' ? 'Hoje' : 'Today';
      if (status.days === 1) return lang === 'pt' ? 'Amanhã' : 'Tomorrow';
      return L.inDays(status.days);
    }
    return fmtDateRange(trip.startDate, trip.endDate, L.monthNames);
  })();

  return (
    <Pressable onPress={onPress} style={s.wrap}>
      <LinearGradient colors={v} start={[0.1, 0]} end={[1, 1]} style={s.gradient}>
        {/* Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.28)', 'transparent', 'rgba(0,0,0,0.44)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Status pill */}
        <View style={s.topRow}>
          <View style={s.pill}>
            <View style={[s.dot, isOngoing && s.dotPulse]} />
            <Text style={s.pillText}>{(isOngoing ? L.ongoing : L.nextTrip).toUpperCase()}</Text>
          </View>
          {trip.airline ? (
            <View style={s.airlinePill}>
              <Text style={s.airlineText}>{trip.airline}</Text>
            </View>
          ) : null}
        </View>

        {/* Bottom info */}
        <View style={s.bottom}>
          <Text style={s.country}>{trip.country === 'US' ? 'United States' : (lang === 'pt' ? 'Brasil' : 'Brazil')}</Text>
          <Text style={s.city}>{trip.city}</Text>
          <Text style={s.subtitle}>{fmtDateRange(trip.startDate, trip.endDate, L.monthNames)} · {countdown}</Text>

          {/* Glass stats */}
          <View style={s.glass}>
            <View style={s.statCol}>
              <Text style={s.statLabel}>{L.spent.toUpperCase()}</Text>
              <Text style={s.statValue}>{fmtMoneyShort(spent)} <Text style={s.statMuted}>/ {fmtMoneyShort(trip.budget)}</Text></Text>
              <View style={s.miniTrack}>
                <View style={[s.miniBar, { width: `${pct * 100}%` }]} />
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.statCol}>
              <Text style={s.statLabel}>{L.pending.toUpperCase()}</Text>
              <Text style={s.statValue}>{pending.length === 0 ? L.allSet : L.itemsPending(pending.length)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { borderRadius: 22, overflow: 'hidden', height: 244 },
  gradient: { flex: 1, padding: 0 },
  topRow: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.4)' },
  dot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#fff' },
  dotPulse: { opacity: 0.9 },
  pillText: { fontSize: 11, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  airlinePill: { backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  airlineText: { fontSize: 11, fontWeight: '700', color: '#111', letterSpacing: 0.2 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18 },
  country: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.85)', marginBottom: 2 },
  city: { fontSize: 32, fontWeight: '700', color: '#fff', letterSpacing: -0.6, lineHeight: 36 },
  subtitle: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.92)', marginTop: 6, marginBottom: 14 },
  glass: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.3)' },
  statCol: { flex: 1 },
  statLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5 },
  statValue: { fontSize: 14, fontWeight: '700', color: '#fff', marginTop: 2, letterSpacing: -0.2 },
  statMuted: { fontWeight: '500', opacity: 0.75 },
  miniTrack: { marginTop: 6, height: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  miniBar: { height: 3, backgroundColor: '#fff', borderRadius: 999 },
  divider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
});
