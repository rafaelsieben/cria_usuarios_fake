import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView,
  Alert, TextInput, Modal,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../src/context/AppContext';
import { getTripById, deleteTrip, updateTripLodging } from '../../src/db/trips';
import { getExpensesByTrip, createExpense, deleteExpense } from '../../src/db/expenses';
import { CATEGORIES, CATEGORY_KEYS, getCityGradient } from '../../src/constants/categories';
import {
  fmtMoney, fmtMoneyShort, fmtDateLong, fmtDateRange, tripSpent, daysBetween, parseDate, tripStatus,
} from '../../src/constants/helpers';
import DonutChart from '../../src/components/DonutChart';
import CategoryBar from '../../src/components/CategoryBar';

export default function TripDetail() {
  const { id } = useLocalSearchParams();
  const { db, loadTrips, theme, settings } = useApp();
  const lang = settings.lang;
  const currency = settings.currency || 'BRL';
  const L = require('../../src/constants/i18n').STR[lang];

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddExp, setShowAddExp] = useState(false);
  const [showLodging, setShowLodging] = useState(false);

  const load = useCallback(async () => {
    if (!db) return;
    const t = await getTripById(db, id);
    const exps = await getExpensesByTrip(db, id);
    setTrip(t);
    setExpenses(exps);
  }, [db, id]);

  useEffect(() => { load(); }, [load]);

  if (!trip) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: theme.textMuted }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const spent = tripSpent(expenses);
  const budget = trip.budget || 0;
  const pct = budget > 0 ? Math.min(spent / budget, 1) : 0;
  const overBudget = budget > 0 && spent > budget;
  const gradient = getCityGradient(trip.city);
  const status = tripStatus(trip);
  const nights = daysBetween(parseDate(trip.startDate), parseDate(trip.endDate));

  const catTotals = {};
  CATEGORY_KEYS.forEach((k) => { catTotals[k] = 0; });
  expenses.forEach((e) => { if (catTotals[e.category] !== undefined) catTotals[e.category] += e.amount; });

  const donutSlices = CATEGORY_KEYS
    .filter((k) => catTotals[k] > 0)
    .map((k) => ({ color: CATEGORIES[k].color, value: catTotals[k] }));

  const handleDelete = () => {
    Alert.alert(L.confirmDelete, L.confirmDeleteSub, [
      { text: L.cancel, style: 'cancel' },
      {
        text: L.delete, style: 'destructive', onPress: async () => {
          await deleteTrip(db, id);
          await loadTrips();
          router.back();
        },
      },
    ]);
  };

  const handleDeleteExpense = (expId) => {
    Alert.alert(lang === 'pt' ? 'Excluir custo?' : 'Delete expense?', '', [
      { text: L.cancel, style: 'cancel' },
      {
        text: L.delete, style: 'destructive', onPress: async () => {
          await deleteExpense(db, expId);
          await load();
          await loadTrips();
        },
      },
    ]);
  };

  const statusLabel = {
    upcoming: status.days === 0 ? L.today : status.days === 1 ? L.tomorrow : L.inDays(status.days),
    ongoing: L.ongoing,
    past: L.daysAgo(status.days),
  };

  const statusColor = {
    upcoming: theme.accent,
    ongoing: theme.success,
    past: theme.textMuted,
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <LinearGradient colors={gradient} style={s.hero}>
          <View style={s.heroOverlay} />
          {/* Back + Delete */}
          <View style={s.heroNav}>
            <Pressable onPress={() => router.back()} style={s.navBtn}>
              <Text style={s.navBtnText}>‹</Text>
            </Pressable>
            <Pressable onPress={handleDelete} style={[s.navBtn, { backgroundColor: 'rgba(255,0,0,0.3)' }]}>
              <Text style={s.navBtnText}>🗑</Text>
            </Pressable>
          </View>

          {/* Status pill */}
          <View style={[s.statusPill, { backgroundColor: statusColor[status.state] + '30', borderColor: statusColor[status.state] + '60' }]}>
            <Text style={[s.statusText, { color: statusColor[status.state] }]}>{statusLabel[status.state]}</Text>
          </View>

          {/* City & dates */}
          <Text style={s.heroCity}>{trip.city}</Text>
          <Text style={s.heroDates}>{fmtDateRange(trip.startDate, trip.endDate, L.monthNames)}</Text>
          {nights > 0 && (
            <Text style={s.heroNights}>{L.nights(nights)}</Text>
          )}

          {/* Budget summary */}
          {budget > 0 && (
            <View style={s.heroBudget}>
              <View style={s.heroBudgetRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.heroBudgetLabel}>{L.spent}</Text>
                  <Text style={[s.heroBudgetAmt, overBudget && { color: '#F87171' }]}>
                    {fmtMoneyShort(spent, currency)}
                  </Text>
                </View>
                <View style={s.heroSep} />
                <View style={{ flex: 1 }}>
                  <Text style={s.heroBudgetLabel}>{L.budget}</Text>
                  <Text style={s.heroBudgetAmt}>{fmtMoneyShort(budget, currency)}</Text>
                </View>
                <View style={s.heroSep} />
                <View style={{ flex: 1 }}>
                  <Text style={s.heroBudgetLabel}>{overBudget ? L.overBudget : L.budgetLeft}</Text>
                  <Text style={[s.heroBudgetAmt, overBudget && { color: '#F87171' }]}>
                    {fmtMoneyShort(Math.abs(budget - spent), currency)}
                  </Text>
                </View>
              </View>
              <View style={[s.progressTrack, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <View style={[s.progressFill, {
                  width: `${pct * 100}%`,
                  backgroundColor: overBudget ? '#F87171' : '#fff',
                }]} />
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Expense category donut */}
        {expenses.length > 0 && (
          <View style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[s.sectionTitle, { color: theme.text }]}>{L.byCategory}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <DonutChart slices={donutSlices} size={90} strokeWidth={14} />
              <View style={{ flex: 1, gap: 6 }}>
                {CATEGORY_KEYS.filter((k) => catTotals[k] > 0)
                  .sort((a, b) => catTotals[b] - catTotals[a])
                  .slice(0, 4)
                  .map((k) => {
                    const cat = CATEGORIES[k];
                    const pctCat = spent > 0 ? Math.round((catTotals[k] / spent) * 100) : 0;
                    return (
                      <View key={k} style={s.catRow}>
                        <View style={[s.catDot, { backgroundColor: cat.color }]} />
                        <Text style={[s.catName, { color: theme.textMuted }]} numberOfLines={1}>
                          {lang === 'pt' ? cat.labelPt : cat.labelEn}
                        </Text>
                        <Text style={[s.catAmt, { color: theme.text }]}>{fmtMoneyShort(catTotals[k], currency)}</Text>
                        <Text style={[s.catPct, { color: theme.textMuted }]}>{pctCat}%</Text>
                      </View>
                    );
                  })}
              </View>
            </View>
            <CategoryBar expenses={expenses} />
          </View>
        )}

        {/* Flights card */}
        {(trip.checklist?.flightOut?.code || trip.checklist?.flightBack?.code || trip.flightsPrice) && (
          <View style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={s.sectionHead}>
              <Text style={s.sectionIcon}>✈️</Text>
              <Text style={[s.sectionTitle, { color: theme.text }]}>{L.flights}</Text>
              {trip.flightsPrice && (
                <Text style={[s.sectionBadge, { backgroundColor: theme.accent + '20', color: theme.accent }]}>
                  {fmtMoney(trip.flightsPrice, currency)}
                </Text>
              )}
            </View>
            {trip.airline && (
              <Text style={[s.airlineLabel, { color: theme.textMuted }]}>{trip.airline}</Text>
            )}
            {trip.checklist?.flightOut?.code && (
              <FlightRow
                label={L.flightOut}
                flight={trip.checklist.flightOut}
                date={trip.startDate}
                L={L}
                theme={theme}
              />
            )}
            {trip.checklist?.flightBack?.code && (
              <FlightRow
                label={L.flightBack}
                flight={trip.checklist.flightBack}
                date={trip.endDate}
                L={L}
                theme={theme}
              />
            )}
          </View>
        )}

        {/* Lodging card */}
        <View style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={s.sectionHead}>
            <Text style={s.sectionIcon}>🏨</Text>
            <Text style={[s.sectionTitle, { color: theme.text }]}>{L.lodging}</Text>
            <Pressable
              onPress={() => setShowLodging(true)}
              style={[s.sectionBadge, { backgroundColor: theme.accent + '20' }]}>
              <Text style={[{ color: theme.accent, fontSize: 11, fontWeight: '700' }]}>{L.edit}</Text>
            </Pressable>
          </View>
          {trip.checklist?.lodging?.done ? (
            <View style={{ gap: 4 }}>
              <Text style={[s.lodgingName, { color: theme.text }]}>
                {trip.checklist.lodging.name || (trip.checklist.lodging.kind === 'airbnb' ? 'Airbnb' : 'Hotel')}
              </Text>
              {trip.checklist.lodging.code && (
                <Text style={[s.lodgingDetail, { color: theme.textMuted }]}>
                  {L.confirmationCode}: {trip.checklist.lodging.code}
                </Text>
              )}
              {trip.checklist.lodging.price && (
                <Text style={[s.lodgingDetail, { color: theme.textMuted }]}>
                  {fmtMoney(trip.checklist.lodging.price, currency)}
                  {' · '}
                  {trip.checklist.lodging.paidAt === 'site' ? L.paidOnSite : L.paidAtBooking}
                </Text>
              )}
            </View>
          ) : (
            <Pressable onPress={() => setShowLodging(true)} style={[s.pendingRow, { borderColor: theme.warning + '40', backgroundColor: theme.warning + '12' }]}>
              <Text style={{ fontSize: 14 }}>⚠️</Text>
              <Text style={[s.pendingText, { color: theme.warning }]}>{L.lodgingPending}</Text>
            </Pressable>
          )}
        </View>

        {/* Notes */}
        {trip.notes ? (
          <View style={[s.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={s.sectionHead}>
              <Text style={s.sectionIcon}>📝</Text>
              <Text style={[s.sectionTitle, { color: theme.text }]}>{L.notes}</Text>
            </View>
            <Text style={[s.notesText, { color: theme.textMuted }]}>{trip.notes}</Text>
          </View>
        ) : null}

        {/* Expenses list */}
        <View style={s.expHeader}>
          <Text style={[s.sectionTitle, { color: theme.text }]}>{L.expenses}</Text>
          <Text style={[{ color: theme.textMuted, fontSize: 13 }]}>{expenses.length}</Text>
        </View>
        {expenses.length === 0 ? (
          <View style={[s.emptyExp, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>{L.noExpenses}</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 0 }}>
            {groupExpensesByDate(expenses).map(({ date, items }) => (
              <View key={date}>
                <Text style={[s.dateHeader, { color: theme.textMuted }]}>{fmtDateLong(date, L.monthFull)}</Text>
                {items.map((e) => {
                  const cat = CATEGORIES[e.category] || CATEGORIES.other;
                  return (
                    <Pressable
                      key={e.id}
                      onLongPress={() => handleDeleteExpense(e.id)}
                      style={[s.expRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <View style={[s.catDot, { backgroundColor: cat.color, width: 10, height: 10 }]} />
                      <View style={{ flex: 1 }}>
                        <Text style={[s.expCat, { color: theme.text }]} numberOfLines={1}>
                          {lang === 'pt' ? cat.labelPt : cat.labelEn}
                          {e.description ? ` · ${e.description}` : ''}
                        </Text>
                      </View>
                      <Text style={[s.expAmt, { color: theme.text }]}>{fmtMoney(e.amount, currency)}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add expense FAB */}
      <Pressable
        onPress={() => setShowAddExp(true)}
        style={[s.fab, { backgroundColor: theme.accent, shadowColor: theme.accent }]}>
        <Text style={s.fabIcon}>+</Text>
      </Pressable>

      <AddExpenseModal
        visible={showAddExp}
        onClose={() => setShowAddExp(false)}
        onSave={async (exp) => {
          await createExpense(db, { ...exp, trip_id: id });
          await load();
          await loadTrips();
          setShowAddExp(false);
        }}
        theme={theme}
        lang={lang}
        L={L}
        currency={currency}
      />

      <LodgingModal
        visible={showLodging}
        onClose={() => setShowLodging(false)}
        onSave={async (data) => {
          await updateTripLodging(db, id, data);
          await load();
          await loadTrips();
          setShowLodging(false);
        }}
        initial={trip.checklist?.lodging}
        theme={theme}
        lang={lang}
        L={L}
        currency={currency}
      />
    </SafeAreaView>
  );
}

function FlightRow({ label, flight, date, L, theme }) {
  return (
    <View style={[s.flightRow, { borderColor: theme.separator }]}>
      <View style={{ flex: 1 }}>
        <Text style={[s.flightLabel, { color: theme.textMuted }]}>{label}</Text>
        <Text style={[s.flightCode, { color: theme.text }]}>{flight.code || '—'}</Text>
        {flight.seat && <Text style={[s.flightDetail, { color: theme.textMuted }]}>{L.seat}: {flight.seat}</Text>}
        {flight.booking && <Text style={[s.flightDetail, { color: theme.textMuted }]}>{L.confirmationCode}: {flight.booking}</Text>}
      </View>
    </View>
  );
}

function AddExpenseModal({ visible, onClose, onSave, theme, lang, L, currency }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [desc, setDesc] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const save = () => {
    const v = parseFloat(amount.replace(',', '.'));
    if (!v || v <= 0) return;
    onSave({ amount: v, category, description: desc.trim(), date: today, currency });
    setAmount(''); setDesc(''); setCategory('food');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={[s.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[s.sheetHandle, { backgroundColor: theme.separator }]} />
        <Text style={[s.sheetTitle, { color: theme.text }]}>{L.newExpense}</Text>

        {/* Amount */}
        <View style={[s.amountWrap, { borderColor: theme.border }]}>
          <Text style={[s.currencySymbol, { color: theme.textMuted }]}>{currency === 'USD' ? '$' : 'R$'}</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor={theme.textMuted}
            style={[s.amountInput, { color: theme.text }]}
            autoFocus
          />
        </View>

        {/* Category grid */}
        <View style={s.catGrid}>
          {CATEGORY_KEYS.map((k) => {
            const cat = CATEGORIES[k];
            const sel = category === k;
            return (
              <Pressable
                key={k}
                onPress={() => setCategory(k)}
                style={[s.catBtn, {
                  backgroundColor: sel ? cat.color + '25' : theme.bg,
                  borderColor: sel ? cat.color : theme.border,
                }]}>
                <Text style={[s.catBtnText, { color: sel ? cat.color : theme.textMuted }]}>
                  {lang === 'pt' ? cat.labelPt : cat.labelEn}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Description */}
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder={lang === 'pt' ? 'Descrição (opcional)' : 'Description (optional)'}
          placeholderTextColor={theme.textMuted}
          style={[s.descInput, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
        />

        <Pressable
          onPress={save}
          style={[s.saveExpBtn, { backgroundColor: amount ? theme.accent : theme.border }]}>
          <Text style={[s.saveExpText, { color: amount ? '#fff' : theme.textMuted }]}>{L.save}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function LodgingModal({ visible, onClose, onSave, initial, theme, lang, L, currency }) {
  const [done, setDone] = useState(initial?.done || false);
  const [kind, setKind] = useState(initial?.kind || 'hotel');
  const [name, setName] = useState(initial?.name || '');
  const [code, setCode] = useState(initial?.code || '');
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : '');
  const [paidAt, setPaidAt] = useState(initial?.paidAt || 'booking');

  useEffect(() => {
    if (visible && initial) {
      setDone(initial.done || false);
      setKind(initial.kind || 'hotel');
      setName(initial.name || '');
      setCode(initial.code || '');
      setPrice(initial.price ? String(initial.price) : '');
      setPaidAt(initial.paidAt || 'booking');
    }
  }, [visible]);

  const save = () => {
    onSave({
      done,
      kind,
      name: name.trim(),
      code: code.trim(),
      price: price ? parseFloat(price.replace(',', '.')) : null,
      paid_at: paidAt,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose} />
      <View style={[s.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[s.sheetHandle, { backgroundColor: theme.separator }]} />
        <Text style={[s.sheetTitle, { color: theme.text }]}>{L.lodging}</Text>

        {/* Kind */}
        <View style={[s.fieldRow, { marginBottom: 12 }]}>
          <Text style={[s.fieldLabel, { color: theme.textMuted }]}>{L.lodgingType}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['hotel', 'airbnb'].map((k) => (
              <Pressable
                key={k}
                onPress={() => setKind(k)}
                style={[s.kindBtn, {
                  backgroundColor: kind === k ? theme.accent : theme.bg,
                  borderColor: kind === k ? theme.accent : theme.border,
                }]}>
                <Text style={[{ fontSize: 13, fontWeight: '600', color: kind === k ? '#fff' : theme.textMuted }]}>
                  {k === 'hotel' ? L.lodgingHotel : 'Airbnb'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <TextInput value={name} onChangeText={setName} placeholder={L.lodgingName}
          placeholderTextColor={theme.textMuted}
          style={[s.lodgingInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]} />
        <TextInput value={code} onChangeText={setCode} placeholder={L.confirmationCode}
          placeholderTextColor={theme.textMuted}
          style={[s.lodgingInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]} />
        <TextInput value={price} onChangeText={setPrice} placeholder={L.price} keyboardType="numeric"
          placeholderTextColor={theme.textMuted}
          style={[s.lodgingInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]} />

        {/* Paid at */}
        <View style={s.fieldRow}>
          <Text style={[s.fieldLabel, { color: theme.textMuted }]}>{L.paymentTiming}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['booking', 'site'].map((p) => (
              <Pressable
                key={p}
                onPress={() => setPaidAt(p)}
                style={[s.kindBtn, {
                  backgroundColor: paidAt === p ? theme.accent : theme.bg,
                  borderColor: paidAt === p ? theme.accent : theme.border,
                }]}>
                <Text style={[{ fontSize: 12, fontWeight: '600', color: paidAt === p ? '#fff' : theme.textMuted }]}>
                  {p === 'booking' ? L.paidAtBooking : L.paidOnSite}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Done toggle */}
        <Pressable onPress={() => setDone(!done)} style={[s.doneRow, { borderColor: theme.separator }]}>
          <Text style={[{ fontSize: 14, flex: 1, color: theme.text }]}>
            {lang === 'pt' ? 'Marcado como reservado' : 'Marked as booked'}
          </Text>
          <View style={[s.checkbox, { borderColor: done ? theme.accent : theme.border, backgroundColor: done ? theme.accent : 'transparent' }]}>
            {done && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>✓</Text>}
          </View>
        </Pressable>

        <Pressable onPress={save} style={[s.saveExpBtn, { backgroundColor: theme.accent }]}>
          <Text style={[s.saveExpText, { color: '#fff' }]}>{L.save}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

function groupExpensesByDate(expenses) {
  const map = {};
  expenses.forEach((e) => {
    const d = e.date || e.created_at?.slice(0, 10) || '';
    if (!map[d]) map[d] = [];
    map[d].push(e);
  });
  return Object.keys(map)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({ date, items: map[date] }));
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  hero: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, minHeight: 280 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  heroNav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  navBtnText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  statusPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, marginBottom: 10 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  heroCity: { fontSize: 32, fontWeight: '700', color: '#fff', letterSpacing: -0.8, lineHeight: 36 },
  heroDates: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroNights: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  heroBudget: { marginTop: 16, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: 14, gap: 10 },
  heroBudgetRow: { flexDirection: 'row', alignItems: 'center' },
  heroBudgetLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  heroBudgetAmt: { fontSize: 17, fontWeight: '700', color: '#fff' },
  heroSep: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 12 },
  progressTrack: { height: 4, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  section: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionIcon: { fontSize: 17 },
  sectionTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, flex: 1 },
  sectionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  airlineLabel: { fontSize: 12, marginBottom: 10 },
  flightRow: { paddingVertical: 10, borderTopWidth: 1 },
  flightLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  flightCode: { fontSize: 16, fontWeight: '700' },
  flightDetail: { fontSize: 12, marginTop: 2 },
  lodgingName: { fontSize: 16, fontWeight: '600' },
  lodgingDetail: { fontSize: 13, marginTop: 2 },
  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  pendingText: { fontSize: 13, fontWeight: '500', flex: 1 },
  notesText: { fontSize: 14, lineHeight: 20 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  catDot: { width: 8, height: 8, borderRadius: 999 },
  catName: { flex: 1, fontSize: 12 },
  catAmt: { fontSize: 12, fontWeight: '600' },
  catPct: { fontSize: 11, width: 30, textAlign: 'right' },
  expHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 10 },
  emptyExp: { marginHorizontal: 16, padding: 24, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  dateHeader: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3, paddingVertical: 8, paddingTop: 12 },
  expRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  expCat: { fontSize: 14 },
  expAmt: { fontSize: 14, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  fabIcon: { color: '#fff', fontSize: 28, lineHeight: 32 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, borderRadius: 999, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  amountWrap: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginBottom: 16, paddingBottom: 8 },
  currencySymbol: { fontSize: 24, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '700', padding: 0 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  catBtnText: { fontSize: 12, fontWeight: '600' },
  descInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 14, marginBottom: 14 },
  saveExpBtn: { padding: 16, borderRadius: 14, alignItems: 'center' },
  saveExpText: { fontSize: 16, fontWeight: '700' },
  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  fieldLabel: { fontSize: 13, fontWeight: '600' },
  kindBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  lodgingInput: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 14, marginBottom: 10 },
  doneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, marginTop: 6, marginBottom: 14 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
