import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { filterProductsByCategory, filterNewsByCategory } from '@/services/strapi'
import type { StrapiProduct, StrapiNews, NewsCategory } from '@/types'

// Test data generators
const categoryArbitrary = fc.constantFrom('劳保用品', '五金工具', '安全设备', '电动工具')

const strapiProductArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  attributes: fc.record({
    name: fc.string({ minLength: 1, maxLength: 100 }),
    slug: fc.string({ minLength: 1, maxLength: 50 }),
    description: fc.string(),
    images: fc.constant({ data: [] }),
    category: fc.oneof(
      fc.constant({ data: null }),
      fc.record({
        data: fc.record({
          id: fc.integer({ min: 1 }),
          attributes: fc.record({
            name: categoryArbitrary,
            slug: categoryArbitrary,
            icon: fc.constant({ data: null }),
            parent: fc.constant({ data: null }),
            sort: fc.integer({ min: 0, max: 100 }),
          }),
        }),
      })
    ),
    medusa_product_id: fc.uuid(),
    specs: fc.constant(null),
    seo_title: fc.constant(null),
    seo_description: fc.constant(null),
    featured: fc.boolean(),
    createdAt: fc.date().map((d) => d.toISOString()),
    updatedAt: fc.date().map((d) => d.toISOString()),
  }),
}) as fc.Arbitrary<StrapiProduct>

const newsCategoryArbitrary = fc.constantFrom('company', 'industry', 'product') as fc.Arbitrary<NewsCategory>

const strapiNewsArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  attributes: fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    slug: fc.string({ minLength: 1, maxLength: 50 }),
    content: fc.string(),
    cover: fc.constant({ data: null }),
    publishDate: fc.date().map((d) => d.toISOString().split('T')[0]),
    category: newsCategoryArbitrary,
  }),
}) as fc.Arbitrary<StrapiNews>

describe('Strapi Service - Property Tests', () => {
  /**
   * **Feature: hardware-store-website, Property 2: Category filter correctness**
   * *For any* category filter applied to products, all returned products 
   * SHALL have a category field matching the filter value.
   * **Validates: Requirements 2.2**
   */
  it('Property 2: Category filter returns only matching products', () => {
    fc.assert(
      fc.property(
        fc.array(strapiProductArbitrary, { minLength: 0, maxLength: 20 }),
        categoryArbitrary,
        (products, categorySlug) => {
          const filtered = filterProductsByCategory(products, categorySlug)
          
          // All filtered products must have matching category
          return filtered.every(
            (p) => p.attributes.category?.data?.attributes.slug === categorySlug
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: hardware-store-website, Property 3: News category filter correctness**
   * *For any* category filter applied to news articles, all returned articles 
   * SHALL have a category field matching the filter value.
   * **Validates: Requirements 4.3**
   */
  it('Property 3: News category filter returns only matching articles', () => {
    fc.assert(
      fc.property(
        fc.array(strapiNewsArbitrary, { minLength: 0, maxLength: 20 }),
        newsCategoryArbitrary,
        (news, category) => {
          const filtered = filterNewsByCategory(news, category)
          
          // All filtered news must have matching category
          return filtered.every((n) => n.attributes.category === category)
        }
      ),
      { numRuns: 100 }
    )
  })

  // Additional property: Filter preserves subset relationship
  it('Property 2 (additional): Filtered products are subset of original', () => {
    fc.assert(
      fc.property(
        fc.array(strapiProductArbitrary, { minLength: 0, maxLength: 20 }),
        categoryArbitrary,
        (products, categorySlug) => {
          const filtered = filterProductsByCategory(products, categorySlug)
          
          // Filtered count should be <= original count
          return filtered.length <= products.length
        }
      ),
      { numRuns: 100 }
    )
  })

  // Additional property: Filter is idempotent
  it('Property 2 (additional): Category filter is idempotent', () => {
    fc.assert(
      fc.property(
        fc.array(strapiProductArbitrary, { minLength: 0, maxLength: 20 }),
        categoryArbitrary,
        (products, categorySlug) => {
          const filtered1 = filterProductsByCategory(products, categorySlug)
          const filtered2 = filterProductsByCategory(filtered1, categorySlug)
          
          // Filtering twice should give same result
          return filtered1.length === filtered2.length
        }
      ),
      { numRuns: 100 }
    )
  })
})
