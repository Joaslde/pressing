export type UserRole = 'client' | 'livreur' | 'admin'

export interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  phone: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
  has_google_account: boolean
}

export interface Address {
  id: number
  label: string
  full_address: string
  latitude: number | null
  longitude: number | null
  city: string | null
  district: string | null
  instructions: string | null
  is_default: boolean
}

export interface Service {
  id: number
  name: string
  slug: string
  description: string | null
  treatment_type: string
  is_active: boolean
}

export interface Article {
  id: number
  name: string
  description: string | null
  price: number
  is_active: boolean
}

export interface Fee {
  id: number
  type: 'pickup' | 'delivery' | 'other'
  label: string
  amount: number
  is_active: boolean
}

export interface TimeSlot {
  id: number
  label: string
  start_time: string
  end_time: string
  max_capacity: number | null
  remaining_capacity?: number | null
  is_active: boolean
}

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'confirmed'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'processing'
  | 'ready'
  | 'awaiting_balance'
  | 'delivery_scheduled'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'pending' | 'deposit_paid' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  id: number
  article_id: number
  article_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  status: OrderStatus
  status_label: string
  payment_status: PaymentStatus
  payment_status_label: string
  service?: Service
  pickup_address?: Address
  delivery_address?: Address
  time_slot?: TimeSlot
  pickup_date: string
  items: OrderItem[]
  estimated_amount: number
  final_amount: number | null
  deposit_amount: number | null
  notes: string | null
  created_at: string
  user?: User
}

export type PaymentMethod = 'kkiapay' | 'fedapay'

export interface Payment {
  id: number
  order_id: number
  amount: number
  method: PaymentMethod
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  status_label: string
  paid_at: string | null
}

export interface Livreur {
  id: number
  user_id: number
  first_name: string
  last_name: string
  full_name: string
  phone: string
  email: string
  is_active: boolean
  status: 'available' | 'busy' | 'inactive'
  status_label: string
}

export interface Assignment {
  id: number
  mission_type: 'pickup' | 'delivery'
  mission_type_label: string
  status: 'assigned' | 'confirmed' | 'completed' | 'cancelled'
  status_label: string
  assigned_at: string | null
  completed_at: string | null
  order: {
    id: number
    order_number: string
    status: OrderStatus
    status_label: string
    pickup_date: string
    time_slot: TimeSlot
    address: Address
    client: { full_name: string; phone: string }
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
  links?: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface AdminDashboardStats {
  today: {
    orders_count: number
    orders_pending: number
    pickups_scheduled: number
    deliveries_scheduled: number
    payments_received: number
    revenue: number
  }
  top_services: Array<{ name: string; total: number }>
  active_clients: number
}
