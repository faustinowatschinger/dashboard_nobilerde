// src/components/ComingSoonPage.jsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import {
  Construction,
  Schedule,
  Lightbulb
} from '@mui/icons-material';

const ComingSoonPage = ({ 
  title = "Página en Desarrollo", 
  description = "Esta funcionalidad estará disponible próximamente",
  features = [],
  estimatedDate = "Q1 2025"
}) => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        sx={{ 
          p: 6, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Construction 
          sx={{ 
            fontSize: 80, 
            color: 'primary.main', 
            mb: 3,
            opacity: 0.8
          }} 
        />
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: 'text.primary'
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
        >
          {description}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={25} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              maxWidth: 300,
              mx: 'auto',
              mb: 2
            }} 
          />
          <Typography variant="body2" color="text.secondary">
            Desarrollo en progreso - 25% completado
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Chip 
            icon={<Schedule />}
            label={`Estimado: ${estimatedDate}`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            icon={<Lightbulb />}
            label="En diseño"
            color="warning"
            variant="outlined"
          />
        </Stack>

        {features.length > 0 && (
          <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
              Funcionalidades Planeadas:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {features.map((feature, index) => (
                <Typography 
                  key={index} 
                  component="li" 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {feature}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ComingSoonPage;
