import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const MetricSelector = ({ value, metric, onChange }) => {
  // Support both `value` (used by TrendsPage) and `metric` (older prop name).
  const selected = value ?? metric ?? 'volumen';

  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  return (
    <FormControl component="fieldset" sx={{ mb: 2 }}>
      <FormLabel component="legend">Métrica</FormLabel>
      <RadioGroup
        row
        value={selected}
        onChange={handleChange}
      >
        <FormControlLabel value="volumen" control={<Radio />} label="Volumen" />
        <FormControlLabel value="descubrimiento" control={<Radio />} label="% Descubrimiento" />
      </RadioGroup>
    </FormControl>
  );
};

export default MetricSelector;
