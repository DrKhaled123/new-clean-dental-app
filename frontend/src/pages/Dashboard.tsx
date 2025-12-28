import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress
} from '@mui/material'
import {
  Person,
  EventNote,
  Assignment,
  Receipt,
  TrendingUp,
  CalendarToday
} from '@mui/icons-material'
import { patientService, appointmentService, treatmentService, invoiceService } from '../services/StorageService'
import { Patient, Appointment, Treatment, Invoice } from '../types'

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  pendingTreatments: number
  pendingInvoices: number
  recentPatients: Patient[]
  upcomingAppointments: Appointment[]
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingTreatments: 0,
    pendingInvoices: 0,
    recentPatients: [],
    upcomingAppointments: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    try {
      const patients = patientService.readAll()
      const appointments = appointmentService.readAll()
      const treatments = treatmentService.readAll()
      const invoices = invoiceService.readAll()

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointments.filter(apt => apt.date === today)

      // Get pending treatments
      const pendingTreatments = treatments.filter(t => t.status === 'planned' || t.status === 'in-progress')

      // Get pending invoices
      const pendingInvoices = invoices.filter(inv => inv.status === 'draft' || inv.status === 'sent')

      // Get recent patients (last 5)
      const recentPatients = patients
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      // Get upcoming appointments (next 5)
      const upcomingAppointments = appointments
        .filter(apt => apt.date >= today)
        .sort((a, b) => {
          if (a.date === b.date) {
            return a.time.localeCompare(b.time)
          }
          return a.date.localeCompare(b.date)
        })
        .slice(0, 5)

      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        pendingTreatments: pendingTreatments.length,
        pendingInvoices: pendingInvoices.length,
        recentPatients,
        upcomingAppointments
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'success'
      case 'scheduled':
      case 'in-progress':
        return 'warning'
      case 'cancelled':
      case 'overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your dental practice management system
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalPatients}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Patients
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventNote sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.todayAppointments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Today's Appointments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pendingTreatments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Treatments
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Receipt sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pendingInvoices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Invoices
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Patients */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Patients</Typography>
            </Box>
            {stats.recentPatients.length > 0 ? (
              <List>
                {stats.recentPatients.map((patient) => (
                  <ListItem key={patient.id} divider>
                    <ListItemText
                      primary={`${patient.firstName} ${patient.lastName}`}
                      secondary={`${patient.phone} • ${patient.email}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent patients to display
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1 }} />
              <Typography variant="h6">Upcoming Appointments</Typography>
            </Box>
            {stats.upcomingAppointments.length > 0 ? (
              <List>
                {stats.upcomingAppointments.map((appointment) => (
                  <ListItem key={appointment.id} divider>
                    <ListItemText
                      primary={`${appointment.time} - ${appointment.type}`}
                      secondary={`${appointment.description}`}
                    />
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No upcoming appointments
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Person sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="body2">Add New Patient</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <EventNote sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="body2">Schedule Appointment</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Assignment sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="body2">Create Treatment Plan</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Receipt sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
              <Typography variant="body2">Generate Invoice</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Dashboard