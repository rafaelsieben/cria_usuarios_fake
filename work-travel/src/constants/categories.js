export const CATEGORIES = {
  flight:    { key: 'flight',    labelPt: 'Passagem',       labelEn: 'Flight',      color: '#6366F1' },
  hotel:     { key: 'hotel',     labelPt: 'Hospedagem',     labelEn: 'Lodging',     color: '#F59E0B' },
  transport: { key: 'transport', labelPt: 'Transporte',     labelEn: 'Transport',   color: '#10B981' },
  food:      { key: 'food',      labelPt: 'Alimentação',    labelEn: 'Food',        color: '#EF4444' },
  parking:   { key: 'parking',   labelPt: 'Estacionamento', labelEn: 'Parking',     color: '#64748B' },
  carRental: { key: 'carRental', labelPt: 'Aluguel',        labelEn: 'Car rental',  color: '#8B5CF6' },
  leisure:   { key: 'leisure',   labelPt: 'Lazer',          labelEn: 'Leisure',     color: '#EC4899' },
  other:     { key: 'other',     labelPt: 'Outros',         labelEn: 'Other',       color: '#94A3B8' },
};

export const CATEGORY_KEYS = ['food', 'transport', 'parking', 'hotel', 'flight', 'carRental', 'leisure', 'other'];

export const CITY_GRADIENTS = {
  'São Paulo':      ['#1E3A8A', '#7C3AED'],
  'Rio de Janeiro': ['#0EA5E9', '#F59E0B'],
  'Porto Alegre':   ['#0F766E', '#22C55E'],
  'Belo Horizonte': ['#7C2D12', '#F97316'],
  'Curitiba':       ['#065F46', '#10B981'],
  'Nova York':      ['#0F172A', '#475569'],
  'New York':       ['#0F172A', '#475569'],
  'Brasília':       ['#1E40AF', '#0EA5E9'],
  'Salvador':       ['#9A3412', '#FBBF24'],
  'Recife':         ['#0E7490', '#06B6D4'],
  'Florianópolis':  ['#0369A1', '#22D3EE'],
};

export function getCityGradient(city) {
  return CITY_GRADIENTS[city] || ['#0F172A', '#3B82F6'];
}
