// Trip CRUD operations

export async function getAllTrips(db) {
  const rows = await db.getAllAsync(`SELECT * FROM trips ORDER BY start_date ASC`);
  return rows.map(normalize);
}

export async function getTripById(db, id) {
  const row = await db.getFirstAsync(`SELECT * FROM trips WHERE id = ?`, [id]);
  return row ? normalize(row) : null;
}

export async function createTrip(db, trip) {
  const id = `trip-${Date.now()}`;
  await db.runAsync(
    `INSERT INTO trips
      (id, name, city, country, airline, notes, start_date, end_date, budget, currency,
       flights_price, flight_out_code, flight_out_booking, flight_out_seat, flight_out_time,
       flight_back_code, flight_back_booking, flight_back_seat, flight_back_time,
       lodging_done, lodging_kind, lodging_name, lodging_code, lodging_price, lodging_paid_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      trip.name, trip.city, trip.country || 'BR', trip.airline || '', trip.notes || '',
      trip.start_date, trip.end_date, trip.budget || 0, trip.currency || 'BRL',
      trip.flights_price ?? null,
      trip.flight_out_code || '', trip.flight_out_booking || '', trip.flight_out_seat || '', trip.flight_out_time || '',
      trip.flight_back_code || '', trip.flight_back_booking || '', trip.flight_back_seat || '', trip.flight_back_time || '',
      trip.lodging_done ? 1 : 0,
      trip.lodging_kind || 'hotel', trip.lodging_name || '', trip.lodging_code || '',
      trip.lodging_price ?? null, trip.lodging_paid_at || 'booking',
    ]
  );
  return id;
}

export async function updateTripLodging(db, tripId, lodging) {
  await db.runAsync(
    `UPDATE trips SET
       lodging_done = ?, lodging_kind = ?, lodging_name = ?,
       lodging_code = ?, lodging_price = ?, lodging_paid_at = ?
     WHERE id = ?`,
    [
      lodging.done ? 1 : 0,
      lodging.kind || 'hotel',
      lodging.name || '',
      lodging.code || '',
      lodging.price ?? null,
      lodging.paid_at || 'booking',
      tripId,
    ]
  );
}

export async function deleteTrip(db, id) {
  await db.runAsync(`DELETE FROM trips WHERE id = ?`, [id]);
}

function normalize(row) {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    country: row.country,
    airline: row.airline || '',
    notes: row.notes || '',
    startDate: row.start_date,
    endDate: row.end_date,
    budget: row.budget,
    currency: row.currency,
    flightsPrice: row.flights_price,
    checklist: {
      flightOut: {
        code: row.flight_out_code || '',
        booking: row.flight_out_booking || '',
        seat: row.flight_out_seat || '',
        time: row.flight_out_time || '',
        airline: row.airline || '',
        done: !!(row.flight_out_code),
      },
      flightBack: {
        code: row.flight_back_code || '',
        booking: row.flight_back_booking || '',
        seat: row.flight_back_seat || '',
        time: row.flight_back_time || '',
        airline: row.airline || '',
        done: !!(row.flight_back_code),
      },
      lodging: {
        done: row.lodging_done === 1,
        kind: row.lodging_kind || 'hotel',
        name: row.lodging_name || '',
        code: row.lodging_code || '',
        price: row.lodging_price,
        paidAt: row.lodging_paid_at || 'booking',
      },
    },
    expenses: [],
    createdAt: row.created_at,
  };
}
