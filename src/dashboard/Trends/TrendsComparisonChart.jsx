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
  Cell,
  LabelList
} from 'recharts';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
  Alert
} from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat, DonutLarge } from '@mui/icons-material';

const TrendsComparisonChart = ({ trends = [], loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Calcular altura del eje X basado en el número de elementos y el tamaño de pantalla
  const getXAxisHeight = (dataLength) => {
    const hasRotatedLabels = dataLength > 8;
    if (hasRotatedLabels) {
      return isMobile ? 50 : 60;
    }
    return isMobile ? 25 : 30;
  };
  
  // Calcular tamaño de fuente para ticks
  const getTickFontSize = () => isMobile ? 10 : 12;

  // Debug: Log de datos recibidos
  console.log('📊 TrendsComparisonChart - Props recibidas:', { trends, loading });

  // Transformar datos al formato del gráfico directamente, SIN FILTRADO LOCAL
  // Todo el filtrado debe hacerse en el backend
  const chartData = useMemo(() => {
    console.log('📊 TrendsComparisonChart - Procesando trends:', trends);

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
            p: { xs: 1.5, sm: 2 },
            boxShadow: theme.shadows[4],
            minWidth: { xs: 200, sm: 250 },
            maxWidth: { xs: 280, sm: 350 }
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 0.5, sm: 1 }, 
              color: 'text.primary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              wordBreak: 'break-word'
            }}
          >
            {label}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, sm: 1 }, 
            mb: { xs: 0.5, sm: 1 } 
          }}>
            {tendencyPercent > 0 ? (
              <TrendingUp 
                color="success" 
                fontSize="small" 
                sx={{ fontSize: { xs: 16, sm: 20 } }}
              />
            ) : tendencyPercent < 0 ? (
              <TrendingDown 
                color="error" 
                fontSize="small" 
                sx={{ fontSize: { xs: 16, sm: 20 } }}
              />
            ) : (
              <TrendingFlat 
                color="disabled" 
                fontSize="small" 
                sx={{ fontSize: { xs: 16, sm: 20 } }}
              />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {tendencyPercent > 0 ? '+' : ''}{tendencyPercent.toFixed(1)}%
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 0.25, sm: 0.5 } 
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              Actual: <strong>{currentValue}</strong>
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              Anterior: <strong>{previousValue}</strong>
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
            >
              Cambio: <strong>{currentValue - previousValue}</strong>
            </Typography>
            {tendencyPercent === 0 && currentValue > 0 && (
              <Typography 
                variant="caption" 
                color="info.main" 
                sx={{ 
                  fontStyle: 'italic', 
                  mt: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                💡 Sin variación entre períodos
              </Typography>
            )}
          </Box>
        </Box>
      );
    }
    return null;
  };

  // --- Custom label renderer for bars: always show percent, above positive bars and below negative bars ---
  const CustomBarLabel = ({ x, y, width, height, value }) => {
    // value is the tendencyPercent numeric
    if (value === undefined || value === null || isNaN(value)) return null;

    // Determine font size based on number of bars to avoid overlap
    const baseFont = 12;
    const sizeReduction = Math.floor(chartData.length / 10); // reduce size when many bars
    const fontSize = Math.max(9, baseFont - sizeReduction);

    const centerX = x + width / 2;

    // If positive, place above the bar; if negative, place below the bar
    const isPositive = value >= 0;
    const offset = isPositive ? -6 : -6; // px offset from bar
    const posY = isPositive ? y + offset : y + height + offset;

    // Format value as percent with one decimal (hide .0 for integers)
    const formatted = Number(value).toFixed(1).replace(/\.0$/, '') + '%';

    // Choose color: if label would overlay the bar (small bar), use text.primary; otherwise try white for contrast
    // Heuristic: if bar height is > 18px, consider overlaying inside (white), else outside (text.primary)
    const overlayCondition = Math.abs(height) > 18;
    const fillColor = overlayCondition && isPositive ? '#00000' : 'currentColor';

    return (
      <text
        x={centerX}
        y={posY}
        textAnchor="middle"
        fill={fillColor}
        fontSize={fontSize}
        fontWeight={600}
        style={{ pointerEvents: 'none' }}
      >
        {formatted}
      </text>
    );
  };
  // --- end CustomBarLabel ---

  // Si no hay datos válidos, mostrar mensaje
  if (!chartData || chartData.length === 0 || chartData.every(d => !d.entity || typeof d.tendencyPercent !== 'number')) {
    console.log('🚫 TrendsComparisonChart - No hay datos válidos para renderizar:', {
      chartData,
      hasData: chartData && chartData.length > 0,
      validItems: chartData?.filter(d => d.entity && typeof d.tendencyPercent === 'number').length
    });
    
    return (
      <Box sx={{ 
        height: '100%', 
        width: '100%',
        minHeight: { xs: 200, sm: 250, md: 300 }
      }}>
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
            gap: { xs: 1, sm: 2 },
            p: { xs: 2, sm: 3 }
          }}
        >
          <DonutLarge sx={{ 
            fontSize: { xs: 32, sm: 40, md: 48 }, 
            color: 'text.disabled' 
          }} />
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            No hay datos de tendencias disponibles
            <br />
            <Typography 
              variant="caption" 
              component="span"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
            >
              {loading ? 'Cargando...' : 'Selecciona diferentes filtros o períodos'}
            </Typography>
          </Typography>
        </Box>
      </Box>
    );
  }

  // Verificar si todos los datos son "sin cambio" (0% de variación)
  const allDataIsFlat = chartData.every(d => Math.abs(d.tendencyPercent) < 0.1);
  
  // Mensaje informativo para cuando hay datos pero sin variación significativa
  if (allDataIsFlat && chartData.length > 0) {
    const hasVolumeData = chartData.some(d => d.currentValue > 0 || d.previousValue > 0);
    
    return (
      <Box sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        minHeight: { xs: 250, sm: 300, md: 350 }
      }}>
        <Alert
          severity="info"
          sx={{ 
            mb: { xs: 1, sm: 2 },
            '& .MuiAlert-message': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
          icon={<TrendingFlat sx={{ fontSize: { xs: 20, sm: 24 } }} />}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Datos estables - Sin variación significativa
          </Typography>
          <Typography 
            variant="body2"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {hasVolumeData
              ? 'Las entidades seleccionadas muestran valores estables entre períodos. Esto puede ocurrir cuando hay poca variación en los eventos de la métrica seleccionada.'
              : 'No se encontraron variaciones significativas en el período seleccionado.'
            }
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: { xs: 0.5, sm: 1 }, 
              fontStyle: 'italic',
              fontSize: { xs: '0.7rem', sm: '0.75rem' }
            }}
          >
            💡 Sugerencia: Prueba cambiar la métrica o el período para ver más variación en los datos.
          </Typography>
        </Alert>

        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={chartData}
            margin={{ 
              top: 20, 
              right: isMobile ? 15 : 30, 
              left: isMobile ? 15 : 20, 
              bottom: getXAxisHeight(chartData.length) + 10
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="entity"
              tick={{ fontSize: getTickFontSize() }}
              interval={0}
              angle={chartData.length > 8 ? -45 : 0}
              textAnchor={chartData.length > 8 ? 'end' : 'middle'}
              height={getXAxisHeight(chartData.length)}
            />
            <YAxis 
              domain={[-1, 1]} 
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              tick={{ fontSize: getTickFontSize() }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke={theme.palette.divider} strokeWidth={2} />

            <Bar dataKey="tendencyPercent">
              <LabelList dataKey="tendencyPercent" content={CustomBarLabel} />
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
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative',
      minHeight: { xs: 300, sm: 400, md: 500 }
    }}>
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 0.5, sm: 1 }, 
        mb: { xs: 1, sm: 2 }, 
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', sm: 'flex-start' }
      }}>
        <Chip
          icon={<TrendingUp sx={{ fontSize: { xs: 16, sm: 20 } }} />}
          label="Crecimiento"
          size="small"
          color="success"
          variant="outlined"
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: 24, sm: 32 }
          }}
        />
        <Chip 
          icon={<TrendingDown sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
          label="Decrecimiento" 
          size="small" 
          color="error" 
          variant="outlined"
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: 24, sm: 32 }
          }}
        />
        <Chip 
          icon={<TrendingFlat sx={{ fontSize: { xs: 16, sm: 20 } }} />} 
          label="Sin cambio" 
          size="small" 
          color="default" 
          variant="outlined"
          sx={{ 
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: 24, sm: 32 }
          }}
        />
      </Box>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ 
            top: 20, 
            right: isMobile ? 15 : 30, 
            left: isMobile ? 15 : 20, 
            bottom: getXAxisHeight(chartData.length) + 10
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="entity" 
            interval={0}
            angle={chartData.length > 8 ? -45 : 0}
            textAnchor={chartData.length > 8 ? 'end' : 'middle'}
            height={getXAxisHeight(chartData.length)}
            tick={{ fontSize: getTickFontSize() }}
          />
          <YAxis 
            domain={yAxisDomain} 
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            tick={{ fontSize: getTickFontSize() }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar dataKey="tendencyPercent">
            <LabelList dataKey="tendencyPercent" content={CustomBarLabel} />
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
