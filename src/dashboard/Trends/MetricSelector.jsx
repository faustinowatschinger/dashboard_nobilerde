import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const MetricSelector = ({ metric, onChange }) => (
  <FormControl component="fieldset" sx={{ mb: 2 }}>
    <FormLabel component="legend">Métrica</FormLabel>
    <RadioGroup
      row
      value={metric}
      onChange={(e) => onChange(e.target.value)}
    >
      <FormControlLabel value="volumen" control={<Radio />} label="Volumen" />
      <FormControlLabel value="descubrimiento" control={<Radio />} label="% Descubrimiento" />
    </RadioGroup>
  </FormControl>
);

export default MetricSelector;
