import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProductBySlug } from '@/services/strapi'
import { getMedusaProductById, getLowestPrice, checkInStock } from '@/services/medusa'
import { AddToCartButton } from '@/components/products'
import { formatPrice } from '@/lib/utils'

export const revalidate = 300

interface ProductDetailPageProps {
  params: { slug: string }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    notFound()
  }

  const { name, description, images, category, medusa_product_id, specs } = product.attributes
  
  // Fetch Medusa data if available
  let medusaProduct = null
  let price: number | null = null
  let inStock = true
  let defaultVariantId: string | null = null

  if (medusa_product_id) {
    medusaProduct = await getMedusaProductById(medusa_product_id)
    if (medusaProduct) {
      price = getLowestPrice(medusaProduct)
      inStock = checkInStock(medusaProduct)
      defaultVariantId = medusaProduct.variants[0]?.id || null
    }
  }

  const imageUrls = images?.data?.map((img) => img.attributes.url) || []
  const categoryName = category?.data?.attributes.name

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {imageUrls[0] ? (
              <Image
                src={imageUrls[0]}
                alt={name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-6xl">📦</span>
              </div>
            )}
          </div>
          {imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imageUrls.slice(1, 5).map((url, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                  <Image src={url} alt={`${name} ${index + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {categoryName && (
            <span className="text-sm text-gray-500 mb-2 block">{categoryName}</span>
          )}
          <h1 className="text-2xl font-bold mb-4">{name}</h1>
          
          {/* Price */}
          <div className="mb-6">
            {price !== null ? (
              <span className="text-3xl font-bold text-secondary">{formatPrice(price)}</span>
            ) : (
              <span className="text-gray-400">暂无报价</span>
            )}
            {!inStock && (
              <span className="ml-4 text-red-500">暂时缺货</span>
            )}
          </div>

          {/* Add to Cart */}
          {defaultVariantId && (
            <AddToCartButton
              variantId={defaultVariantId}
              inStock={inStock}
              className="mb-8"
            />
          )}

          {/* Description */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">产品描述</h2>
            <div 
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: description || '暂无描述' }}
            />
          </div>

          {/* Specs */}
          {specs && Object.keys(specs).length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">规格参数</h2>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-2 text-gray-500 w-1/3">{key}</td>
                      <td className="py-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
