// Core data types for the dental practice management system

export interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalHistory: {
    allergies: string[]
    medications: string[]
    conditions: string[]
    notes: string
  }
  insurance?: {
    provider: string
    policyNumber: string
    groupNumber: string
  }
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  patientId: string
  dentistId: string
  date: string
  time: string
  duration: number // in minutes
  type: 'consultation' | 'cleaning' | 'treatment' | 'follow-up' | 'emergency' | 'surgery'
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  description: string
  notes: string
  cost: number
  createdAt: string
  updatedAt: string
}

export interface Treatment {
  id: string
  patientId: string
  appointmentId?: string
  name: string
  description: string
  type: 'preventive' | 'restorative' | 'surgical' | 'orthodontic' | 'cosmetic'
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  cost: number
  duration: number // estimated duration in minutes
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Prescription {
  id: string
  patientId: string
  appointmentId?: string
  dentistId: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  status: 'active' | 'completed' | 'cancelled'
  prescribedDate: string
  createdAt: string
  updatedAt: string
}

export interface Dentist {
  id: string
  firstName: string
  lastName: string
  licenseNumber: string
  specialty: string[]
  phone: string
  email: string
  availableHours: {
    [key: string]: { // day of week
      start: string
      end: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface Invoice {
  id: string
  patientId: string
  appointmentId?: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax: number
  discount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  duration: number
  type: 'appointment' | 'reminder' | 'block'
  patientId?: string
  dentistId?: string
  description: string
  color: string
}

export interface SearchFilters {
  patients: {
    searchTerm: string
    gender?: string
    ageRange?: { min: number; max: number }
  }
  appointments: {
    dateRange?: { start: string; end: string }
    status?: string
    type?: string
    dentistId?: string
  }
  treatments: {
    status?: string
    type?: string
    priority?: string
  }
}

export interface AppSettings {
  practiceInfo: {
    name: string
    address: string
    phone: string
    email: string
    website?: string
  }
  workingHours: {
    [key: string]: { // day of week
      start: string
      end: string
      isOpen: boolean
    }
  }
  appointmentSettings: {
    defaultDuration: number
    bufferTime: number
    maxAdvanceBooking: number // days
  }
  billingSettings: {
    currency: string
    taxRate: number
    lateFeePolicy: string
  }
}

export type EntityType = 'patients' | 'appointments' | 'treatments' | 'prescriptions' | 'invoices'

export interface CRUDOperations<T> {
  create: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => T
  read: (id: string) => T | null
  readAll: () => T[]
  update: (id: string, updates: Partial<T>) => T | null
  delete: (id: string) => boolean
  search: (criteria: any) => T[]
}