import type { StrapiProduct } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: StrapiProduct[]
  prices?: Record<string, { price: number | null; inStock: boolean }>
}

export default function ProductGrid({ products, prices = {} }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无产品</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const medusaId = product.attributes.medusa_product_id
        const priceData = medusaId ? prices[medusaId] : undefined
        
        return (
          <ProductCard
            key={product.id}
            product={product}
            price={priceData?.price}
            inStock={priceData?.inStock ?? true}
          />
        )
      })}
    </div>
  )
}
