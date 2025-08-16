import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Typography, Tooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const MetricSelector = ({ value, metric, onChange }) => {
  // Support both `value` (used by TrendsPage) and `metric` (older prop name).
  const selected = value ?? metric ?? 'volumen';

  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  const metricInfo = {
    volumen: {
      description: "Número total de eventos/interacciones por entidad: reviews, respuestas, cambios de estado, etc."
    },
    descubrimiento: {
      description: "Número de eventos de descubrimiento: usuarios probando yerbas por primera vez de esa entidad."
    }
  };

  return (
    <FormControl component="fieldset" sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FormLabel component="legend">Métrica</FormLabel>
        <Tooltip title={metricInfo[selected]?.description || "Selecciona una métrica para ver más información"}>
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Box>
      <RadioGroup
        row
        value={selected}
        onChange={handleChange}
      >
        <FormControlLabel 
          value="volumen" 
          control={<Radio />} 
          label={
            <Box>
              <Typography variant="body2">Volumen</Typography>
              <Typography variant="caption" color="text.secondary">
                Total eventos/interacciones
              </Typography>
            </Box>
          }
        />
        <FormControlLabel 
          value="descubrimiento" 
          control={<Radio />} 
          label={
            <Box>
              <Typography variant="body2">Descubrimiento</Typography>
              <Typography variant="caption" color="text.secondary">
                Yerbas probadas por primera vez
              </Typography>
            </Box>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

export default MetricSelector;
