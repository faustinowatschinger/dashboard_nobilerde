import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import yerbaService from '../../services/yerbaService.js';

const YerbasPage = () => {
  const [yerbas, setYerbas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadYerbas = async () => {
      try {
        const data = await yerbaService.fetchYerbaStats();
        setYerbas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadYerbas();
  }, []);

  const filteredYerbas = yerbas.filter(y => {
    const name = y.name || y.yerbaName || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Todas las Yerbas
      </Typography>
      <TextField
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar yerba"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2, width: 300 }}
      />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Yerba</TableCell>
              <TableCell align="right">Volumen</TableCell>
              <TableCell align="right">Descubrimiento</TableCell>
              <TableCell align="right">Puntaje Promedio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredYerbas.map((y) => (
              <TableRow key={y.id || y.yerbaId || y.name}>
                <TableCell>{y.name || y.yerbaName}</TableCell>
                <TableCell align="right">{y.volume ?? y.volumen ?? 0}</TableCell>
                <TableCell align="right">{y.discovery ?? y.descubrimiento ?? y.probadas ?? 0}</TableCell>
                <TableCell align="right">
                  {((y.averageScore ?? y.puntajePromedio ?? y.avgScore ?? 0)).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default YerbasPage;
