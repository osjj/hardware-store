import Image from 'next/image'
import Link from 'next/link'
import type { StrapiProduct } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: StrapiProduct
  price?: number | null
  inStock?: boolean
}

export default function ProductCard({ product, price, inStock = true }: ProductCardProps) {
  const { name, slug, images, category } = product.attributes
  const imageUrl = images?.data?.[0]?.attributes.url
  const categoryName = category?.data?.attributes.name

  return (
    <Link
      href={`/products/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative aspect-square bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">暂时缺货</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {categoryName && (
          <span className="text-xs text-gray-500 mb-1 block">{categoryName}</span>
        )}
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">{name}</h3>
        <div className="flex items-center justify-between">
          {price !== undefined && price !== null ? (
            <span className="text-lg font-bold text-secondary">{formatPrice(price)}</span>
          ) : (
            <span className="text-sm text-gray-400">暂无报价</span>
          )}
        </div>
      </div>
    </Link>
  )
}
