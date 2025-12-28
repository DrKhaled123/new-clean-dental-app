import { 
  Patient, 
  Appointment, 
  Treatment, 
  Prescription, 
  Dentist, 
  Invoice, 
  CalendarEvent,
  AppSettings,
  EntityType,
  CRUDOperations
} from '../types'

// Local storage keys
const STORAGE_KEYS = {
  PATIENTS: 'dental_app_patients',
  APPOINTMENTS: 'dental_app_appointments',
  TREATMENTS: 'dental_app_treatments',
  PRESCRIPTIONS: 'dental_app_prescriptions',
  DENTISTS: 'dental_app_dentists',
  INVOICES: 'dental_app_invoices',
  CALENDAR_EVENTS: 'dental_app_calendar_events',
  SETTINGS: 'dental_app_settings'
} as const

// Generic storage service class
class StorageService<T extends { id: string; createdAt: string; updatedAt: string }> implements CRUDOperations<T> {
  private storageKey: string

  constructor(storageKey: string) {
    this.storageKey = storageKey
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString()
  }

  private getAllItems(): T[] {
    try {
      const items = localStorage.getItem(this.storageKey)
      return items ? JSON.parse(items) : []
    } catch (error) {
      console.error(`Error reading ${this.storageKey} from localStorage:`, error)
      return []
    }
  }

  private saveAllItems(items: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items))
    } catch (error) {
      console.error(`Error saving ${this.storageKey} to localStorage:`, error)
      throw new Error(`Failed to save data to localStorage`)
    }
  }

  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem: T = {
      ...item,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    } as T

    const items = this.getAllItems()
    items.push(newItem)
    this.saveAllItems(items)
    
    return newItem
  }

  read(id: string): T | null {
    const items = this.getAllItems()
    return items.find(item => item.id === id) || null
  }

  readAll(): T[] {
    return this.getAllItems()
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.getAllItems()
    const index = items.findIndex(item => item.id === id)
    
    if (index === -1) {
      return null
    }

    const updatedItem: T = {
      ...items[index],
      ...updates,
      updatedAt: this.getCurrentTimestamp()
    } as T

    items[index] = updatedItem
    this.saveAllItems(items)
    
    return updatedItem
  }

  delete(id: string): boolean {
    const items = this.getAllItems()
    const filteredItems = items.filter(item => item.id !== id)
    
    if (filteredItems.length === items.length) {
      return false // Item not found
    }

    this.saveAllItems(filteredItems)
    return true
  }

  search(criteria: Partial<T>): T[] {
    const items = this.getAllItems()
    
    return items.filter(item => {
      return Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return true
        }
        
        const itemValue = (item as any)[key]
        
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }
        
        return itemValue === value
      })
    })
  }
}

// Specific service instances
export const patientService = new StorageService<Patient>(STORAGE_KEYS.PATIENTS)
export const appointmentService = new StorageService<Appointment>(STORAGE_KEYS.APPOINTMENTS)
export const treatmentService = new StorageService<Treatment>(STORAGE_KEYS.TREATMENTS)
export const prescriptionService = new StorageService<Prescription>(STORAGE_KEYS.PRESCRIPTIONS)
export const dentistService = new StorageService<Dentist>(STORAGE_KEYS.DENTISTS)
export const invoiceService = new StorageService<Invoice>(STORAGE_KEYS.INVOICES)
export const calendarEventService = new StorageService<CalendarEvent>(STORAGE_KEYS.CALENDAR_EVENTS)

// Settings service (simplified for settings object)
export const settingsService = {
  get(): AppSettings | null {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return settings ? JSON.parse(settings) : null
    } catch (error) {
      console.error('Error reading settings from localStorage:', error)
      return null
    }
  },

  save(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings to localStorage:', error)
      throw new Error('Failed to save settings to localStorage')
    }
  },

  update(updates: Partial<AppSettings>): AppSettings | null {
    const currentSettings = this.get()
    if (!currentSettings) {
      return null
    }

    const updatedSettings = {
      ...currentSettings,
      ...updates
    }

    this.save(updatedSettings)
    return updatedSettings
  }
}

// Utility functions
export const StorageUtils = {
  // Generate unique IDs
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  // Format dates for storage
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  },

  // Format datetime for storage
  formatDateTime(date: Date): string {
    return date.toISOString()
  },

  // Parse date strings
  parseDate(dateString: string): Date {
    return new Date(dateString)
  },

  // Check if localStorage is available
  isLocalStorageAvailable(): boolean {
    try {
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  // Clear all dental app data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  },

  // Export all data as JSON
  exportAllData(): string {
    const data: Record<string, any> = {}
    
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const items = localStorage.getItem(key)
      data[name] = items ? JSON.parse(items) : []
    })

    return JSON.stringify(data, null, 2)
  },

  // Import data from JSON
  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData)
      
      Object.entries(data).forEach(([name, items]) => {
        const key = STORAGE_KEYS[name as keyof typeof STORAGE_KEYS]
        if (key) {
          localStorage.setItem(key, JSON.stringify(items))
        }
      })
    } catch (error) {
      console.error('Error importing data:', error)
      throw new Error('Invalid data format')
    }
  }
}

// Initialize default data if none exists
export const initializeDefaultData = () => {
  // Check if we have any existing data
  const hasExistingData = patientService.readAll().length > 0
  
  if (!hasExistingData) {
    // Create a default dentist
    const defaultDentist: Omit<Dentist, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: 'Dr. John',
      lastName: 'Smith',
      licenseNumber: 'DEN123456',
      specialty: ['General Dentistry'],
      phone: '(555) 123-4567',
      email: 'dr.smith@dentistapp.com',
      availableHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '09:00', end: '13:00' },
        sunday: { start: '', end: '', isOpen: false } as any
      }
    }
    
    dentistService.create(defaultDentist)

    // Create default settings
    const defaultSettings: AppSettings = {
      practiceInfo: {
        name: 'New Clean Dental Practice',
        address: '123 Main Street, City, State 12345',
        phone: '(555) 123-4567',
        email: 'info@newcleandental.com',
        website: 'www.newcleandental.com'
      },
      workingHours: {
        monday: { start: '09:00', end: '17:00', isOpen: true },
        tuesday: { start: '09:00', end: '17:00', isOpen: true },
        wednesday: { start: '09:00', end: '17:00', isOpen: true },
        thursday: { start: '09:00', end: '17:00', isOpen: true },
        friday: { start: '09:00', end: '17:00', isOpen: true },
        saturday: { start: '09:00', end: '13:00', isOpen: true },
        sunday: { start: '', end: '', isOpen: false }
      },
      appointmentSettings: {
        defaultDuration: 60,
        bufferTime: 15,
        maxAdvanceBooking: 90
      },
      billingSettings: {
        currency: 'USD',
        taxRate: 0.08,
        lateFeePolicy: 'Late fees apply after 30 days'
      }
    }
    
    settingsService.save(defaultSettings)
  }
}