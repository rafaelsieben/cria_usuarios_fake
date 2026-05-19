import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { CATEGORIES, CATEGORY_KEYS } from '../../src/constants/categories';
import { fmtMoney, fmtMoneyShort, tripSpent } from '../../src/constants/helpers';
import DonutChart from '../../src/components/DonutChart';
import CategoryBar from '../../src/components/CategoryBar';

const YEARS = [2024, 2025, 2026];

export default function ReportsScreen() {
  const { trips, settings, theme } = useApp();
  const lang = settings.lang;
  const currency = settings.currency || 'BRL';
  const L = require('../../src/constants/i18n').STR[lang];

  const [year, setYear] = useState(new Date().getFullYear());

  const yearTrips = useMemo(
    () => trips.filter((t) => new Date(t.startDate).getFullYear() === year),
    [trips, year]
  );

  const totalSpent = useMemo(
    () => yearTrips.reduce((acc, t) => acc + tripSpent(t.expenses || []), 0),
    [yearTrips]
  );

  const catTotals = useMemo(() => {
    const map = {};
    CATEGORY_KEYS.forEach((k) => { map[k] = 0; });
    yearTrips.forEach((t) => {
      (t.expenses || []).forEach((e) => {
        if (map[e.category] !== undefined) map[e.category] += e.amount;
      });
    });
    return map;
  }, [yearTrips]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, () => 0);
    yearTrips.forEach((t) => {
      const m = new Date(t.startDate).getMonth();
      months[m] += tripSpent(t.expenses || []);
    });
    return months;
  }, [yearTrips]);

  const maxMonth = Math.max(...monthlyData, 1);

  const topCat = CATEGORY_KEYS.reduce((best, k) =>
    catTotals[k] > (catTotals[best] || 0) ? k : best, CATEGORY_KEYS[0]);

  const donutSlices = CATEGORY_KEYS
    .filter((k) => catTotals[k] > 0)
    .map((k) => ({ color: CATEGORIES[k].color, value: catTotals[k] }));

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={s.header}>
          <Text style={[s.title, { color: theme.text }]}>{L.tabReports}</Text>
          <View style={s.yearRow}>
            {YEARS.map((y) => (
              <Pressable
                key={y}
                onPress={() => setYear(y)}
                style={[s.yearBtn, { backgroundColor: y === year ? theme.accent : theme.card, borderColor: y === year ? theme.accent : theme.border }]}>
                <Text style={[s.yearLabel, { color: y === year ? '#fff' : theme.textMuted }]}>{y}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Summary cards */}
        <View style={s.summaryRow}>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.statLabel, { color: theme.textMuted }]}>{L.totalSpentYear}</Text>
            <Text style={[s.statValue, { color: theme.text }]} numberOfLines={1}>{fmtMoneyShort(totalSpent, currency)}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.statLabel, { color: theme.textMuted }]}>{L.tripsThisYear}</Text>
            <Text style={[s.statValue, { color: theme.text }]}>{yearTrips.length}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.statLabel, { color: theme.textMuted }]}>{L.mostSpentCategory}</Text>
            <Text style={[s.statValue, { color: CATEGORIES[topCat]?.color || theme.accent }]} numberOfLines={1}>
              {totalSpent > 0 ? (lang === 'pt' ? CATEGORIES[topCat]?.labelPt : CATEGORIES[topCat]?.labelEn) : '—'}
            </Text>
          </View>
        </View>

        {/* Monthly bar chart */}
        {yearTrips.length > 0 && (
          <View style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.sectionTitle, { color: theme.text }]}>{L.monthlyAccumulated}</Text>
            <View style={s.barChart}>
              {monthlyData.map((v, i) => {
                const pct = v / maxMonth;
                const isMax = v === maxMonth && v > 0;
                return (
                  <View key={i} style={s.barCol}>
                    <Text style={[s.barAmt, { color: theme.textMuted }]}>{v > 0 ? fmtMoneyShort(v, currency) : ''}</Text>
                    <View style={[s.barTrack, { backgroundColor: theme.border }]}>
                      <View style={[s.barFill, {
                        height: `${Math.max(pct * 100, v > 0 ? 4 : 0)}%`,
                        backgroundColor: isMax ? theme.accent : theme.accent + '60',
                        borderRadius: 4,
                      }]} />
                    </View>
                    <Text style={[s.barLabel, { color: theme.textMuted }]}>{L.monthNames[i]}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Category breakdown */}
        {totalSpent > 0 && (
          <View style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.sectionTitle, { color: theme.text }]}>{L.categoryBreakdown}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <DonutChart slices={donutSlices} size={110} strokeWidth={16} />
              <View style={{ flex: 1, gap: 8 }}>
                {CATEGORY_KEYS.filter((k) => catTotals[k] > 0)
                  .sort((a, b) => catTotals[b] - catTotals[a])
                  .slice(0, 4)
                  .map((k) => {
                    const cat = CATEGORIES[k];
                    const pct = totalSpent > 0 ? Math.round((catTotals[k] / totalSpent) * 100) : 0;
                    return (
                      <View key={k} style={s.catRow}>
                        <View style={[s.catDot, { backgroundColor: cat.color }]} />
                        <Text style={[s.catName, { color: theme.textMuted }]} numberOfLines={1}>
                          {lang === 'pt' ? cat.labelPt : cat.labelEn}
                        </Text>
                        <Text style={[s.catPct, { color: theme.text }]}>{pct}%</Text>
                      </View>
                    );
                  })}
              </View>
            </View>
            <CategoryBar expenses={
              CATEGORY_KEYS.filter((k) => catTotals[k] > 0)
                .map((k) => ({ category: k, amount: catTotals[k] }))
            } />
            <View style={[s.catTable, { borderColor: theme.separator }]}>
              {CATEGORY_KEYS.filter((k) => catTotals[k] > 0)
                .sort((a, b) => catTotals[b] - catTotals[a])
                .map((k) => {
                  const cat = CATEGORIES[k];
                  const pct = Math.round((catTotals[k] / totalSpent) * 100);
                  return (
                    <View key={k} style={[s.catTableRow, { borderColor: theme.separator }]}>
                      <View style={[s.catDot, { backgroundColor: cat.color }]} />
                      <Text style={[s.catTableName, { color: theme.text }]}>
                        {lang === 'pt' ? cat.labelPt : cat.labelEn}
                      </Text>
                      <Text style={[s.catTablePct, { color: theme.textMuted }]}>{pct}%</Text>
                      <Text style={[s.catTableAmt, { color: theme.text }]}>
                        {fmtMoney(catTotals[k], currency)}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

        {yearTrips.length === 0 && (
          <View style={[s.empty, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>📊</Text>
            <Text style={[s.emptyTitle, { color: theme.text }]}>
              {lang === 'pt' ? `Sem viagens em ${year}` : `No trips in ${year}`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 14 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6, marginBottom: 12 },
  yearRow: { flexDirection: 'row', gap: 8 },
  yearBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1 },
  yearLabel: { fontSize: 13, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  statCard: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, gap: 4 },
  statLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  statValue: { fontSize: 16, fontWeight: '700', letterSpacing: -0.4 },
  section: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, borderWidth: 1, padding: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, marginBottom: 16 },
  barChart: { flexDirection: 'row', height: 100, alignItems: 'flex-end', gap: 4 },
  barCol: { flex: 1, alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  barAmt: { fontSize: 7, textAlign: 'center' },
  barTrack: { width: '100%', flex: 1, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%' },
  barLabel: { fontSize: 9, fontWeight: '600' },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catDot: { width: 8, height: 8, borderRadius: 999 },
  catName: { flex: 1, fontSize: 12 },
  catPct: { fontSize: 12, fontWeight: '700' },
  catTable: { marginTop: 16, borderTopWidth: 1, paddingTop: 12, gap: 10 },
  catTableRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catTableName: { flex: 1, fontSize: 14 },
  catTablePct: { fontSize: 12, width: 36, textAlign: 'right' },
  catTableAmt: { fontSize: 14, fontWeight: '600', width: 90, textAlign: 'right' },
  empty: { margin: 16, marginTop: 40, padding: 40, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
});
