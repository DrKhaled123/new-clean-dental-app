import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { Assignment, Construction } from '@mui/icons-material'

const Treatments: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Treatments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage treatment plans and procedures
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Treatment Planning
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This feature is coming soon. You'll be able to:
        </Typography>
        <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>• Create treatment plans</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Track treatment progress</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Manage treatment history</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Set treatment priorities</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Generate treatment reports</Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Treatments