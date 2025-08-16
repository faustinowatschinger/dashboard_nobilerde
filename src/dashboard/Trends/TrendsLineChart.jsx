// src/dashboard/Trends/TrendsLineChart.jsx
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import dayjs from 'dayjs';

const TrendsLineChart = ({ series = [], metric = 'volumen', bucket = 'day' }) => {
  const theme = useTheme();

  // Transformar datos al formato que funciona en Overview
  const { data } = useMemo(() => {
    if (!Array.isArray(series) || series.length === 0) {
      return { data: [] };
    }

    const map = {};

    series.forEach((s) => {
      const values = s.values || s.data || [];
      const entityName = s.entity || s.name || 'Sin nombre';

      if (!Array.isArray(values)) return;

      values.forEach((v) => {
        if (!v || !v.date) return;
        const key = v.date;
        if (!map[key]) map[key] = { period: v.date };
        map[key][entityName] = v.value || 0;
      });
    });

    const result = Object.values(map).sort((a, b) => dayjs(a.period).diff(dayjs(b.period)));
    return { data: result };
  }, [series]);

  // Formatear eje X según la granularidad
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    let date;
    if (typeof tickItem === 'string') {
      if (tickItem.includes('T') || tickItem.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date = dayjs(tickItem);
      } else {
        return String(tickItem).substring(0, 10);
      }
    } else {
      date = dayjs(tickItem);
    }
    if (!date.isValid()) return String(tickItem).substring(0, 10);

    switch (bucket) {
      case 'hora': 
      case 'hour': 
        return date.format('HH:mm');
      case 'dia':
      case 'day': 
        return date.format('DD/MM');
      case 'semana':
      case 'week': 
        return date.format('DD/MM');
      case 'mes':
      case 'month': 
        return date.format('MMM YY');
      case 'año':
      case 'year': 
        return date.format('YYYY');
      default: 
        return date.format('DD/MM');
    }
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[4],
            minWidth: 200
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
            {formatXAxis(label)}
          </Typography>

          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: entry.color
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {metric === 'descubrimiento' ? `${entry.value}%` : entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
          border: `2px dashed ${theme.palette.divider}`
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          No hay datos disponibles para mostrar
          <br />
          <Typography variant="caption" component="span">
            Selecciona diferentes filtros o períodos
          </Typography>
        </Typography>
      </Box>
    );
  }

  // Configurar colores del tema
  const allKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'period') : [];
  const colorArray = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={alpha(theme.palette.divider, 0.5)}
            vertical={false}
          />
          
          <XAxis
            dataKey="period"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            axisLine={{ stroke: theme.palette.divider }}
            tickLine={{ stroke: theme.palette.divider }}
          />
          
          <YAxis
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            axisLine={{ stroke: theme.palette.divider }}
            tickLine={{ stroke: theme.palette.divider }}
            gridLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: 20,
              fontSize: 12
            }}
          />
          
          {allKeys.map((entityName, index) => {
            const hasData = data.some(point => point[entityName] !== undefined && point[entityName] !== null);
            if (!hasData) return null;

            const color = colorArray[index % colorArray.length];
            
            return (
              <Line
                key={entityName}
                type="monotone"
                dataKey={entityName}
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                name={entityName}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TrendsLineChart;
