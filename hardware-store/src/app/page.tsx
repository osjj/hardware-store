import { getBanners, getCategories, getProducts } from '@/services/strapi'
import { Banner, CategoryGrid, Highlights, FeaturedProducts } from '@/components/home'

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  // Fetch data in parallel
  const [banners, categories, { products }] = await Promise.all([
    getBanners().catch(() => []),
    getCategories().catch(() => []),
    getProducts({ featured: true, pageSize: 8 }).catch(() => ({ products: [], pagination: { page: 1, pageCount: 1, total: 0 } })),
  ])

  return (
    <>
      <Banner banners={banners} />
      <CategoryGrid categories={categories} />
      <Highlights />
      <FeaturedProducts products={products} />
    </>
  )
}
