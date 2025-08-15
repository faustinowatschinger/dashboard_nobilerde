// src/dashboard/Trends/TrendsComparisonChart.jsx
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { Box, Typography, useTheme, alpha, Chip, Alert } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat, DonutLarge } from '@mui/icons-material';

const TrendsComparisonChart = ({ trends = [], loading = false }) => {
  const theme = useTheme();

  // Debug: Log de datos recibidos
  console.log('📊 TrendsComparisonChart - Props recibidas:', { trends, loading });

  // Transformar datos al formato del gráfico
  const chartData = useMemo(() => {
    console.log('📊 TrendsComparisonChart - Procesando trends:', trends);
    
    if (!Array.isArray(trends) || trends.length === 0) {
      console.log('❌ TrendsComparisonChart - No hay trends válidos:', { trends, isArray: Array.isArray(trends), length: trends?.length });
      
      // DEBUGGING: Crear datos de prueba si no hay datos reales
      console.log('🧪 Creando datos de prueba para debugging...');
      return [
        {
          entity: 'Tradicional',
          tendencyPercent: 15.5,
          currentValue: 100,
          previousValue: 87,
          status: 'subida',
          fill: theme.palette.success.main
        },
        {
          entity: 'Suave',
          tendencyPercent: -8.2,
          currentValue: 45,
          previousValue: 49,
          status: 'bajada',
          fill: theme.palette.error.main
        },
        {
          entity: 'Premium',
          tendencyPercent: 0,
          currentValue: 25,
          previousValue: 25,
          status: 'sin cambio',
          fill: theme.palette.grey[500]
        }
      ];
    }

    const mapped = trends.map((trend, index) => {
      console.log(`📋 Procesando trend ${index + 1}:`, {
        entity: trend.entity,
        tendencyPercent: trend.tendencyPercent,
        currentValue: trend.currentValue,
        previousValue: trend.previousValue,
        status: trend.status,
        tendencyPercentType: typeof trend.tendencyPercent
      });

      const processedData = {
        entity: trend.entity,
        tendencyPercent: typeof trend.tendencyPercent === 'number' ? trend.tendencyPercent : 0,
        currentValue: trend.currentValue,
        previousValue: trend.previousValue,
        status: trend.status,
        // Color basado en el tipo de tendencia
        fill: trend.tendencyPercent > 0 
          ? theme.palette.success.main 
          : trend.tendencyPercent < 0 
          ? theme.palette.error.main 
          : theme.palette.grey[500]
      };
      
      console.log(`✅ Datos procesados para ${trend.entity}:`, processedData);
      return processedData;
    });
    
    console.log('✅ TrendsComparisonChart - Datos mapeados:', mapped);
    console.log('📐 TrendsComparisonChart - Rango de datos:', {
      allValues: mapped.map(d => d.tendencyPercent),
      minPercent: Math.min(...mapped.map(d => d.tendencyPercent)),
      maxPercent: Math.max(...mapped.map(d => d.tendencyPercent)),
      count: mapped.length,
      validNumbers: mapped.filter(d => typeof d.tendencyPercent === 'number').length
    });
    
    return mapped;
  }, [trends, theme]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const tendencyPercent = data.tendencyPercent;
      const currentValue = data.currentValue;
      const previousValue = data.previousValue;
      
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            boxShadow: theme.shadows[4],
            minWidth: 250
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
            {label}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {tendencyPercent > 0 ? (
              <TrendingUp color="success" fontSize="small" />
            ) : tendencyPercent < 0 ? (
              <TrendingDown color="error" fontSize="small" />
            ) : (
              <TrendingFlat color="disabled" fontSize="small" />
            )}
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {tendencyPercent > 0 ? '+' : ''}{tendencyPercent.toFixed(1)}%
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Actual: <strong>{currentValue}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Anterior: <strong>{previousValue}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cambio: <strong>{currentValue - previousValue}</strong>
            </Typography>
            {tendencyPercent === 0 && currentValue > 0 && (
              <Typography variant="caption" color="info.main" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                💡 Sin variación entre períodos
              </Typography>
            )}
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Si no hay datos válidos, mostrar mensaje
  if (!chartData || chartData.length === 0 || chartData.every(d => !d.entity || typeof d.tendencyPercent !== 'number')) {
    console.log('🚫 TrendsComparisonChart - No hay datos válidos para renderizar:', {
      chartData,
      hasData: chartData && chartData.length > 0,
      validItems: chartData?.filter(d => d.entity && typeof d.tendencyPercent === 'number').length
    });
    
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
          border: `2px dashed ${theme.palette.divider}`,
          flexDirection: 'column',
          gap: 2
        }}
      >
        <DonutLarge sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          No hay datos de tendencias disponibles
          <br />
          <Typography variant="caption" component="span">
            {loading ? 'Cargando...' : 'Selecciona diferentes filtros o períodos'}
          </Typography>
        </Typography>
      </Box>
    );
  }

  // Verificar si todos los datos son "sin cambio" (0% de variación)
  const allDataIsFlat = chartData.every(d => Math.abs(d.tendencyPercent) < 0.1);
  
  // Mensaje informativo para cuando hay datos pero sin variación significativa
  if (allDataIsFlat && chartData.length > 0) {
    const hasVolumeData = chartData.some(d => d.currentValue > 0 || d.previousValue > 0);
    
    return (
      <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          icon={<TrendingFlat />}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Datos estables - Sin variación significativa
          </Typography>
          <Typography variant="body2">
            {hasVolumeData 
              ? 'Las entidades seleccionadas muestran valores estables entre períodos. Esto puede ocurrir cuando hay poca variación en los eventos de la métrica seleccionada.'
              : 'No se encontraron variaciones significativas en el período seleccionado.'
            }
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
            💡 Sugerencia: Prueba cambiar la métrica o el período para ver más variación en los datos.
          </Typography>
        </Alert>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="entity" />
            <YAxis domain={[-1, 1]} tickFormatter={(value) => `${value.toFixed(0)}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke={theme.palette.divider} strokeWidth={2} />
            
            <Bar dataKey="tendencyPercent">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={theme.palette.grey[400]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }

  // Encontrar rango para el eje Y
  const allValues = chartData.map(d => d.tendencyPercent).filter(v => typeof v === 'number' && !isNaN(v));

  // Nuevo cálculo robusto del dominio del eje Y:
  // - Si todos los valores son positivos => empezar en 0
  // - Si todos negativos => terminar en 0
  // - Si mixtos => incluir ambos extremos con padding
  // - Si todos cero o no hay datos => usar un rango pequeño por defecto
  let yAxisDomain;
  if (!allValues || allValues.length === 0) {
    yAxisDomain = [-10, 10];
  } else {
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    // Caso todos ceros
    if (minVal === 0 && maxVal === 0) {
      yAxisDomain = [-10, 10];
    } else {
      const range = maxVal - minVal;
      const pad = Math.max(2, Math.abs(range) * 0.12); // padding mínimo del 2% o 12% del rango

      let minDomain = Math.min(minVal, 0) - pad;
      let maxDomain = Math.max(maxVal, 0) + pad;

      // Si todos los valores son positivos, forzar inicio en 0
      if (minVal >= 0) minDomain = 0;
      // Si todos los valores son negativos, forzar fin en 0
      if (maxVal <= 0) maxDomain = 0;

      // Asegurar separación mínima
      if (Math.abs(maxDomain - minDomain) < 1) {
        minDomain = Math.floor(minDomain) - 1;
        maxDomain = Math.ceil(maxDomain) + 1;
      }

      yAxisDomain = [Math.floor(minDomain), Math.ceil(maxDomain)];
    }
  }
  
  console.log('📐 TrendsComparisonChart - Configuración eje Y:', {
    computedDomain: yAxisDomain,
    dataPoints: chartData.length,
    allValues
  });

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip 
          icon={<TrendingUp />} 
          label="Crecimiento" 
          size="small" 
          color="success" 
          variant="outlined"
        />
        <Chip 
          icon={<TrendingDown />} 
          label="Decrecimiento" 
          size="small" 
          color="error" 
          variant="outlined"
        />
        <Chip 
          icon={<TrendingFlat />} 
          label="Sin cambio" 
          size="small" 
          color="default" 
          variant="outlined"
        />
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="entity" />
          <YAxis domain={yAxisDomain} tickFormatter={(value) => `${value.toFixed(0)}%`} />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar dataKey="tendencyPercent">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TrendsComparisonChart;
