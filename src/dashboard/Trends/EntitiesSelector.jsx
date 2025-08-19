import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField, CircularProgress, Typography, Chip } from '@mui/material';
import metricsService from '../../services/metricsService.js';

const EntitiesSelector = ({ entityType, entities, onEntityTypeChange, onEntitiesChange }) => {
  const [availableEntities, setAvailableEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  // Cargar entidades disponibles cuando cambia el tipo
  useEffect(() => {
    const loadEntities = async () => {
      if (!entityType) return;
      
      setLoading(true);
      try {
        const entities = await metricsService.fetchAvailableEntities(entityType);
        setAvailableEntities(entities);
      } catch (error) {
        console.error(`Error cargando entidades para ${entityType}:`, error);
        setAvailableEntities([]);
      } finally {
        setLoading(false);
      }
    };

    loadEntities();
  }, [entityType]);

  return (
    <Box sx={{ mb: { xs: 1, sm: 2 }, width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 2 },
        mb: { xs: 1, sm: 2 }
      }}>
        <FormControl size="small" sx={{ 
          minWidth: { xs: '100%', sm: 120 },
          flex: { xs: 1, sm: 'none' }
        }}>
          <InputLabel id="entity-type-label" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Entidad
          </InputLabel>
          <Select
            labelId="entity-type-label"
            value={entityType}
            label="Entidad"
            onChange={(e) => {
              onEntityTypeChange(e.target.value);
              onEntitiesChange([]);
            }}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '& .MuiOutlinedInput-input': {
                py: { xs: 1, sm: 1.25 }
              }
            }}
          >
            <MenuItem value="tipo" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Tipo</MenuItem>
            <MenuItem value="marca" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Marca</MenuItem>
            <MenuItem value="yerbas" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Yerbas Específicas</MenuItem>
            <MenuItem value="origen" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Origen</MenuItem>
            <MenuItem value="paisProd" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>País</MenuItem>
            <MenuItem value="secado" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Secado</MenuItem>
            <MenuItem value="establecimiento" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Establecimiento</MenuItem>
            <MenuItem value="containsPalo" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Con/Sin Palo</MenuItem>
            <MenuItem value="leafCut" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Corte de Hoja</MenuItem>
            <MenuItem value="tipoEstacionamiento" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Tipo Estacionamiento</MenuItem>
            <MenuItem value="produccion" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Producción</MenuItem>
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          value={entities}
          onChange={(e, value) => {
            if (value.length <= 5) {
              onEntitiesChange(value);
            }
          }}
          options={availableEntities}
          loading={loading}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Entidades" 
              placeholder="Selecciona" 
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  py: { xs: 1, sm: 1.25 }
                },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
          )}
          sx={{ 
            width: { xs: '100%', sm: 300 },
            flex: { xs: 1, sm: 'none' },
            display: 'block'
          }}
          noOptionsText={loading ? "Cargando..." : "No hay opciones disponibles"}
        />
      </Box>
    </Box>
  );
};

export default EntitiesSelector;
