import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import HeroCard from '../../src/components/HeroCard';
import TripCard from '../../src/components/TripCard';
import QuickAddSheet from '../../src/components/QuickAddSheet';
import NewTripModal from '../../src/components/NewTripModal';
import { tripStatus, fmtMoneyShort, fmtDateRange, parseDate } from '../../src/constants/helpers';

export default function CalendarScreen() {
  const { trips, loadTrips, theme, settings } = useApp();
  const lang = settings.lang;
  const L = require('../../src/constants/i18n').STR[lang];
  const today = new Date();

  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [showQuick, setShowQuick] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayMap = useMemo(() => {
    const map = {};
    trips.forEach((t) => {
      const s = parseDate(t.startDate), e = parseDate(t.endDate);
      const cur = new Date(s);
      while (cur <= e) {
        if (cur.getFullYear() === year && cur.getMonth() === month) {
          (map[cur.getDate()] ||= []).push(t);
        }
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [trips, year, month]);

  const monthTrips = useMemo(() => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return trips.filter((t) => {
      const s = parseDate(t.startDate), e = parseDate(t.endDate);
      return e >= start && s <= end;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [trips, year, month]);

  const upcoming = useMemo(() =>
    trips.filter((t) => new Date(t.startDate) >= today).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
    [trips]
  );

  const ongoingTrip = trips.find((t) => tripStatus(t).state === 'ongoing');
  const heroTrip = ongoingTrip || upcoming[0];
  const carouselTrips = upcoming.filter((t) => !heroTrip || t.id !== heroTrip.id).slice(0, 6);

  const suggestedTripId = useMemo(() => {
    if (ongoingTrip) return ongoingTrip.id;
    const soon = trips.find((t) => { const st = tripStatus(t); return st.state === 'upcoming' && st.days <= 3; });
    if (soon) return soon.id;
    const justEnded = trips.find((t) => { const st = tripStatus(t); return st.state === 'past' && st.days <= 3; });
    return justEnded?.id || null;
  }, [trips]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const h = today.getHours();
  const greeting = lang === 'pt'
    ? (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')
    : (h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }}>
            <Text style={[s.greeting, { color: theme.textMuted }]}>{greeting},</Text>
            <Text style={[s.ready, { color: theme.text }]}>
              {lang === 'pt' ? 'pronto para a próxima\nviagem?' : 'ready for your\nnext trip?'}
            </Text>
          </View>
          <Pressable onPress={() => setShowNew(true)} style={[s.addBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]}>
            <Text style={{ color: '#fff', fontSize: 22, lineHeight: 26 }}>+</Text>
          </Pressable>
        </View>

        {/* Hero card */}
        {heroTrip ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 22 }}>
            <HeroCard trip={heroTrip} theme={theme} lang={lang} onPress={() => router.push(`/trip/${heroTrip.id}`)} />
          </View>
        ) : (
          <View style={[s.emptyHero, { borderColor: theme.accent + '55', backgroundColor: theme.accent + '18' }]}>
            <Text style={{ fontSize: 44, marginBottom: 8 }}>✈️</Text>
            <Text style={[s.emptyTitle, { color: theme.text }]}>{lang === 'pt' ? 'Sem viagens à vista' : 'No trips ahead'}</Text>
            <Text style={[s.emptySub, { color: theme.textMuted }]}>{L.noTripsYetSub}</Text>
          </View>
        )}

        {/* Upcoming carousel */}
        {carouselTrips.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={s.sectionHead}>
              <Text style={[s.sectionTitle, { color: theme.text }]}>{L.upcomingTrips}</Text>
              <Text style={[s.sectionCount, { color: theme.textMuted }]}>{carouselTrips.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {carouselTrips.map((t) => (
                <Pressable key={t.id} onPress={() => router.push(`/trip/${t.id}`)}
                  style={[s.miniCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={s.miniCity} numberOfLines={1}>{t.city}</Text>
                  <Text style={[s.miniDates, { color: theme.textMuted }]}>{fmtDateRange(t.startDate, t.endDate, L.monthNames)}</Text>
                  {tripStatus(t).state === 'upcoming' && (
                    <Text style={[s.miniStatus, { color: theme.accent }]}>{L.inDays(tripStatus(t).days)}</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Calendar */}
        <View style={s.calHeader}>
          <View>
            <Text style={[s.calMonth, { color: theme.text }]}>{L.monthFull[month]} <Text style={{ color: theme.textMuted }}>{year}</Text></Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Pressable onPress={() => setCursor(new Date(year, month - 1, 1))} style={[s.navBtn, { backgroundColor: theme.card }]}>
              <Text style={{ color: theme.text, fontSize: 16 }}>‹</Text>
            </Pressable>
            <Pressable onPress={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))} style={[s.navBtn, { backgroundColor: theme.card, paddingHorizontal: 12, width: 'auto' }]}>
              <Text style={{ color: theme.accent, fontSize: 12, fontWeight: '700' }}>{L.jumToToday || 'Hoje'}</Text>
            </Pressable>
            <Pressable onPress={() => setCursor(new Date(year, month + 1, 1))} style={[s.navBtn, { backgroundColor: theme.card }]}>
              <Text style={{ color: theme.text, fontSize: 16 }}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <View style={[s.calCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Weekday labels */}
            <View style={s.weekRow}>
              {L.weekdays.map((w, i) => (
                <Text key={i} style={[s.weekDay, { color: theme.textMuted }]}>{w}</Text>
              ))}
            </View>
            {/* Day grid */}
            <View style={s.dayGrid}>
              {cells.map((d, i) => {
                if (d === null) return <View key={i} style={s.dayCell} />;
                const dayTrips = dayMap[d] || [];
                const trip = dayTrips[0];
                const todayCell = isToday(d);
                const cellDate = new Date(year, month, d);
                const isStart = trip && parseDate(trip.startDate).getTime() === cellDate.getTime();
                const isEnd = trip && parseDate(trip.endDate).getTime() === cellDate.getTime();
                return (
                  <Pressable key={i} onPress={() => trip && router.push(`/trip/${trip.id}`)} style={s.dayCell}>
                    {trip && (
                      <View style={[s.tripBand, {
                        backgroundColor: todayCell ? theme.accent : theme.accent + '20',
                        borderTopLeftRadius: isStart ? 999 : 0,
                        borderBottomLeftRadius: isStart ? 999 : 0,
                        borderTopRightRadius: isEnd ? 999 : 0,
                        borderBottomRightRadius: isEnd ? 999 : 0,
                        left: isStart ? 4 : 0,
                        right: isEnd ? 4 : 0,
                      }]} />
                    )}
                    {todayCell && !trip && <View style={[s.todayBg, { backgroundColor: theme.accent }]} />}
                    <Text style={[s.dayNum, {
                      color: todayCell ? '#fff' : trip ? theme.accent : theme.text,
                      fontWeight: todayCell ? '700' : trip ? '600' : '500',
                    }]}>{d}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* Month trips */}
        <View style={{ marginTop: 22, paddingBottom: 100 }}>
          <View style={s.sectionHead}>
            <Text style={[s.sectionTitle, { color: theme.text }]}>{L.thisMonth}</Text>
            <Text style={[s.sectionCount, { color: theme.textMuted }]}>{monthTrips.length} {monthTrips.length === 1 ? L.trip : L.trips}</Text>
          </View>
          {monthTrips.length === 0 ? (
            <View style={[s.noTrips, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={{ color: theme.textMuted, fontSize: 14 }}>{L.noTripsMonth}</Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 16, gap: 0 }}>
              {monthTrips.map((t) => (
                <TripCard key={t.id} trip={t} theme={theme} lang={lang} onPress={() => router.push(`/trip/${t.id}`)} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable onPress={() => setShowQuick(true)}
        style={[s.fab, { backgroundColor: theme.accent, shadowColor: theme.accent }]}>
        <Text style={s.fabIcon}>+</Text>
      </Pressable>

      <QuickAddSheet visible={showQuick} onClose={() => setShowQuick(false)} onSave={loadTrips}
        trips={trips} defaultTripId={suggestedTripId} theme={theme} lang={lang} />
      <NewTripModal visible={showNew} onClose={() => setShowNew(false)} onSave={loadTrips}
        theme={theme} lang={lang} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 22, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 14, fontWeight: '500', letterSpacing: 0.1 },
  ready: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6, lineHeight: 32, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  emptyHero: { marginHorizontal: 16, marginBottom: 22, borderRadius: 22, borderWidth: 1, borderStyle: 'dashed', padding: 36, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  emptySub: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: '700', letterSpacing: -0.3 },
  sectionCount: { fontSize: 12, fontWeight: '500' },
  miniCard: { width: 148, padding: 14, borderRadius: 16, borderWidth: 1, justifyContent: 'flex-end', height: 100 },
  miniCity: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, color: '#fff' },
  miniDates: { fontSize: 11, marginTop: 2 },
  miniStatus: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  calHeader: { paddingHorizontal: 22, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calMonth: { fontSize: 19, fontWeight: '700', letterSpacing: -0.3 },
  navBtn: { width: 36, height: 36, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  calCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600', paddingVertical: 6, letterSpacing: 0.3 },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tripBand: { position: 'absolute', top: 3, bottom: 3, left: 0, right: 0 },
  todayBg: { position: 'absolute', width: 34, height: 34, borderRadius: 999 },
  dayNum: { zIndex: 1, fontSize: 15, letterSpacing: -0.2 },
  noTrips: { marginHorizontal: 16, padding: 24, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
