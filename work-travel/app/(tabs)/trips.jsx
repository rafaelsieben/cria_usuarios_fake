import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import TripCard from '../../src/components/TripCard';
import NewTripModal from '../../src/components/NewTripModal';
import { tripStatus } from '../../src/constants/helpers';

const FILTERS = ['upcoming', 'past', 'all'];

export default function TripsScreen() {
  const { trips, loadTrips, theme, settings } = useApp();
  const lang = settings.lang;
  const L = require('../../src/constants/i18n').STR[lang];

  const [filter, setFilter] = useState('upcoming');
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    let list = trips;
    if (filter === 'upcoming') list = list.filter((t) => tripStatus(t).state !== 'past');
    else if (filter === 'past') list = list.filter((t) => tripStatus(t).state === 'past');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.city?.toLowerCase().includes(q) || t.name?.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      if (filter === 'past') return new Date(b.startDate) - new Date(a.startDate);
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }, [trips, filter, search]);

  const filterLabel = { upcoming: L.upcoming, past: L.past, all: L.all };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={[s.title, { color: theme.text }]}>{L.tabTrips}</Text>
        <Pressable onPress={() => setShowNew(true)}
          style={[s.addBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]}>
          <Text style={{ color: '#fff', fontSize: 22, lineHeight: 26 }}>+</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={[s.searchWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={{ fontSize: 15, color: theme.textMuted, marginRight: 8 }}>🔍</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={lang === 'pt' ? 'Buscar viagem...' : 'Search trip...'}
          placeholderTextColor={theme.textMuted}
          style={[s.searchInput, { color: theme.text }]}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Text style={{ fontSize: 16, color: theme.textMuted }}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter tabs */}
      <View style={[s.segWrap, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[s.segBtn, filter === f && { backgroundColor: theme.accent, shadowColor: theme.accent }]}>
            <Text style={[s.segLabel, { color: filter === f ? '#fff' : theme.textMuted }]}>
              {filterLabel[f]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <View style={[s.empty, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>🧳</Text>
            <Text style={[s.emptyTitle, { color: theme.text }]}>
              {search ? (lang === 'pt' ? 'Nenhum resultado' : 'No results') : L.noTripsYet}
            </Text>
            <Text style={[s.emptySub, { color: theme.textMuted }]}>
              {search ? '' : L.noTripsYetSub}
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 0, marginTop: 8 }}>
            {filtered.map((t) => (
              <TripCard
                key={t.id}
                trip={t}
                theme={theme}
                lang={lang}
                onPress={() => router.push(`/trip/${t.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <NewTripModal
        visible={showNew}
        onClose={() => setShowNew(false)}
        onSave={loadTrips}
        theme={theme}
        lang={lang}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6 },
  addBtn: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  searchWrap: { marginHorizontal: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  segWrap: { marginHorizontal: 16, marginBottom: 4, flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, gap: 4 },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  segLabel: { fontSize: 13, fontWeight: '600' },
  empty: { margin: 16, marginTop: 32, padding: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center' },
});
