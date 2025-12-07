import type {
  MedusaProduct,
  MedusaCart,
  MedusaCustomer,
  MedusaOrder,
  MedusaProductsResponse,
  MedusaProductResponse,
  MedusaCartResponse,
  MedusaCustomerResponse,
  MedusaOrdersResponse,
  MedusaOrderResponse,
  LoginCredentials,
  RegisterData,
} from '@/types'

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'https://api.bunnybot.top'

async function fetchMedusa<T>(
  endpoint: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const url = `${MEDUSA_URL}${endpoint}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Medusa API error: ${res.status}`)
  }

  return res.json()
}

// 产品相关
export async function getMedusaProducts(): Promise<MedusaProduct[]> {
  const response = await fetchMedusa<MedusaProductsResponse>('/store/products')
  return response.products
}

export async function getMedusaProductById(id: string): Promise<MedusaProduct | null> {
  try {
    const response = await fetchMedusa<MedusaProductResponse>(`/store/products/${id}`)
    return response.product
  } catch {
    return null
  }
}

export async function getMedusaProductByHandle(handle: string): Promise<MedusaProduct | null> {
  try {
    const response = await fetchMedusa<MedusaProductsResponse>(
      `/store/products?handle=${handle}`
    )
    return response.products[0] || null
  } catch {
    return null
  }
}

// 购物车相关
export async function createCart(): Promise<MedusaCart> {
  const response = await fetchMedusa<MedusaCartResponse>('/store/carts', {
    method: 'POST',
    body: JSON.stringify({}),
  })
  return response.cart
}

export async function getCart(cartId: string): Promise<MedusaCart | null> {
  try {
    const response = await fetchMedusa<MedusaCartResponse>(`/store/carts/${cartId}`)
    return response.cart
  } catch {
    return null
  }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<MedusaCart> {
  const response = await fetchMedusa<MedusaCartResponse>(
    `/store/carts/${cartId}/line-items`,
    {
      method: 'POST',
      body: JSON.stringify({ variant_id: variantId, quantity }),
    }
  )
  return response.cart
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  quantity: number
): Promise<MedusaCart> {
  const response = await fetchMedusa<MedusaCartResponse>(
    `/store/carts/${cartId}/line-items/${itemId}`,
    {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    }
  )
  return response.cart
}

export async function removeFromCart(
  cartId: string,
  itemId: string
): Promise<MedusaCart> {
  const response = await fetchMedusa<MedusaCartResponse>(
    `/store/carts/${cartId}/line-items/${itemId}`,
    { method: 'DELETE' }
  )
  return response.cart
}

// 用户认证相关
export async function login(credentials: LoginCredentials): Promise<MedusaCustomer> {
  const response = await fetchMedusa<MedusaCustomerResponse>('/store/auth', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return response.customer
}

export async function register(data: RegisterData): Promise<MedusaCustomer> {
  const response = await fetchMedusa<MedusaCustomerResponse>('/store/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.customer
}

export async function getCustomer(token?: string): Promise<MedusaCustomer | null> {
  try {
    const response = await fetchMedusa<MedusaCustomerResponse>('/store/auth', { token })
    return response.customer
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  await fetchMedusa('/store/auth', { method: 'DELETE' })
}

// 订单相关
export async function getOrders(token?: string): Promise<MedusaOrder[]> {
  const response = await fetchMedusa<MedusaOrdersResponse>(
    '/store/customers/me/orders',
    { token }
  )
  return response.orders
}

export async function getOrderById(orderId: string, token?: string): Promise<MedusaOrder | null> {
  try {
    const response = await fetchMedusa<MedusaOrderResponse>(
      `/store/orders/${orderId}`,
      { token }
    )
    return response.order
  } catch {
    return null
  }
}

// 工具函数：检查库存
export function checkInStock(product: MedusaProduct): boolean {
  if (!product.variants || product.variants.length === 0) return false
  return product.variants.some((v) => v.inventory_quantity > 0)
}

// 工具函数：获取最低价格
export function getLowestPrice(product: MedusaProduct, currencyCode = 'cny'): number | null {
  if (!product.variants || product.variants.length === 0) return null
  
  let lowestPrice: number | null = null
  for (const variant of product.variants) {
    const price = variant.prices.find((p) => p.currency_code === currencyCode)
    if (price && (lowestPrice === null || price.amount < lowestPrice)) {
      lowestPrice = price.amount
    }
  }
  return lowestPrice
}

// 工具函数：计算购物车总数
export function calculateCartItemCount(cart: MedusaCart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

// 工具函数：计算购物车总价
export function calculateCartTotal(cart: MedusaCart): number {
  return cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
}
