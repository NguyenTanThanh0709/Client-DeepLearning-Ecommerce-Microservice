type Role = 'User' | 'Admin'

export interface User {

  id: number
  email: string
  phone?: string
  password?: string // ISO 8610
  city?: string
  district?: string
  ward?: string
  detailLocation?: string

}
