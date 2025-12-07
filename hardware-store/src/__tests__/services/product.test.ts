import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { checkInStock, getLowestPrice } from '@/services/medusa'
import type { MedusaProduct, MedusaVariant, StrapiProduct } from '@/types'

// Test data generators
const medusaPriceArbitrary = fc.record({
  id: fc.uuid(),
  currency_code: fc.constantFrom('cny', 'usd'),
  amount: fc.integer({ min: 100, max: 100000 }),
})

const medusaVariantArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  sku: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: null }),
  prices: fc.array(medusaPriceArbitrary, { minLength: 1, maxLength: 3 }),
  inventory_quantity: fc.integer({ min: 0, max: 1000 }),
  options: fc.constant([]),
}) as fc.Arbitrary<MedusaVariant>

const medusaProductArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  handle: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.option(fc.string(), { nil: null }),
  thumbnail: fc.option(fc.webUrl(), { nil: null }),
  variants: fc.array(medusaVariantArbitrary, { minLength: 1, maxLength: 5 }),
  images: fc.constant([]),
  collection_id: fc.option(fc.uuid(), { nil: null }),
  created_at: fc.date().map((d) => d.toISOString()),
  updated_at: fc.date().map((d) => d.toISOString()),
}) as fc.Arbitrary<MedusaProduct>

// Combined product type for testing
interface CombinedProductData {
  // From Strapi
  name: string
  slug: string
  description: string
  images: string[]
  // From Medusa
  medusaId: string
  price: number | null
  inStock: boolean
  stockQuantity: number
}

function combineProductData(
  strapiData: { name: string; slug: string; description: string; images: string[] },
  medusaData: MedusaProduct | null
): CombinedProductData {
  const price = medusaData ? getLowestPrice(medusaData) : null
  const inStock = medusaData ? checkInStock(medusaData) : false
  const stockQuantity = medusaData
    ? medusaData.variants.reduce((sum, v) => sum + v.inventory_quantity, 0)
    : 0

  return {
    name: strapiData.name,
    slug: strapiData.slug,
    description: strapiData.description,
    images: strapiData.images,
    medusaId: medusaData?.id || '',
    price,
    inStock,
    stockQuantity,
  }
}

describe('Product Integration - Property Tests', () => {
  /**
   * **Feature: hardware-store-website, Property 1: Product data integration completeness**
   * *For any* product fetched from the system, the combined data SHALL contain 
   * name, images, description (from Strapi) AND price, stock quantity (from Medusa) 
   * when both APIs are available.
   * **Validates: Requirements 2.1, 2.4**
   */
  it('Property 1: Combined product contains all required fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          slug: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string(),
          images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 5 }),
        }),
        medusaProductArbitrary,
        (strapiData, medusaData) => {
          const combined = combineProductData(strapiData, medusaData)
          
          // Check all required fields are present
          const hasName = typeof combined.name === 'string' && combined.name.length > 0
          const hasSlug = typeof combined.slug === 'string' && combined.slug.length > 0
          const hasDescription = typeof combined.description === 'string'
          const hasImages = Array.isArray(combined.images)
          const hasMedusaId = typeof combined.medusaId === 'string' && combined.medusaId.length > 0
          const hasPrice = combined.price === null || typeof combined.price === 'number'
          const hasInStock = typeof combined.inStock === 'boolean'
          const hasStockQuantity = typeof combined.stockQuantity === 'number'
          
          return hasName && hasSlug && hasDescription && hasImages && 
                 hasMedusaId && hasPrice && hasInStock && hasStockQuantity
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: hardware-store-website, Property 7: Out of stock state correctness**
   * *For any* product variant with inventory_quantity = 0, the system SHALL 
   * return inStock = false and the UI SHALL disable purchase actions.
   * **Validates: Requirements 5.5**
   */
  it('Property 7: Zero inventory means out of stock', () => {
    fc.assert(
      fc.property(
        medusaProductArbitrary.map((product) => ({
          ...product,
          variants: product.variants.map((v) => ({ ...v, inventory_quantity: 0 })),
        })),
        (product) => {
          const inStock = checkInStock(product)
          
          // If all variants have 0 inventory, should be out of stock
          return inStock === false
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 7: Positive inventory means in stock', () => {
    fc.assert(
      fc.property(
        medusaProductArbitrary.filter((product) =>
          product.variants.some((v) => v.inventory_quantity > 0)
        ),
        (product) => {
          const inStock = checkInStock(product)
          
          // If any variant has positive inventory, should be in stock
          return inStock === true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Additional property: Price is from variants
  // Note: getLowestPrice takes the FIRST matching price from each variant, not all prices
  it('Property 1 (additional): Lowest price is from first variant prices', () => {
    fc.assert(
      fc.property(
        medusaProductArbitrary,
        (product) => {
          const lowestPrice = getLowestPrice(product, 'cny')
          
          // Get first CNY price from each variant (matching the implementation)
          const firstCnyPrices = product.variants
            .map((v) => v.prices.find((p) => p.currency_code === 'cny'))
            .filter((p): p is { id: string; currency_code: string; amount: number } => p !== undefined)
            .map((p) => p.amount)
          
          if (firstCnyPrices.length === 0) {
            // No CNY prices available, should return null
            return lowestPrice === null
          }
          
          // Lowest price should equal the minimum of first CNY prices from each variant
          const expectedLowest = Math.min(...firstCnyPrices)
          return lowestPrice === expectedLowest
        }
      ),
      { numRuns: 100 }
    )
  })
})
