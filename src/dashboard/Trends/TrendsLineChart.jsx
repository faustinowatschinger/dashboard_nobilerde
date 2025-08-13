import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import dayjs from 'dayjs';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

const TrendsLineChart = ({ series = [], metric = 'volumen', bucket = 'day' }) => {
  const data = useMemo(() => {
    const map = {};
    series.forEach((s) => {
      s.values.forEach((v) => {
        const key = v.date;
        if (!map[key]) map[key] = { date: v.date };
        map[key][s.entity] = v.value;
        map[key][`${s.entity}_sample`] = v.sample;
      });
    });
    return Object.values(map).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  }, [series]);

  const formatDate = (d) => {
    const date = dayjs(d);
    switch (bucket) {
      case 'week':
        return date.format('DD MMM');
      case 'month':
        return date.format('MMM YYYY');
      default:
        return date.format('DD MMM');
    }
  };

  const formatValue = (v) => (metric === 'descubrimiento' ? `${v}%` : v);

  const CustomTooltip = ({ active, label, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#fff', padding: 10, border: '1px solid #ccc' }}>
        <p>{formatDate(label)}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatValue(p.value)} (n={p.payload[`${p.name}_sample`] || 0})
          </p>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis tickFormatter={formatValue} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {series.map((s, idx) => (
          <Line
            key={s.entity}
            type="monotone"
            dataKey={s.entity}
            stroke={COLORS[idx % COLORS.length]}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendsLineChart;
