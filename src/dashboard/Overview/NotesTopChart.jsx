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
  LinearProgress,
  useTheme
} from '@mui/material';
import EmptyState from './EmptyState';

/**
 * Componente para mostrar los comentarios con más interacciones del período
 */
const NotesTopChart = ({ data, loading, error }) => {
  const theme = useTheme();
  
  // Estados de carga y error
  if (loading) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 600 
            }}
          >
            Top 5 Comentarios por Engagement
          </Typography>
          <Box sx={{ 
            height: { xs: 200, sm: 250, md: 300 }, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Cargando...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 600 
            }}
          >
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
      <Card sx={{ width: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 600 
            }}
          >
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
    <Card sx={{ width: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            mb: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Top 5 Comentarios por Engagement
        </Typography>
        
        <TableContainer sx={{ 
          maxHeight: { xs: 400, sm: 500, md: 600 },
          overflow: 'auto'
        }}>
          <Table 
            size="small"
            stickyHeader
            sx={{
              '& .MuiTableCell-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                px: { xs: 1, sm: 2 }
              }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600,
                  backgroundColor: 'background.paper',
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}>
                  Comentario
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: 'background.paper',
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    minWidth: { xs: 100, sm: 140 }
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Score de Interacción
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    Score
                  </Box>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: 'background.paper',
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    minWidth: { xs: 80, sm: 100 }
                  }}
                >
                  Engagement
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note, index) => {
                const interactionScore = note.normalizedScore || note.interactionScore || 0;
                const barWidth = maxScore > 0 ? (interactionScore / maxScore) * 100 : 0;
                
                return (
                  <TableRow 
                    key={note.label || note.comment || index} 
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'action.hover'
                      },
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            maxWidth: { xs: 150, sm: 250, md: 300 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                          title={note.fullComment || note.label || note.comment}
                        >
                          {note.label || note.comment || 'Comentario sin texto'}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            display: 'block',
                            maxWidth: { xs: 150, sm: 250, md: 300 },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={note.yerba || 'Producto no especificado'}
                        >
                          {note.yerba || 'Producto no especificado'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ minWidth: { xs: 80, sm: 120 } }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: { xs: 0.5, sm: 1 } 
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              minWidth: { xs: 35, sm: 45 }, 
                              fontWeight: 500,
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            {interactionScore.toFixed(1)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={barWidth}
                          sx={{
                            height: { xs: 6, sm: 8 },
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
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: { xs: 0.25, sm: 0.5 } 
                      }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            lineHeight: 1.2
                          }}
                        >
                          ❤️ {(note.likes || 0).toLocaleString()} 
                          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                            {' '}likes
                          </Box>
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            lineHeight: 1.2
                          }}
                        >
                          💬 {(note.replies || 0).toLocaleString()}
                          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                            {' '}respuestas
                          </Box>
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            mt: { xs: 1.5, sm: 2 }, 
            display: 'block',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Ranking de los 5 comentarios con mayor engagement basado en likes y respuestas del período
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotesTopChart;
