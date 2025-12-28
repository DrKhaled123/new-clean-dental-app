import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { Receipt, Construction } from '@mui/icons-material'

const Invoices: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Invoices
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage billing and invoicing
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Billing Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This feature is coming soon. You'll be able to:
        </Typography>
        <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>• Generate invoices</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Track payments</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Manage overdue accounts</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Send payment reminders</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>• Generate financial reports</Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Invoices