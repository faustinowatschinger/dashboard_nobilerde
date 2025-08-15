import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField, CircularProgress } from '@mui/material';
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
    <Box sx={{ mb: 2 }}>
      <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
        <InputLabel id="entity-type-label">Entidad</InputLabel>
        <Select
          labelId="entity-type-label"
          value={entityType}
          label="Entidad"
          onChange={(e) => {
            onEntityTypeChange(e.target.value);
            onEntitiesChange([]);
          }}
        >
          <MenuItem value="tipo">Tipo</MenuItem>
          <MenuItem value="marca">Marca</MenuItem>
          <MenuItem value="origen">Origen</MenuItem>
          <MenuItem value="paisProd">País</MenuItem>
          <MenuItem value="secado">Secado</MenuItem>
          <MenuItem value="establecimiento">Establecimiento</MenuItem>
          <MenuItem value="containsPalo">Con/Sin Palo</MenuItem>
          <MenuItem value="leafCut">Corte de Hoja</MenuItem>
          <MenuItem value="tipoEstacionamiento">Tipo Estacionamiento</MenuItem>
          <MenuItem value="produccion">Producción</MenuItem>
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
          />
        )}
        sx={{ width: 300, display: 'inline-block' }}
        noOptionsText={loading ? "Cargando..." : "No hay opciones disponibles"}
      />
    </Box>
  );
};

export default EntitiesSelector;
