// Strapi v5 通用响应类型（扁平化结构）
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Strapi v5 媒体类型（扁平化，直接是数组）
export interface StrapiMediaItem {
  id: number
  documentId?: string
  url: string
  width?: number
  height?: number
  alternativeText?: string | null
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

// 产品类型 (Strapi v5 扁平化)
export interface StrapiProduct {
  id: number
  documentId?: string
  name: string
  slug: string
  description: string
  images: StrapiMediaItem[] | null
  category: StrapiCategory | null
  medusa_product_id: string | null
  specs: Record<string, string> | null
  seo_title: string | null
  seo_description: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

// 分类类型 (Strapi v5 扁平化)
export interface StrapiCategory {
  id: number
  documentId?: string
  name: string
  slug: string
  icon: StrapiMediaItem[] | null
  parent: StrapiCategory | null
  sort: number
}

// Banner 类型 (Strapi v5 扁平化)
export interface StrapiBanner {
  id: number
  documentId?: string
  title: string
  image: StrapiMediaItem[] | null
  link: string | null
  sort: number
  active: boolean
}

// 新闻类型 (Strapi v5 扁平化)
export type NewsCategory = 'company' | 'industry' | 'product'

export interface StrapiNews {
  id: number
  documentId?: string
  title: string
  slug: string
  content: string
  cover: StrapiMediaItem[] | null
  publishDate: string
  category: NewsCategory
}

// 页面类型 (Strapi v5 扁平化)
export interface StrapiPage {
  id: number
  documentId?: string
  title: string
  slug: string
  content: string
  seo_title: string | null
  seo_description: string | null
}

// 联系表单类型 (Strapi v5 扁平化)
export interface StrapiContact {
  id: number
  documentId?: string
  name: string
  phone: string
  email: string
  company: string | null
  message: string
  read: boolean
}

// 查询参数类型
export interface ProductQueryParams {
  category?: string
  featured?: boolean
  page?: number
  pageSize?: number
}

export interface NewsQueryParams {
  category?: NewsCategory
  page?: number
  pageSize?: number
}

// 联系表单提交数据
export interface ContactFormData {
  name: string
  phone: string
  email: string
  company?: string
  message: string
}
