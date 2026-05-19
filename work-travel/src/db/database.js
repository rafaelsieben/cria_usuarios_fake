// SQLite schema, initialization and seed data

export async function initDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'BR',
      airline TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      budget REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'BRL',
      flights_price REAL,
      flight_out_code TEXT DEFAULT '',
      flight_out_booking TEXT DEFAULT '',
      flight_out_seat TEXT DEFAULT '',
      flight_out_time TEXT DEFAULT '',
      flight_back_code TEXT DEFAULT '',
      flight_back_booking TEXT DEFAULT '',
      flight_back_seat TEXT DEFAULT '',
      flight_back_time TEXT DEFAULT '',
      lodging_done INTEGER NOT NULL DEFAULT 0,
      lodging_kind TEXT DEFAULT 'hotel',
      lodging_name TEXT DEFAULT '',
      lodging_code TEXT DEFAULT '',
      lodging_price REAL,
      lodging_paid_at TEXT DEFAULT 'booking',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    INSERT OR IGNORE INTO settings (key, value) VALUES ('seeded', 'false');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('user_name', 'Pedro Almeida');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('user_email', 'pedro@exemplo.com');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('accent', '#FF6B2C');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('dark', 'false');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('card_style', 'elevated');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('lang', 'pt');
    INSERT OR IGNORE INTO settings (key, value) VALUES ('onboarded', 'false');
  `);

  const seeded = await db.getFirstAsync(
    `SELECT value FROM settings WHERE key = 'seeded'`
  );
  if (seeded?.value !== 'true') {
    await seedDemoData(db);
    await db.runAsync(
      `UPDATE settings SET value = 'true' WHERE key = 'seeded'`
    );
  }
}

async function seedDemoData(db) {
  const trips = [
    {
      id: 't1',
      name: 'Workshop Design Q1',
      city: 'São Paulo',
      country: 'BR',
      airline: 'LATAM',
      notes: 'Levar notebook e adaptador HDMI. Workshop começa 9h na segunda.',
      start_date: '2026-02-03',
      end_date: '2026-02-06',
      budget: 4500,
      currency: 'BRL',
      flights_price: 1400,
      flight_out_code: 'LA3420',
      flight_out_booking: 'XPLM42',
      flight_out_seat: '8A',
      flight_out_time: '2026-02-03T07:10',
      flight_back_code: 'LA3517',
      flight_back_booking: 'XPLM42',
      flight_back_seat: '12C',
      flight_back_time: '2026-02-06T20:45',
      lodging_done: 1,
      lodging_kind: 'hotel',
      lodging_name: 'Hotel Fasano Itaim',
      lodging_code: 'HTL-884321',
      lodging_price: 2100,
      lodging_paid_at: 'booking',
    },
    {
      id: 't2',
      name: 'Reunião Porto Alegre',
      city: 'Porto Alegre',
      country: 'BR',
      airline: 'GOL',
      notes: 'Levar casaco, PoA costuma estar fria em março.',
      start_date: '2026-03-10',
      end_date: '2026-03-12',
      budget: 3200,
      currency: 'BRL',
      flights_price: 1150,
      flight_out_code: 'G31122',
      flight_out_time: '2026-03-10T06:20',
      flight_back_code: 'G31209',
      flight_back_time: '2026-03-12T19:00',
      lodging_done: 1,
      lodging_kind: 'airbnb',
      lodging_name: 'Loft Moinhos de Vento',
      lodging_code: 'HM-44821',
      lodging_price: 890,
      lodging_paid_at: 'booking',
    },
    {
      id: 't3',
      name: 'Summit Rio',
      city: 'Rio de Janeiro',
      country: 'BR',
      airline: 'Azul',
      notes: 'Summit no Hotel Fairmont. Jantar com time dia 15.',
      start_date: '2026-04-14',
      end_date: '2026-04-17',
      budget: 5200,
      currency: 'BRL',
      flights_price: 1710,
      flight_out_code: 'AD4010',
      flight_out_booking: 'AZFR71',
      flight_out_seat: '15F',
      flight_out_time: '2026-04-14T09:30',
      flight_back_code: 'AD4115',
      flight_back_booking: 'AZFR71',
      flight_back_seat: '16A',
      flight_back_time: '2026-04-17T18:15',
      lodging_done: 1,
      lodging_kind: 'hotel',
      lodging_name: 'Hotel Fairmont Copacabana',
      lodging_code: 'FR-772190',
      lodging_price: 2850,
      lodging_paid_at: 'booking',
    },
    {
      id: 't4',
      name: 'Kickoff Belo Horizonte',
      city: 'Belo Horizonte',
      country: 'BR',
      airline: 'LATAM',
      notes: '',
      start_date: '2026-05-05',
      end_date: '2026-05-07',
      budget: 3800,
      currency: 'BRL',
      flights_price: 1310,
      flight_out_code: 'LA2210',
      flight_out_time: '2026-05-05T08:00',
      flight_back_code: 'LA2287',
      flight_back_time: '2026-05-07T19:30',
      lodging_done: 1,
      lodging_kind: 'hotel',
      lodging_name: 'Ouro Minas Palace',
      lodging_code: 'OM-33104',
      lodging_price: 1400,
      lodging_paid_at: 'booking',
    },
    {
      id: 't5',
      name: 'Tech Conf NYC',
      city: 'Nova York',
      country: 'US',
      airline: 'LATAM',
      notes: 'Conferência anual, levar passaporte e adaptador de tomada.',
      start_date: '2026-06-08',
      end_date: '2026-06-13',
      budget: 18000,
      currency: 'BRL',
      flights_price: 8180,
      flight_out_code: 'LA8181',
      flight_out_booking: 'NYZ998',
      flight_out_seat: '22D',
      flight_out_time: '2026-06-08T22:10',
      flight_back_code: 'LA8182',
      flight_back_booking: 'NYZ998',
      flight_back_seat: '22D',
      flight_back_time: '2026-06-13T20:30',
      lodging_done: 0,
    },
    {
      id: 't6',
      name: 'Workshop Curitiba',
      city: 'Curitiba',
      country: 'BR',
      airline: 'Azul',
      notes: '',
      start_date: '2026-07-21',
      end_date: '2026-07-23',
      budget: 3000,
      currency: 'BRL',
      flights_price: 1070,
      flight_out_code: 'AD7701',
      flight_out_time: '2026-07-21T07:15',
      flight_back_code: 'AD7784',
      flight_back_time: '2026-07-23T18:40',
      lodging_done: 0,
    },
  ];

  const expenseRows = [
    { id: 'e1',  trip_id: 't1', date: '2026-02-03', category: 'flight',    amount: 1400, description: 'LATAM LA3420 / LA3517' },
    { id: 'e2',  trip_id: 't1', date: '2026-02-03', category: 'hotel',     amount: 2100, description: 'Hotel Fasano (3 noites)' },
    { id: 'e3',  trip_id: 't1', date: '2026-02-03', category: 'transport', amount: 48,   description: 'Uber GRU → hotel' },
    { id: 'e4',  trip_id: 't1', date: '2026-02-03', category: 'food',      amount: 62,   description: 'Jantar' },
    { id: 'e5',  trip_id: 't1', date: '2026-02-04', category: 'food',      amount: 38,   description: 'Almoço' },
    { id: 'e6',  trip_id: 't1', date: '2026-02-04', category: 'food',      amount: 84,   description: 'Jantar com cliente' },
    { id: 'e7',  trip_id: 't1', date: '2026-02-04', category: 'transport', amount: 22,   description: 'Uber' },
    { id: 'e8',  trip_id: 't1', date: '2026-02-05', category: 'food',      amount: 45,   description: 'Almoço' },
    { id: 'e9',  trip_id: 't1', date: '2026-02-05', category: 'food',      amount: 72,   description: 'Jantar' },
    { id: 'e10', trip_id: 't1', date: '2026-02-06', category: 'transport', amount: 55,   description: 'Uber hotel → GRU' },
    { id: 'f1',  trip_id: 't2', date: '2026-03-10', category: 'flight',    amount: 1150, description: 'GOL G31122 / G31209' },
    { id: 'f2',  trip_id: 't2', date: '2026-03-10', category: 'hotel',     amount: 890,  description: 'Airbnb' },
    { id: 'f3',  trip_id: 't2', date: '2026-03-10', category: 'parking',   amount: 85,   description: 'Estacionamento GRU' },
    { id: 'f4',  trip_id: 't2', date: '2026-03-10', category: 'food',      amount: 58,   description: 'Jantar' },
    { id: 'f5',  trip_id: 't2', date: '2026-03-11', category: 'food',      amount: 42,   description: 'Almoço' },
    { id: 'f6',  trip_id: 't2', date: '2026-03-11', category: 'transport', amount: 35,   description: 'Uber' },
    { id: 'f7',  trip_id: 't2', date: '2026-03-11', category: 'food',      amount: 64,   description: 'Jantar' },
    { id: 'f8',  trip_id: 't2', date: '2026-03-12', category: 'food',      amount: 39,   description: 'Almoço' },
    { id: 'g1',  trip_id: 't3', date: '2026-04-14', category: 'flight',    amount: 1710, description: 'Azul AD4010 / AD4115' },
    { id: 'g2',  trip_id: 't3', date: '2026-04-14', category: 'transport', amount: 72,   description: 'Táxi aeroporto' },
    { id: 'g3',  trip_id: 't3', date: '2026-04-14', category: 'hotel',     amount: 2850, description: 'Fairmont (3 noites)' },
    { id: 'g4',  trip_id: 't3', date: '2026-04-14', category: 'food',      amount: 95,   description: 'Jantar' },
    { id: 'g5',  trip_id: 't3', date: '2026-04-15', category: 'food',      amount: 52,   description: 'Almoço' },
    { id: 'g6',  trip_id: 't3', date: '2026-04-15', category: 'food',      amount: 118,  description: 'Jantar com cliente' },
    { id: 'g7',  trip_id: 't3', date: '2026-04-16', category: 'food',      amount: 48,   description: 'Almoço' },
    { id: 'g8',  trip_id: 't3', date: '2026-04-16', category: 'leisure',   amount: 180,  description: 'Ingresso evento' },
    { id: 'h1',  trip_id: 't4', date: '2026-05-05', category: 'flight',    amount: 1310, description: 'LATAM LA2210 / LA2287' },
    { id: 'h2',  trip_id: 't4', date: '2026-05-05', category: 'hotel',     amount: 1400, description: 'Ouro Minas' },
    { id: 'i1',  trip_id: 't5', date: '2026-06-08', category: 'flight',    amount: 8180, description: 'LATAM LA8181 / LA8182' },
  ];

  for (const t of trips) {
    await db.runAsync(
      `INSERT OR IGNORE INTO trips
        (id, name, city, country, airline, notes, start_date, end_date, budget, currency,
         flights_price, flight_out_code, flight_out_booking, flight_out_seat, flight_out_time,
         flight_back_code, flight_back_booking, flight_back_seat, flight_back_time,
         lodging_done, lodging_kind, lodging_name, lodging_code, lodging_price, lodging_paid_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        t.id, t.name, t.city, t.country, t.airline || '', t.notes || '',
        t.start_date, t.end_date, t.budget, t.currency,
        t.flights_price ?? null,
        t.flight_out_code || '', t.flight_out_booking || '', t.flight_out_seat || '', t.flight_out_time || '',
        t.flight_back_code || '', t.flight_back_booking || '', t.flight_back_seat || '', t.flight_back_time || '',
        t.lodging_done ?? 0,
        t.lodging_kind || 'hotel', t.lodging_name || '', t.lodging_code || '',
        t.lodging_price ?? null, t.lodging_paid_at || 'booking',
      ]
    );
  }

  for (const e of expenseRows) {
    await db.runAsync(
      `INSERT OR IGNORE INTO expenses (id, trip_id, date, category, amount, description)
       VALUES (?,?,?,?,?,?)`,
      [e.id, e.trip_id, e.date, e.category, e.amount, e.description]
    );
  }
}
