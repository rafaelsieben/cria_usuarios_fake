export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function fmtMoney(v, currency = 'BRL') {
  if (v == null) return '—';
  const abs = Math.abs(v);
  const symbol = currency === 'USD' ? 'US$' : 'R$';
  const n =
    abs >= 1000
      ? abs.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      : abs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${v < 0 ? '-' : ''}${symbol} ${n}`;
}

export function fmtMoneyShort(v, currency = 'BRL') {
  if (v == null) return '—';
  const symbol = currency === 'USD' ? '$' : 'R$';
  if (v >= 1000) return `${symbol} ${(v / 1000).toFixed(1).replace('.', ',')}k`;
  return `${symbol} ${Math.round(v)}`;
}

export function fmtDateShort(iso, monthNames) {
  const d = parseDate(iso);
  return `${d.getDate()} ${monthNames[d.getMonth()]}`;
}

export function fmtDateRange(a, b, monthNames) {
  const da = parseDate(a);
  const db = parseDate(b);
  if (da.getMonth() === db.getMonth()) {
    return `${da.getDate()}–${db.getDate()} ${monthNames[da.getMonth()]}`;
  }
  return `${da.getDate()} ${monthNames[da.getMonth()]} – ${db.getDate()} ${monthNames[db.getMonth()]}`;
}

export function fmtDateLong(iso, monthFull) {
  const d = parseDate(iso);
  return `${d.getDate()} ${monthFull[d.getMonth()]}`;
}

export function fmtTime(iso) {
  if (!iso) return '';
  const t = new Date(iso);
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
}

export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

export function tripSpent(expenses) {
  return expenses.reduce((s, e) => s + e.amount, 0);
}

export function tripPending(trip) {
  const list = [];
  if (!trip.checklist?.lodging?.done) list.push('lodging');
  return list;
}

export function tripStatus(trip, today = new Date()) {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const s = parseDate(trip.startDate);
  const e = parseDate(trip.endDate);
  if (todayMidnight < s) return { state: 'upcoming', days: daysBetween(todayMidnight, s) };
  if (todayMidnight > e) return { state: 'past', days: daysBetween(e, todayMidnight) };
  return { state: 'ongoing', days: 0 };
}

export function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
