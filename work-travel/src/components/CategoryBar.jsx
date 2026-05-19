import React from 'react';
import { View } from 'react-native';
import { CATEGORIES } from '../constants/categories';

export default function CategoryBar({ expenses, total, height = 8, radius = 4 }) {
  const byCat = {};
  expenses.forEach((e) => {
    byCat[e.category] = (byCat[e.category] || 0) + e.amount;
  });
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const t = total || 1;

  return (
    <View style={{
      width: '100%', height, borderRadius: radius,
      overflow: 'hidden', flexDirection: 'row',
      backgroundColor: 'rgba(120,120,128,0.16)',
    }}>
      {entries.map(([k, v]) => (
        <View
          key={k}
          style={{
            width: `${(v / t) * 100}%`,
            backgroundColor: CATEGORIES[k]?.color || '#94A3B8',
          }}
        />
      ))}
    </View>
  );
}
