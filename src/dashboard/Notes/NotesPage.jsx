import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Container
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import NotesTopChart from '../Overview/NotesTopChart';
import FiltersBar from '../Overview/FiltersBar.jsx';
import { metricsService } from '../../services/metricsService.js';
import useFiltersStore from '../store/filtersStore.js';

// Configurar dayjs para usar español
dayjs.locale('es');

const NotesPage = () => {
  const [notesData, setNotesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zustand store - observar cambios en filtros específicos
  const {
    dateRange,
    timePeriod,
    useCustomDates
  } = useFiltersStore();

  // Configuración de períodos de tiempo para mostrar la etiqueta
  const timePeriods = [
    { value: 'dia', label: 'Hoy', icon: '🌅' },
    { value: 'semana', label: 'Últimos 7 días', icon: '📅' },
    { value: 'mes', label: 'Últimas 4 semanas', icon: '📊' },
    { value: 'año', label: 'Último año', icon: '📈' }
  ];

  // Efecto para recargar datos cuando cambian los filtros
  useEffect(() => {
    // Añadir un pequeño delay para asegurar que los cambios del store se propaguen
    const timeoutId = setTimeout(() => {
      console.log('🔄 NotesPage - Cambio en filtros detectado, recargando datos...');
      console.log('📋 Estados actuales:', { timePeriod, useCustomDates, dateRange });
      
      const loadNotesData = async () => {
        try {
          setLoading(true);
          
          // Usar el mismo patrón que OverviewPage para construir filtros
          const filters = {
            dateRange,
            timePeriod,
            useCustomDates
          };

          console.log('🔍 NotesPage - Enviando filtros para notas:', filters);
          const data = await metricsService.fetchNotesTop(filters);
          console.log('📊 NotesPage - Datos de notas recibidos:', data);
          
          setNotesData(data);
          setError(null);
        } catch (err) {
          console.error('❌ Error cargando datos de notas:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      loadNotesData();
    }, 100); // delay de 100ms

    return () => clearTimeout(timeoutId);
  }, [dateRange, timePeriod, useCustomDates]);


  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%',
        mt: { xs: 8, sm: 9, md: 10 }
      }}
    >
      
      {/* Filtros de tiempo usando FiltersBar */}
      <FiltersBar />
      {/* Gráfico de comentarios top */}
      <Box sx={{ width: '100%' }}>
        <NotesTopChart 
          data={notesData} 
          loading={loading} 
          error={error} 
        />
      </Box>
    </Container>
  );
};

export default NotesPage;
