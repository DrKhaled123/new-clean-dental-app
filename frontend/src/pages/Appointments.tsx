import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { EventNote, Construction } from '@mui/icons-material'

const Appointments: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage appointment scheduling and calendar
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Appointment Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This feature is coming soon. You'll be able to:
        </Typography>
        <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>• Schedule new appointments</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• View calendar overview</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Manage appointment statuses</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Send appointment reminders</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Track appointment history</Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Appointments