// Medusa 产品类型
export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: MedusaVariant[]
  images: MedusaImage[]
  collection_id: string | null
  created_at: string
  updated_at: string
}

export interface MedusaVariant {
  id: string
  title: string
  sku: string | null
  prices: MedusaPrice[]
  inventory_quantity: number
  options: MedusaOption[]
}

export interface MedusaPrice {
  id: string
  currency_code: string
  amount: number
}

export interface MedusaImage {
  id: string
  url: string
}

export interface MedusaOption {
  id: string
  value: string
}

// 购物车类型
export interface MedusaCart {
  id: string
  items: MedusaCartItem[]
  region_id: string
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
  created_at: string
  updated_at: string
}

export interface MedusaCartItem {
  id: string
  cart_id: string
  variant_id: string
  variant: MedusaVariant
  title: string
  description: string | null
  thumbnail: string | null
  quantity: number
  unit_price: number
  subtotal: number
  total: number
}

// 用户类型
export interface MedusaCustomer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  created_at: string
}

// 订单类型
export interface MedusaOrder {
  id: string
  display_id: number
  status: OrderStatus
  fulfillment_status: FulfillmentStatus
  payment_status: PaymentStatus
  items: MedusaOrderItem[]
  subtotal: number
  tax_total: number
  shipping_total: number
  total: number
  created_at: string
  shipping_address: MedusaAddress | null
  fulfillments: MedusaFulfillment[]
}

export type OrderStatus = 'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action'
export type FulfillmentStatus = 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled' | 'shipped' | 'canceled'
export type PaymentStatus = 'not_paid' | 'awaiting' | 'captured' | 'refunded' | 'canceled'

export interface MedusaOrderItem {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  quantity: number
  unit_price: number
  subtotal: number
  total: number
  variant: MedusaVariant
}

export interface MedusaAddress {
  id: string
  first_name: string
  last_name: string
  phone: string | null
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  postal_code: string | null
  country_code: string
}

export interface MedusaFulfillment {
  id: string
  tracking_numbers: string[]
  tracking_links: { url: string }[]
  created_at: string
}

// API 响应类型
export interface MedusaProductsResponse {
  products: MedusaProduct[]
  count: number
  offset: number
  limit: number
}

export interface MedusaProductResponse {
  product: MedusaProduct
}

export interface MedusaCartResponse {
  cart: MedusaCart
}

export interface MedusaCustomerResponse {
  customer: MedusaCustomer
}

export interface MedusaOrdersResponse {
  orders: MedusaOrder[]
  count: number
  offset: number
  limit: number
}

export interface MedusaOrderResponse {
  order: MedusaOrder
}

// 认证类型
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}
