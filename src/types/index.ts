export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'engineer' | 'supervisor'
  department: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Tool {
  id: string
  name: string
  description: string
  category: ToolCategory
  serialNumber: string
  barcode: string
  status: ToolStatus
  location: string
  assignedTo?: string
  lastCheckedOut?: string
  lastCheckedIn?: string
  maintenanceDate?: string
  nextMaintenanceDate?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export type ToolStatus = 'available' | 'checked_out' | 'maintenance' | 'retired'
export type ToolCategory = 'hand_tools' | 'power_tools' | 'measuring' | 'safety' | 'specialized'

export interface ToolTransaction {
  id: string
  toolId: string
  userId: string
  type: 'checkout' | 'checkin' | 'maintenance' | 'repair'
  timestamp: string
  notes?: string
  condition?: 'excellent' | 'good' | 'fair' | 'poor'
  location?: string
  imageUrl?: string
}

export interface MLDetection {
  toolId?: string
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  category: string
  condition?: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  department: string
  role: 'engineer' | 'supervisor'
}

export interface DashboardStats {
  totalTools: number
  availableTools: number
  checkedOutTools: number
  maintenanceTools: number
  recentTransactions: ToolTransaction[]
  upcomingMaintenance: Tool[]
}
