import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

import TrendsFilters from './TrendsFilters.jsx';
import MetricSelector from './MetricSelector.jsx';
import EntitiesSelector from './EntitiesSelector.jsx';
import TrendsLineChart from './TrendsLineChart.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import useFiltersStore from './filtersStore.js';
import { fetchTrends } from '../../services/metricsService.js';

const TrendsPage = () => {
  const filters = useFiltersStore();
  const [metric, setMetric] = useState('volumen');
  const [entityType, setEntityType] = useState('tipo');
  const [entities, setEntities] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          startDate: dayjs(filters.dateRange.from).format('YYYY-MM-DD'),
          endDate: dayjs(filters.dateRange.to).format('YYYY-MM-DD'),
          bucket: filters.bucket,
          country: filters.country !== 'ALL' ? filters.country : undefined,
          ageBucket: filters.ageBucket !== 'ALL' ? filters.ageBucket : undefined,
          gender: filters.gender !== 'ALL' ? filters.gender : undefined,
          tipoYerba: filters.tipoYerba !== 'ALL' ? filters.tipoYerba : undefined,
          metric,
          entityType,
          entities: entities.join(','),
        };
        const res = await fetchTrends(params);
        setData(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, metric, entityType, entities]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <TrendsFilters />
      <MetricSelector metric={metric} onChange={setMetric} />
      <EntitiesSelector
        entityType={entityType}
        entities={entities}
        onEntityTypeChange={setEntityType}
        onEntitiesChange={setEntities}
      />
      {data && data.kAnonymityOk && data.series.length > 0 ? (
        <TrendsLineChart series={data.series} metric={metric} bucket={data.bucket} />
      ) : (
        <EmptyState threshold={data?.sample?.kAnonThreshold} />
      )}
    </Box>
  );
};

export default TrendsPage;
