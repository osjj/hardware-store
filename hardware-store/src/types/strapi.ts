// Strapi 通用响应类型
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

export interface StrapiData<T> {
  id: number
  attributes: T
}

// 媒体类型
export interface StrapiMedia {
  data: {
    id: number
    attributes: {
      url: string
      width: number
      height: number
      alternativeText: string | null
      formats?: {
        thumbnail?: { url: string }
        small?: { url: string }
        medium?: { url: string }
        large?: { url: string }
      }
    }
  } | null
}

export interface StrapiMediaMultiple {
  data: Array<{
    id: number
    attributes: {
      url: string
      width: number
      height: number
      alternativeText: string | null
    }
  }>
}

// 产品类型
export interface StrapiProductAttributes {
  name: string
  slug: string
  description: string
  images: StrapiMediaMultiple
  category: { data: StrapiData<StrapiCategoryAttributes> | null }
  medusa_product_id: string
  specs: Record<string, string> | null
  seo_title: string | null
  seo_description: string | null
  featured: boolean
  createdAt: string
  updatedAt: string
}

export type StrapiProduct = StrapiData<StrapiProductAttributes>

// 分类类型
export interface StrapiCategoryAttributes {
  name: string
  slug: string
  icon: StrapiMedia
  parent: { data: StrapiData<StrapiCategoryAttributes> | null }
  sort: number
}

export type StrapiCategory = StrapiData<StrapiCategoryAttributes>

// Banner 类型
export interface StrapiBannerAttributes {
  title: string
  image: StrapiMedia
  link: string
  sort: number
  active: boolean
}

export type StrapiBanner = StrapiData<StrapiBannerAttributes>

// 新闻类型
export type NewsCategory = 'company' | 'industry' | 'product'

export interface StrapiNewsAttributes {
  title: string
  slug: string
  content: string
  cover: StrapiMedia
  publishDate: string
  category: NewsCategory
}

export type StrapiNews = StrapiData<StrapiNewsAttributes>

// 页面类型
export interface StrapiPageAttributes {
  title: string
  slug: string
  content: string
  seo_title: string | null
  seo_description: string | null
}

export type StrapiPage = StrapiData<StrapiPageAttributes>

// 联系表单类型
export interface StrapiContactAttributes {
  name: string
  phone: string
  email: string
  company: string | null
  message: string
  read: boolean
}

export type StrapiContact = StrapiData<StrapiContactAttributes>

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
