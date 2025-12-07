'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { NewsCategory } from '@/types'

const categories: { value: NewsCategory | ''; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'company', label: '公司动态' },
  { value: 'industry', label: '行业资讯' },
  { value: 'product', label: '产品知识' },
]

export default function NewsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/news?${params.toString()}`)
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              currentCategory === cat.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
