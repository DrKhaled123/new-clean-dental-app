import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { Settings as SettingsIcon, Construction } from '@mui/icons-material'

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your practice preferences
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Practice Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This feature is coming soon. You'll be able to:
        </Typography>
        <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>• Configure practice information</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Set working hours</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Manage appointment settings</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Configure billing preferences</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Customize templates and forms</Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Settings