import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from '@mui/material';

const mockOptions = {
  tipo: ['Tradicional', 'Con palo', 'Sin palo', 'Suave', 'Orgánica'],
  marca: ['La Merced', 'Taragui', 'Amanda', 'Union', 'Rosamonte'],
  atributo: ['Intensa', 'Ahumada', 'Dulce', 'Floral'],
};

const EntitiesSelector = ({ entityType, entities, onEntityTypeChange, onEntitiesChange }) => {
  const options = mockOptions[entityType] || [];

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
          <MenuItem value="atributo">Atributo</MenuItem>
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
        options={options}
        renderInput={(params) => <TextField {...params} label="Entidades" placeholder="Selecciona" size="small" />}
        sx={{ width: 300, display: 'inline-block' }}
      />
    </Box>
  );
};

export default EntitiesSelector;
