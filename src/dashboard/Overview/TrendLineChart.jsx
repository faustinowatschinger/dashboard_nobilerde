// src/dashboard/Overview/TrendLineChart.jsx
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box, Typography, useTheme, alpha, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';

const TrendLineChart = ({ weeklyActivity = [], temporalActivity = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Responsive values
  const fontSize = isMobile ? 10 : isTablet ? 11 : 12;
  const chartMargins = {
    top: isMobile ? 12 : isTablet ? 16 : 20,
    right: isMobile ? 12 : isTablet ? 16 : 20,
    left: isMobile ? 4 : isTablet ? 6 : 8,
    bottom: isMobile ? 8 : isTablet ? 10 : 12
  };

  // Determinar qué datos usar y la granularidad
  const { data, granularity, periodLabel } = useMemo(() => {
    if (temporalActivity && temporalActivity.data && temporalActivity.data.length > 0) {
      return {
        data: temporalActivity.data,
        granularity: temporalActivity.granularity || 'day',
        periodLabel: temporalActivity.periodLabel || 'Actividad Temporal'
      };
    }
    
    if (weeklyActivity && weeklyActivity.length > 0) {
      return {
        data: weeklyActivity,
        granularity: 'week',
        periodLabel: 'Actividad Semanal'
      };
    }
    
    return { data: [], granularity: 'day', periodLabel: 'Sin datos' };
  }, [weeklyActivity, temporalActivity]);

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
    
    if (!date.isValid()) {
      return String(tickItem).substring(0, 10);
    }
    
    switch (granularity) {
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
      const data = payload[0].payload;
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: { xs: 1, sm: 1.5, md: 2 },
            boxShadow: theme.shadows[4],
            minWidth: { xs: 140, sm: 160, md: 220 },
            maxWidth: { xs: 200, sm: 240, md: 320 }
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700, 
              mb: 1, 
              color: 'text.primary',
              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
            }}
          >
            {formatXAxis(label)}
          </Typography>
          
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: { xs: 8, sm: 10, md: 12 },
                  height: { xs: 8, sm: 10, md: 12 },
                  borderRadius: '50%',
                  bgcolor: entry.color
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  minWidth: { xs: 60, sm: 70, md: 80 },
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }
                }}
              >
                {entry.name}:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' }
                }}
              >
                {entry.value}
              </Typography>
            </Box>
          ))}
          
          {data._debug && (
            <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography 
                variant="caption" 
                color="text.disabled"
                sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' } }}
              >
                Debug: {data._debug.granularity} - {data._debug.period}
              </Typography>
            </Box>
          )}
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
          bgcolor: alpha(theme.palette.background.paper, 0.6),
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
  const chartColors = {
    events: theme.palette.primary.main,
    users: theme.palette.secondary.main,
    yerbas: theme.palette.success.main,
    catas: theme.palette.warning.main
  };

  // Determinar si usar AreaChart o LineChart
  const useAreaChart = granularity === 'hour' || granularity === 'day';

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      px: { xs: 0, sm: 0.5, md: 1 },
      py: { xs: 0, sm: 0.5 },
      overflow: 'hidden',
      minHeight: { xs: 180, sm: 220, md: 260, lg: 300 }
    }}>
      {/* Debug info */}
      {console.log('📊 TrendLineChart - Datos recibidos:', { data, granularity, periodLabel })}
      
      <ResponsiveContainer width="100%" height="100%">
        {useAreaChart ? (
          <AreaChart 
            data={data} 
            margin={chartMargins}
          >
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.events} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.events} stopOpacity={0.06}/>
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.users} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={chartColors.users} stopOpacity={0.06}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.divider, 0.5)}
              vertical={false}
            />
            
            <XAxis
              dataKey="period"
              tickFormatter={formatXAxis}
              tick={{ fontSize: fontSize, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            
            <YAxis
              tick={{ fontSize: fontSize, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
              gridLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: isMobile ? 6 : isTablet ? 8 : 10,
                fontSize: fontSize,
                color: theme.palette.text.secondary
              }}
            />
            
            {data[0]?.events !== undefined && (
              <Area
                type="monotone"
                dataKey="events"
                stroke={chartColors.events}
                fillOpacity={1}
                fill="url(#colorEvents)"
                strokeWidth={2}
                name="Eventos"
              />
            )}
            
            {data[0]?.users !== undefined && (
              <Area
                type="monotone"
                dataKey="users"
                stroke={chartColors.users}
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
                name="Usuarios"
              />
            )}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={chartMargins}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={alpha(theme.palette.divider, 0.5)}
              vertical={false}
            />
            
            <XAxis
              dataKey="period"
              tickFormatter={formatXAxis}
              tick={{ fontSize: fontSize, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            
            <YAxis
              tick={{ fontSize: fontSize, fill: theme.palette.text.secondary }}
              axisLine={{ stroke: theme.palette.divider }}
              tickLine={{ stroke: theme.palette.divider }}
              gridLine={{ stroke: alpha(theme.palette.divider, 0.3) }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: isMobile ? 6 : isTablet ? 8 : 10,
                fontSize: fontSize,
                color: theme.palette.text.secondary
              }}
            />
            
            {data[0]?.events !== undefined && (
              <Line
                type="monotone"
                dataKey="events"
                stroke={chartColors.events}
                strokeWidth={3}
                dot={{ fill: chartColors.events, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: chartColors.events, strokeWidth: 2 }}
                name="Eventos"
              />
            )}
            
            {data[0]?.users !== undefined && (
              <Line
                type="monotone"
                dataKey="users"
                stroke={chartColors.users}
                strokeWidth={3}
                dot={{ fill: chartColors.users, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: chartColors.users, strokeWidth: 2 }}
                name="Usuarios"
              />
            )}
            
            {data[0]?.yerbas !== undefined && (
              <Line
                type="monotone"
                dataKey="yerbas"
                stroke={chartColors.yerbas}
                strokeWidth={3}
                dot={{ fill: chartColors.yerbas, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: chartColors.yerbas, strokeWidth: 2 }}
                name="Yerbas"
              />
            )}
            
            {data[0]?.catas !== undefined && (
              <Line
                type="monotone"
                dataKey="catas"
                stroke={chartColors.catas}
                strokeWidth={3}
                dot={{ fill: chartColors.catas, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: chartColors.catas, strokeWidth: 2 }}
                name="Catas"
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default TrendLineChart;
