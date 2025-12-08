import Image from 'next/image'
import Link from 'next/link'
import type { StrapiCategory } from '@/types'
import { getStrapiImageUrl } from '@/lib/utils'

interface CategoryGridProps {
  categories: StrapiCategory[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">产品分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            // Strapi v5: icon 是数组
            const iconUrl = getStrapiImageUrl(category.icon?.[0]?.url)
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                {iconUrl ? (
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Image
                      src={iconUrl}
                      alt={category.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                )}
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
