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
    <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros de Análisis
          </Typography>
        </Box>

        {/* Selectores de filtros */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filterControls.map((ctrl) => (
            <FormControl key={ctrl.key} size="small" sx={{ minWidth: 160 }}>
              <InputLabel>{ctrl.label}</InputLabel>
              <Select
                value={filtersValues[ctrl.key] || ''}
                label={ctrl.label}
                onChange={(e) => {
                  console.log(`🔄 Filtro ${ctrl.key} cambiado a:`, e.target.value);
                  setFilter(ctrl.key, e.target.value);
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {ctrl.options.map((opt) => (
                  <MenuItem key={opt.value || opt} value={opt.value || opt}>
                    {opt.label || opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>

        {/* Información de filtros activos */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem'
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
