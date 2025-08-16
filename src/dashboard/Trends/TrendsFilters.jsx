import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import useFiltersStore from './filtersStore.js';

const datePresets = [
  { label: 'Últimos 30 días', value: '30d' },
  { label: 'Últimos 90 días', value: '90d' },
  { label: 'Últimos 12 meses', value: '12m' },
  { label: 'Personalizado', value: 'custom' },
];

const bucketOptions = [
  { label: 'Día', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
];

const countries = ['ALL', 'AR', 'BR', 'UY'];
const ages = ['ALL', '18-24', '25-34', '35-44', '45+'];
const genders = ['ALL', 'M', 'F', 'X'];

const TrendsFilters = () => {
  const { dateRange, bucket, country, ageBucket, gender, setFilter } = useFiltersStore();
  const [preset, setPreset] = useState('30d');

  useEffect(() => {
    if (preset === 'custom') return;
    const now = dayjs();
    let from = now.subtract(30, 'day');
    if (preset === '90d') from = now.subtract(90, 'day');
    if (preset === '12m') from = now.subtract(12, 'month');
    setFilter('dateRange', { from, to: now });
  }, [preset, setFilter]);

  const handleCustomChange = (field) => (e) => {
    setFilter('dateRange', { ...dateRange, [field]: dayjs(e.target.value) });
  };

  const rangeDays = dateRange.to.diff(dateRange.from, 'day');
  const dayDisabled = rangeDays > 90;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl size="small">
          <InputLabel id="preset-label">Rango</InputLabel>
          <Select labelId="preset-label" value={preset} label="Rango" onChange={(e) => setPreset(e.target.value)}>
            {datePresets.map((p) => (
              <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {preset === 'custom' && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size="small"
              type="date"
              label="Desde"
              InputLabelProps={{ shrink: true }}
              value={dateRange.from.format('YYYY-MM-DD')}
              onChange={handleCustomChange('from')}
            />
            <TextField
              size="small"
              type="date"
              label="Hasta"
              InputLabelProps={{ shrink: true }}
              value={dateRange.to.format('YYYY-MM-DD')}
              onChange={handleCustomChange('to')}
            />
          </Stack>
        )}

        <FormControl size="small">
          <InputLabel id="bucket-label">Bucket</InputLabel>
          <Select
            labelId="bucket-label"
            value={bucket}
            label="Bucket"
            onChange={(e) => setFilter('bucket', e.target.value)}
          >
            {bucketOptions.map((b) => (
              <MenuItem key={b.value} value={b.value} disabled={b.value === 'day' && dayDisabled}>
                {b.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel id="country-label">País</InputLabel>
          <Select
            labelId="country-label"
            value={country}
            label="País"
            onChange={(e) => setFilter('country', e.target.value)}
          >
            {countries.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel id="age-label">Edad</InputLabel>
          <Select labelId="age-label" value={ageBucket} label="Edad" onChange={(e) => setFilter('ageBucket', e.target.value)}>
            {ages.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel id="gender-label">Género</InputLabel>
          <Select labelId="gender-label" value={gender} label="Género" onChange={(e) => setFilter('gender', e.target.value)}>
            {genders.map((g) => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
};

export default TrendsFilters;
