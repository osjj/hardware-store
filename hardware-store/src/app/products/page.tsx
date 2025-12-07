import { Suspense } from 'react'
import { getProducts, getCategories } from '@/services/strapi'
import { getMedusaProducts, getLowestPrice, checkInStock } from '@/services/medusa'
import { ProductGrid, ProductFilter } from '@/components/products'
import { Loading } from '@/components/common'

export const revalidate = 300

interface ProductsPageProps {
  searchParams: { category?: string; page?: string }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const category = searchParams.category

  // Fetch data in parallel
  const [{ products, pagination }, categories, medusaProducts] = await Promise.all([
    getProducts({ category, page, pageSize: 12 }),
    getCategories(),
    getMedusaProducts().catch(() => []),
  ])

  // Build price map from Medusa products
  const priceMap: Record<string, { price: number | null; inStock: boolean }> = {}
  for (const mp of medusaProducts) {
    priceMap[mp.id] = {
      price: getLowestPrice(mp),
      inStock: checkInStock(mp),
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">产品中心</h1>
      
      <Suspense fallback={<Loading text="加载分类..." />}>
        <ProductFilter categories={categories} />
      </Suspense>
      
      <ProductGrid products={products} prices={priceMap} />
      
      {/* Pagination */}
      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/products?${new URLSearchParams({
                ...(category ? { category } : {}),
                page: String(p),
              }).toString()}`}
              className={`px-4 py-2 rounded ${
                p === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
