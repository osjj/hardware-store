const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bunnybot.top'

export function formatPrice(amount: number): string {
  return `¥${(amount / 100).toFixed(2)}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 获取 Strapi 图片完整 URL
 * Strapi v5 返回相对路径如 /uploads/xxx.jpg
 */
export function getStrapiImageUrl(url: string | undefined | null): string | null {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}
