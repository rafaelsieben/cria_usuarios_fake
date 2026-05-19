// Expense CRUD operations

export async function getExpensesByTrip(db, tripId) {
  return db.getAllAsync(
    `SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC, created_at DESC`,
    [tripId]
  );
}

export async function getExpensesByYear(db, year) {
  return db.getAllAsync(
    `SELECT e.*, t.city, t.name as trip_name
     FROM expenses e
     JOIN trips t ON e.trip_id = t.id
     WHERE strftime('%Y', e.date) = ?
     ORDER BY e.date DESC`,
    [String(year)]
  );
}

export async function createExpense(db, expense) {
  const id = `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await db.runAsync(
    `INSERT INTO expenses (id, trip_id, date, category, amount, description)
     VALUES (?,?,?,?,?,?)`,
    [id, expense.trip_id, expense.date, expense.category, expense.amount, expense.description || '']
  );
  return id;
}

export async function deleteExpense(db, id) {
  await db.runAsync(`DELETE FROM expenses WHERE id = ?`, [id]);
}

export async function getSetting(db, key) {
  const row = await db.getFirstAsync(
    `SELECT value FROM settings WHERE key = ?`, [key]
  );
  return row?.value ?? null;
}

export async function setSetting(db, key, value) {
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?,?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, String(value)]
  );
}

export async function getAllSettings(db) {
  const rows = await db.getAllAsync(`SELECT key, value FROM settings`);
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}
