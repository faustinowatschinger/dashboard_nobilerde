// src/dashboard/Overview/NotesTopChart.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import EmptyState from './EmptyState';

/**
 * Componente para mostrar los comentarios con más interacciones del período
 */
const NotesTopChart = ({ data, loading, error }) => {
  // Estados de carga y error
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 5 Comentarios por Engagement
          </Typography>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Cargando...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 5 Comentarios por Engagement
          </Typography>
          <EmptyState
            title="Error al cargar datos"
            description={error}
            variant="error"
          />
        </CardContent>
      </Card>
    );
  }

  const notes = data?.notes || [];
  
  if (notes.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top 5 Comentarios por Engagement
          </Typography>
          <EmptyState
            title="Sin datos disponibles"
            description="No hay comentarios con interacciones para mostrar en el período seleccionado"
            variant="empty"
          />
        </CardContent>
      </Card>
    );
  }

  // Encontrar el valor máximo para el cálculo de porcentajes en las barras
  const maxScore = Math.max(...notes.map(note => note.normalizedScore || note.interactionScore || 1));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Top 5 Comentarios por Engagement
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Comentario</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Score de Interacción</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Engagement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note, index) => {
                const interactionScore = note.normalizedScore || note.interactionScore || 0;
                const barWidth = maxScore > 0 ? (interactionScore / maxScore) * 100 : 0;
                
                return (
                  <TableRow key={note.label || note.comment || index} hover>
                    <TableCell>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={note.fullComment || note.label || note.comment}
                        >
                          {note.label || note.comment || 'Comentario sin texto'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {note.yerba || 'Producto no especificado'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ minWidth: 45, fontWeight: 500 }}>
                            {interactionScore.toFixed(1)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={barWidth}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: `hsl(${210 + index * 30}, 70%, 50%)`,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          ❤️ {note.likes || 0} likes
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          💬 {note.replies || 0} respuestas
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Ranking de los 5 comentarios con mayor engagement basado en likes y respuestas del período
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotesTopChart;
