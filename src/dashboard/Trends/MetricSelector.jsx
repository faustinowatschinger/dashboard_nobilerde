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
    <FormControl component="fieldset" sx={{ mb: { xs: 1, sm: 2 }, width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 0.5, sm: 1 }, 
        mb: { xs: 0.5, sm: 1 },
        flexWrap: 'wrap'
      }}>
        <FormLabel component="legend" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          Métrica
        </FormLabel>
        <Tooltip title={metricInfo[selected]?.description || "Selecciona una métrica para ver más información"}>
          <InfoOutlined 
            fontSize="small" 
            color="action" 
            sx={{ fontSize: { xs: 16, sm: 20 } }} 
          />
        </Tooltip>
      </Box>
      <RadioGroup
        row={false}
        value={selected}
        onChange={handleChange}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0.5, sm: 1 }
        }}
      >
        <FormControlLabel 
          value="volumen" 
          control={<Radio size="small" />} 
          label={
            <Box sx={{ ml: { xs: 0, sm: 0.5 } }}>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Volumen
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
              >
                Total eventos/interacciones
              </Typography>
            </Box>
          }
          sx={{ 
            mb: { xs: 0.5, sm: 0 },
            '& .MuiFormControlLabel-label': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        />
        <FormControlLabel 
          value="descubrimiento" 
          control={<Radio size="small" />} 
          label={
            <Box sx={{ ml: { xs: 0, sm: 0.5 } }}>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Descubrimiento
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
              >
                Yerbas probadas por primera vez
              </Typography>
            </Box>
          }
          sx={{ 
            mb: { xs: 0.5, sm: 0 },
            '& .MuiFormControlLabel-label': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          }}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default MetricSelector;
