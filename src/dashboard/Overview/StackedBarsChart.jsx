// src/dashboard/Overview/StackedBarsChart.jsx
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { Box, Typography, useTheme, alpha, Chip } from '@mui/material';
import { PieChart } from '@mui/icons-material';

const StackedBarsChart = ({ typeBreakdown = [] }) => {
  const theme = useTheme();

  // Debug: mostrar datos recibidos
  console.log('📊 StackedBarsChart - Datos recibidos:', typeBreakdown);

  if (!typeBreakdown || typeBreakdown.length === 0) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'text.secondary',
          gap: 2,
          p: 3
        }}
      >
        <PieChart sx={{ fontSize: 48, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay datos disponibles
        </Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          No se encontraron datos de distribución por tipo de yerba
          <br />
          para el período seleccionado
        </Typography>
      </Box>
    );
  }

  // Colores para las barras
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.grey?.main || theme.palette.grey?.[500] || '#757575',
    theme.palette.purple?.main || theme.palette.purple?.[500] || '#9c27b0'
  ];

  // Preparar datos base (shares en % tal como vienen del backend)
  const base = typeBreakdown.map((item, index) => ({
    name: item.label,
    count: item.count,
    sharePct: typeof item.share === 'number' ? item.share : 0,
    color: colors[index % colors.length],
    note: item.note
  }));

  // Preparar datos para barras verticales individuales
  const chartData = base.map((item) => ({
    name: item.name,
    percentage: item.sharePct,
    color: item.color,
    count: item.count
  }));

  // Debug: mostrar datos preparados para el gráfico
  console.log('📊 StackedBarsChart - Datos del gráfico:', chartData);

  // Tooltip personalizado para barras verticales
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
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
            {label}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: data.color }} />
            <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>Porcentaje:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{data.percentage.toFixed(1)}%</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'transparent' }} />
            <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>Cantidad:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{data.count}</Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Formatear etiquetas del eje X en %
  const formatPercent = (v) => `${Number(v).toFixed(0)}%`;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      {/* Información adicional */}
      {typeBreakdown.some(item => item.note) && (
        <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2 }}>
          <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            ⚠️ Algunos datos provienen de períodos históricos debido a la falta de datos en el período actual
          </Typography>
        </Box>
      )}

      {/* Gráfico: barras verticales */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={{ stroke: theme.palette.divider }}
            tickLine={{ stroke: theme.palette.divider }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />

          <YAxis
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={{ stroke: theme.palette.divider }}
            tickLine={{ stroke: theme.palette.divider }}
            tickFormatter={formatPercent}
            domain={[0, 'dataMax + 5']}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar 
            dataKey="percentage" 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} strokeWidth={1} />
            ))}
            <LabelList
              dataKey="percentage"
              position="top"
              formatter={(v) => `${v.toFixed(1)}%`}
              style={{ 
                fontSize: 12, 
                fill: theme.palette.text.primary, 
                fontWeight: 600 
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

     
    </Box>
  );
};

export default StackedBarsChart;
