import React, { useState } from 'react';
import {
  View, Text, Modal, TextInput, Pressable, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { createTrip } from '../db/trips';
import { createExpense } from '../db/expenses';

const AIRLINES = ['LATAM', 'GOL', 'Azul', 'Outro'];

export default function NewTripModal({ visible, onClose, onSave, theme, lang }) {
  const db = useSQLiteContext();
  const L = require('../constants/i18n').STR[lang];

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [airline, setAirline] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [flightOutCode, setFlightOutCode] = useState('');
  const [flightOutBooking, setFlightOutBooking] = useState('');
  const [flightOutSeat, setFlightOutSeat] = useState('');
  const [flightBackCode, setFlightBackCode] = useState('');
  const [flightBackBooking, setFlightBackBooking] = useState('');
  const [flightBackSeat, setFlightBackSeat] = useState('');
  const [flightsPrice, setFlightsPrice] = useState('');
  const [lodgingOn, setLodgingOn] = useState(false);
  const [lodgingKind, setLodgingKind] = useState('hotel');
  const [lodgingName, setLodgingName] = useState('');
  const [lodgingCode, setLodgingCode] = useState('');
  const [lodgingPrice, setLodgingPrice] = useState('');

  const canSave = name.trim() && city.trim() && startDate && endDate;

  const reset = () => {
    setName(''); setCity(''); setAirline(''); setNotes('');
    setStartDate(''); setEndDate(''); setBudget('');
    setFlightOutCode(''); setFlightOutBooking(''); setFlightOutSeat('');
    setFlightBackCode(''); setFlightBackBooking(''); setFlightBackSeat('');
    setFlightsPrice(''); setLodgingOn(false); setLodgingKind('hotel');
    setLodgingName(''); setLodgingCode(''); setLodgingPrice('');
  };

  const handleSave = async () => {
    if (!canSave) return;
    const fp = parseFloat(flightsPrice) || null;
    const id = await createTrip(db, {
      name: name.trim(),
      city: city.trim(),
      country: 'BR',
      airline,
      notes,
      start_date: startDate,
      end_date: endDate,
      budget: parseFloat(budget) || 0,
      currency: 'BRL',
      flights_price: fp,
      flight_out_code: flightOutCode,
      flight_out_booking: flightOutBooking,
      flight_out_seat: flightOutSeat,
      flight_back_code: flightBackCode,
      flight_back_booking: flightBackBooking,
      flight_back_seat: flightBackSeat,
      lodging_done: lodgingOn && lodgingName.trim() ? 1 : 0,
      lodging_kind: lodgingKind,
      lodging_name: lodgingName,
      lodging_code: lodgingCode,
      lodging_price: parseFloat(lodgingPrice) || null,
      lodging_paid_at: 'booking',
    });
    if (fp && fp > 0) {
      await createExpense(db, {
        trip_id: id, date: startDate, category: 'flight',
        amount: fp, description: `${airline} ${flightOutCode}/${flightBackCode}`.trim(),
      });
    }
    if (lodgingOn && lodgingName.trim() && parseFloat(lodgingPrice) > 0) {
      await createExpense(db, {
        trip_id: id, date: startDate, category: 'hotel',
        amount: parseFloat(lodgingPrice), description: lodgingName,
      });
    }
    reset();
    onSave(id);
    onClose();
  };

  const input = [s.input, { backgroundColor: 'transparent', color: theme.text }];

  const Field = ({ label, children, isLast }) => (
    <View>
      <View style={s.fieldRow}>
        <Text style={[s.fieldLabel, { color: theme.text }]}>{label}</Text>
        <View style={s.fieldValue}>{children}</View>
      </View>
      {!isLast && <View style={[s.sep, { backgroundColor: theme.separator }]} />}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { reset(); onClose(); }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.overlay}>
        <Pressable style={s.backdrop} onPress={() => { reset(); onClose(); }} />
        <View style={[s.sheet, { backgroundColor: theme.bg }]}>
          <View style={[s.handle, { backgroundColor: theme.textTertiary }]} />
          <View style={s.bar}>
            <Pressable onPress={() => { reset(); onClose(); }}><Text style={[s.barBtn, { color: theme.accent }]}>{L.cancel}</Text></Pressable>
            <Text style={[s.barTitle, { color: theme.text }]}>{L.newTrip}</Text>
            <Pressable onPress={handleSave} disabled={!canSave}><Text style={[s.barBtn, { color: canSave ? theme.accent : theme.textTertiary, fontWeight: '700' }]}>{L.save}</Text></Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Basic info */}
            <Text style={[s.section, { color: theme.textMuted }]}>{L.details.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Field label={L.tripName}>
                <TextInput value={name} onChangeText={setName} style={input} placeholder={lang === 'pt' ? 'Ex: Workshop Q2' : 'e.g. Q2 Workshop'} placeholderTextColor={theme.textMuted} />
              </Field>
              <Field label={L.destination} isLast>
                <TextInput value={city} onChangeText={setCity} style={input} placeholder={lang === 'pt' ? 'Cidade' : 'City'} placeholderTextColor={theme.textMuted} />
              </Field>
            </View>

            {/* Dates */}
            <Text style={[s.section, { color: theme.textMuted }]}>{L.dates.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Field label={L.departure}>
                <TextInput value={startDate} onChangeText={setStartDate} style={input} placeholder="AAAA-MM-DD" placeholderTextColor={theme.textMuted} />
              </Field>
              <Field label={L.return} isLast>
                <TextInput value={endDate} onChangeText={setEndDate} style={input} placeholder="AAAA-MM-DD" placeholderTextColor={theme.textMuted} />
              </Field>
            </View>

            {/* Airline picker */}
            <Text style={[s.section, { color: theme.textMuted }]}>{L.airline.toUpperCase()}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {AIRLINES.map((a) => (
                <Pressable key={a} onPress={() => setAirline(airline === a ? '' : a)}
                  style={[s.airlineBtn, { borderColor: airline === a ? theme.accent : theme.border, backgroundColor: airline === a ? theme.accent + '18' : 'transparent' }]}>
                  <Text style={[s.airlineName, { color: airline === a ? theme.accent : theme.text, fontWeight: airline === a ? '700' : '500' }]}>{a}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Flights */}
            <Text style={[s.section, { color: theme.textMuted }]}>{L.flights.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Field label={`${L.flightOut} №`}>
                <TextInput value={flightOutCode} onChangeText={setFlightOutCode} style={input} placeholder="LA3032" placeholderTextColor={theme.textMuted} autoCapitalize="characters" />
              </Field>
              <Field label={`${L.flightBack} №`}>
                <TextInput value={flightBackCode} onChangeText={setFlightBackCode} style={input} placeholder="LA3033" placeholderTextColor={theme.textMuted} autoCapitalize="characters" />
              </Field>
              <Field label={L.totalPrice} isLast>
                <View style={s.priceRow}>
                  <Text style={{ color: theme.textMuted }}>R$</Text>
                  <TextInput value={flightsPrice} onChangeText={setFlightsPrice} style={input} placeholder="0,00" placeholderTextColor={theme.textMuted} keyboardType="decimal-pad" />
                </View>
              </Field>
            </View>

            {/* Lodging toggle */}
            <View style={s.toggleRow}>
              <Text style={[s.section, { color: theme.textMuted, marginBottom: 0 }]}>{L.lodging.toUpperCase()}</Text>
              <Switch value={lodgingOn} onValueChange={setLodgingOn} trackColor={{ false: '#767577', true: theme.accent }} />
            </View>
            {lodgingOn && (
              <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Field label={L.lodgingName}>
                  <TextInput value={lodgingName} onChangeText={setLodgingName} style={input} placeholder={lang === 'pt' ? 'Ex: Hotel Fasano' : 'e.g. Hotel Fasano'} placeholderTextColor={theme.textMuted} />
                </Field>
                <Field label={L.confirmationCode}>
                  <TextInput value={lodgingCode} onChangeText={setLodgingCode} style={input} placeholder="HTL-123" placeholderTextColor={theme.textMuted} autoCapitalize="characters" />
                </Field>
                <Field label={L.price} isLast>
                  <View style={s.priceRow}>
                    <Text style={{ color: theme.textMuted }}>R$</Text>
                    <TextInput value={lodgingPrice} onChangeText={setLodgingPrice} style={input} placeholder="0,00" placeholderTextColor={theme.textMuted} keyboardType="decimal-pad" />
                  </View>
                </Field>
              </View>
            )}

            {/* Budget */}
            <Text style={[s.section, { color: theme.textMuted }]}>{L.budget.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Field label={L.amount} isLast>
                <View style={s.priceRow}>
                  <Text style={{ color: theme.textMuted }}>R$</Text>
                  <TextInput value={budget} onChangeText={setBudget} style={input} placeholder="0,00" placeholderTextColor={theme.textMuted} keyboardType="decimal-pad" />
                </View>
              </Field>
            </View>

            {/* Notes */}
            <Text style={[s.section, { color: theme.textMuted }]}>{L.tripNotes.toUpperCase()}</Text>
            <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border, padding: 14 }]}>
              <TextInput value={notes} onChangeText={setNotes} placeholder={L.tripNotesPlaceholder} placeholderTextColor={theme.textMuted} style={[{ color: theme.text, fontSize: 15, minHeight: 72 }]} multiline numberOfLines={4} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '92%' },
  handle: { width: 36, height: 5, borderRadius: 999, alignSelf: 'center', marginTop: 8, marginBottom: 4 },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 8 },
  barBtn: { fontSize: 17, fontWeight: '500' },
  barTitle: { fontSize: 17, fontWeight: '600' },
  section: { fontSize: 13, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 20, marginBottom: 8, paddingHorizontal: 20 },
  card: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  fieldRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  fieldLabel: { fontSize: 15, width: 110, flexShrink: 0 },
  fieldValue: { flex: 1 },
  sep: { height: 0.5, marginLeft: 14 },
  input: { fontSize: 16, flex: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  airlineBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, borderWidth: 1, marginBottom: 16 },
  airlineName: { fontSize: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20, marginBottom: 8 },
});
