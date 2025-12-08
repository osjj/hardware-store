'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { StrapiCategory } from '@/types'

interface ProductFilterProps {
  categories: StrapiCategory[]
}

export default function ProductFilter({ categories }: ProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug) {
      params.set('category', categorySlug)
    } else {
      params.delete('category')
    }
    params.delete('page') // Reset page when changing category
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-3">产品分类</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            !currentCategory
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.slug)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              currentCategory === category.slug
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
