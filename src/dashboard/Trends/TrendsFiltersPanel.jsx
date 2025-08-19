// src/dashboard/Trends/TrendsFiltersPanel.jsx
import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import useFiltersStore from '../store/filtersStore.js';

const TrendsFiltersPanel = () => {
  const theme = useTheme();

  // Obtener filtros activos del store global
  const {
    country,
    ageBucket,
    gender,
    tipoMatero,
    tipoMate,
    termosDia,
    setFilter,
    loadFilterOptions,
    filterOptions
  } = useFiltersStore();

  // Cargar opciones de filtros al montar
  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  // Preparar configuraciones para los selectores
  const filtersValues = { country, ageBucket, gender, tipoMatero, tipoMate, termosDia };
  const {
    paisesUsuario = [],
    edades = [],
    generos = [],
    tiposMatero = [],
    tiposMate = [],
    termosDia: termosDiaOptions = []
  } = filterOptions;

  const filterControls = [
    // Solo filtros de usuario
    { key: 'country', label: 'País Usuario', options: paisesUsuario },
    { key: 'ageBucket', label: 'Edad', options: edades },
    { key: 'gender', label: 'Género', options: generos },
    { key: 'tipoMatero', label: 'Tipo Matero', options: tiposMatero },
    { key: 'tipoMate', label: 'Tipo Mate', options: tiposMate },
    { key: 'termosDia', label: 'Termos/Día', options: termosDiaOptions }
  ];

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3 }, 
      mb: { xs: 2, sm: 3, md: 4 }, 
      borderRadius: 2, 
      boxShadow: theme.shadows[1],
      width: '100%'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
        {/* Título */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 0.5, sm: 1 },
          flexWrap: 'wrap'
        }}>
          <FilterList color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Filtros de Usuarios
          </Typography>
        </Box>

        {/* Selectores de filtros */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 2 },
          '& .MuiFormControl-root': {
            minWidth: { xs: 140, sm: 160 },
            flex: { xs: '1 1 auto', sm: 'none' }
          }
        }}>
          {filterControls.map((ctrl) => (
            <FormControl key={ctrl.key} size="small">
              <InputLabel sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {ctrl.label}
              </InputLabel>
              <Select
                value={filtersValues[ctrl.key] || ''}
                label={ctrl.label}
                onChange={(e) => {
                  console.log(`🔄 Filtro ${ctrl.key} cambiado a:`, e.target.value);
                  setFilter(ctrl.key, e.target.value);
                }}
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  '& .MuiOutlinedInput-input': {
                    py: { xs: 1, sm: 1.25 }
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Todos
                </MenuItem>
                {ctrl.options.map((opt) => (
                  <MenuItem 
                    key={opt.value || opt} 
                    value={opt.value || opt}
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {opt.label || opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>

        {/* Información de filtros activos */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
          {Object.entries(filtersValues).map(([key, value]) => {
            if (!value) return null;
            const control = filterControls.find(c => c.key === key);
            return (
              <Typography
                key={key}
                variant="caption"
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  px: { xs: 0.75, sm: 1 },
                  py: { xs: 0.25, sm: 0.5 },
                  borderRadius: 1,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  lineHeight: 1.2
                }}
              >
                {control?.label}: {value}
              </Typography>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default TrendsFiltersPanel;
