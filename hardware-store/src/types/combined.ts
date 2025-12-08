import type { StrapiCategory } from './strapi'
import type { MedusaVariant } from './medusa'

// 整合 Strapi + Medusa 的产品类型
export interface CombinedProduct {
  // From Strapi
  id: number
  name: string
  slug: string
  description: string
  images: string[]
  category: {
    id: number
    name: string
    slug: string
  } | null
  specs: Record<string, string> | null
  seoTitle: string | null
  seoDescription: string | null
  featured: boolean

  // From Medusa
  medusaId: string
  price: number | null
  comparePrice: number | null
  inStock: boolean
  stockQuantity: number
  variants: MedusaVariant[]
}

// 简化的产品卡片类型
export interface ProductCardData {
  id: number
  name: string
  slug: string
  image: string | null
  category: string | null
  price: number | null
  inStock: boolean
}

// 新闻列表项类型
export interface NewsListItem {
  id: number
  title: string
  slug: string
  summary: string
  coverUrl: string | null
  publishDate: string
  category: 'company' | 'industry' | 'product'
}

// 购物车项类型（前端使用）
export interface CartItemData {
  id: string
  variantId: string
  productName: string
  variantTitle: string
  thumbnail: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

// 购物车状态类型
export interface CartState {
  cartId: string | null
  items: CartItemData[]
  subtotal: number
  total: number
  itemCount: number
}

// 订单列表项类型
export interface OrderListItem {
  id: string
  displayId: number
  status: string
  total: number
  itemCount: number
  createdAt: string
}

// 订单详情类型
export interface OrderDetail {
  id: string
  displayId: number
  status: string
  fulfillmentStatus: string
  paymentStatus: string
  items: {
    title: string
    quantity: number
    unitPrice: number
    total: number
    thumbnail: string | null
  }[]
  subtotal: number
  shippingTotal: number
  taxTotal: number
  total: number
  shippingAddress: {
    name: string
    phone: string | null
    address: string
    city: string
  } | null
  trackingNumbers: string[]
  createdAt: string
}
