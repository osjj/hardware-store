import type {
  StrapiResponse,
  StrapiBanner,
  StrapiProduct,
  StrapiCategory,
  StrapiNews,
  StrapiPage,
  ProductQueryParams,
  NewsQueryParams,
  ContactFormData,
} from '@/types'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bunnybot.top'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

async function fetchStrapi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
  })

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// Banner 相关
export async function getBanners(): Promise<StrapiBanner[]> {
  const response = await fetchStrapi<StrapiResponse<StrapiBanner[]>>(
    '/banners?populate=image&filters[active][$eq]=true&sort=sort:asc'
  )
  return response.data
}

// 产品相关
export async function getProducts(params?: ProductQueryParams): Promise<{
  products: StrapiProduct[]
  pagination: { page: number; pageCount: number; total: number }
}> {
  const searchParams = new URLSearchParams()
  searchParams.set('populate', 'images,category')
  
  if (params?.category) {
    searchParams.set('filters[category][slug][$eq]', params.category)
  }
  if (params?.featured) {
    searchParams.set('filters[featured][$eq]', 'true')
  }
  if (params?.page) {
    searchParams.set('pagination[page]', String(params.page))
  }
  if (params?.pageSize) {
    searchParams.set('pagination[pageSize]', String(params.pageSize))
  }

  const response = await fetchStrapi<StrapiResponse<StrapiProduct[]>>(
    `/products?${searchParams.toString()}`
  )
  
  return {
    products: response.data,
    pagination: {
      page: response.meta.pagination?.page || 1,
      pageCount: response.meta.pagination?.pageCount || 1,
      total: response.meta.pagination?.total || 0,
    },
  }
}

export async function getProductBySlug(slug: string): Promise<StrapiProduct | null> {
  const response = await fetchStrapi<StrapiResponse<StrapiProduct[]>>(
    `/products?filters[slug][$eq]=${slug}&populate=images,category`
  )
  return response.data[0] || null
}

// 分类相关
export async function getCategories(): Promise<StrapiCategory[]> {
  const response = await fetchStrapi<StrapiResponse<StrapiCategory[]>>(
    '/categories?populate=icon,parent&sort=sort:asc'
  )
  return response.data
}

// 新闻相关
export async function getNews(params?: NewsQueryParams): Promise<{
  news: StrapiNews[]
  pagination: { page: number; pageCount: number; total: number }
}> {
  const searchParams = new URLSearchParams()
  searchParams.set('populate', 'cover')
  searchParams.set('sort', 'publishDate:desc')
  
  if (params?.category) {
    searchParams.set('filters[category][$eq]', params.category)
  }
  if (params?.page) {
    searchParams.set('pagination[page]', String(params.page))
  }
  if (params?.pageSize) {
    searchParams.set('pagination[pageSize]', String(params.pageSize))
  }

  const response = await fetchStrapi<StrapiResponse<StrapiNews[]>>(
    `/news?${searchParams.toString()}`
  )
  
  return {
    news: response.data,
    pagination: {
      page: response.meta.pagination?.page || 1,
      pageCount: response.meta.pagination?.pageCount || 1,
      total: response.meta.pagination?.total || 0,
    },
  }
}

export async function getNewsBySlug(slug: string): Promise<StrapiNews | null> {
  const response = await fetchStrapi<StrapiResponse<StrapiNews[]>>(
    `/news?filters[slug][$eq]=${slug}&populate=cover`
  )
  return response.data[0] || null
}

// 页面相关
export async function getPage(slug: string): Promise<StrapiPage | null> {
  const response = await fetchStrapi<StrapiResponse<StrapiPage[]>>(
    `/pages?filters[slug][$eq]=${slug}`
  )
  return response.data[0] || null
}

// 联系表单
export async function submitContact(data: ContactFormData): Promise<void> {
  await fetchStrapi('/contacts', {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
}

// 筛选工具函数
export function filterProductsByCategory(
  products: StrapiProduct[],
  categorySlug: string
): StrapiProduct[] {
  return products.filter(
    (p) => p.attributes.category?.data?.attributes.slug === categorySlug
  )
}

export function filterNewsByCategory(
  news: StrapiNews[],
  category: string
): StrapiNews[] {
  return news.filter((n) => n.attributes.category === category)
}
