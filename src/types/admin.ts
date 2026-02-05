export interface AdminUser {
  uid: string
  email: string
  displayName?: string
  role: 'admin' | 'super-admin'
  isActive: boolean
  createdAt: string
  lastLoginAt: string
  permissions?: string[]
}

export interface CreateAdminDto {
  email: string
  displayName?: string
  role: 'admin' | 'super-admin'
  password: string
  isActive?: boolean
}

export interface UpdateAdminDto {
  displayName?: string
  role?: 'admin' | 'super-admin'
  isActive?: boolean
  permissions?: string[]
}