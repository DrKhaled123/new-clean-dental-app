import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Chip,
  InputAdornment,
  Fab,
  Alert
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Phone,
  Email,
  CalendarToday
} from '@mui/icons-material'
import { patientService } from '../services/StorageService'
import { Patient } from '../types'

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalHistory: {
      allergies: [],
      medications: [],
      conditions: [],
      notes: ''
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm])

  const loadPatients = () => {
    try {
      const allPatients = patientService.readAll()
      setPatients(allPatients)
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients)
      return
    }

    const filtered = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPatients(filtered)
    setPage(0) // Reset to first page when filtering
  }

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddPatient = () => {
    setEditingPatient(null)
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        notes: ''
      }
    })
    setErrors({})
    setDialogOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData(patient)
    setErrors({})
    setDialogOpen(true)
  }

  const handleSavePatient = () => {
    if (!validateForm()) {
      return
    }

    try {
      if (editingPatient) {
        // Update existing patient
        const updatedPatient = patientService.update(editingPatient.id, formData)
        if (updatedPatient) {
          loadPatients()
          setDialogOpen(false)
        }
      } else {
        // Create new patient
        patientService.create(formData as Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>)
        loadPatients()
        setDialogOpen(false)
      }
    } catch (error) {
      console.error('Error saving patient:', error)
      setErrors({ submit: 'Failed to save patient. Please try again.' })
    }
  }

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (patientToDelete) {
      try {
        patientService.delete(patientToDelete.id)
        loadPatients()
        setDeleteDialogOpen(false)
        setPatientToDelete(null)
      } catch (error) {
        console.error('Error deleting patient:', error)
      }
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }))
    
    // Clear error when user starts typing
    const errorKey = `${parent}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }))
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Patients
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your patient records
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddPatient}
          size="large"
        >
          Add Patient
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Patients Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Medical Info</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {patient.firstName} {patient.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.gender} • ID: {patient.id.slice(-8)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${calculateAge(patient.dateOfBirth)} years`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Phone sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">{patient.phone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">{patient.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {patient.medicalHistory.allergies.length > 0 && (
                          <Chip
                            label={`${patient.medicalHistory.allergies.length} allergies`}
                            size="small"
                            color="warning"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )}
                        {patient.medicalHistory.medications.length > 0 && (
                          <Chip
                            label={`${patient.medicalHistory.medications.length} medications`}
                            size="small"
                            color="info"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )}
                        {patient.medicalHistory.conditions.length > 0 && (
                          <Chip
                            label={`${patient.medicalHistory.conditions.length} conditions`}
                            size="small"
                            color="error"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        )}
                        {patient.medicalHistory.allergies.length === 0 &&
                         patient.medicalHistory.medications.length === 0 &&
                         patient.medicalHistory.conditions.length === 0 && (
                          <Typography variant="body2" color="text.secondary">
                            No medical history
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditPatient(patient)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeletePatient(patient)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit Patient Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <DialogContent>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={formData.gender || 'male'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            {/* Address Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={formData.address?.street || ''}
                onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.address?.city || ''}
                onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="State"
                value={formData.address?.state || ''}
                onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.address?.zipCode || ''}
                onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Emergency Contact
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Name"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Relationship"
                value={formData.emergencyContact?.relationship || ''}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.emergencyContact?.phone || ''}
                onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePatient} variant="contained">
            {editingPatient ? 'Update' : 'Add'} Patient
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {patientToDelete?.firstName} {patientToDelete?.lastName}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add patient"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={handleAddPatient}
      >
        <Add />
      </Fab>
    </Container>
  )
}

export default Patients