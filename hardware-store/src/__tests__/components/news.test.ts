import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { truncateText } from '@/lib/utils'
import type { StrapiNews, NewsCategory, NewsListItem } from '@/types'

// Helper function to render news list item (extracted for testing)
function renderNewsListItem(news: StrapiNews, summaryLength: number = 100): NewsListItem {
  const { title, slug, content, cover, publishDate, category } = news.attributes
  const coverUrl = cover?.data?.attributes.url || null
  const summary = truncateText(content.replace(/<[^>]*>/g, ''), summaryLength)

  return {
    id: news.id,
    title,
    slug,
    summary,
    coverUrl,
    publishDate,
    category,
  }
}

// Test data generators
const newsCategoryArbitrary = fc.constantFrom('company', 'industry', 'product') as fc.Arbitrary<NewsCategory>

const strapiNewsArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  attributes: fc.record({
    title: fc.string({ minLength: 1, maxLength: 100 }),
    slug: fc.string({ minLength: 1, maxLength: 50 }),
    content: fc.string({ minLength: 0, maxLength: 1000 }),
    cover: fc.oneof(
      fc.constant({ data: null }),
      fc.record({
        data: fc.record({
          id: fc.integer({ min: 1 }),
          attributes: fc.record({
            url: fc.webUrl(),
            width: fc.integer({ min: 100, max: 2000 }),
            height: fc.integer({ min: 100, max: 2000 }),
            alternativeText: fc.option(fc.string(), { nil: null }),
          }),
        }),
      })
    ),
    publishDate: fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') })
      .map((d) => d.toISOString().split('T')[0]),
    category: newsCategoryArbitrary,
  }),
}) as fc.Arbitrary<StrapiNews>

describe('News Rendering - Property Tests', () => {
  /**
   * **Feature: hardware-store-website, Property 4: News article rendering completeness**
   * *For any* news article, the rendered list item SHALL contain title, 
   * publishDate, and summary (first N characters of content).
   * **Validates: Requirements 4.1**
   */
  it('Property 4: Rendered news item contains title', () => {
    fc.assert(
      fc.property(
        strapiNewsArbitrary,
        (news) => {
          const rendered = renderNewsListItem(news)
          
          // Title should be present and match original
          return rendered.title === news.attributes.title && rendered.title.length > 0
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Rendered news item contains publishDate', () => {
    fc.assert(
      fc.property(
        strapiNewsArbitrary,
        (news) => {
          const rendered = renderNewsListItem(news)
          
          // PublishDate should be present and match original
          return rendered.publishDate === news.attributes.publishDate
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Rendered news item contains summary', () => {
    fc.assert(
      fc.property(
        strapiNewsArbitrary,
        fc.integer({ min: 50, max: 200 }),
        (news, summaryLength) => {
          const rendered = renderNewsListItem(news, summaryLength)
          
          // Summary should be present
          const hasSummary = typeof rendered.summary === 'string'
          
          // Summary should be truncated if content is longer
          const plainContent = news.attributes.content.replace(/<[^>]*>/g, '')
          const isTruncated = plainContent.length <= summaryLength 
            ? rendered.summary === plainContent
            : rendered.summary.length <= summaryLength + 3 // +3 for "..."
          
          return hasSummary && isTruncated
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 4: Rendered news item contains category', () => {
    fc.assert(
      fc.property(
        strapiNewsArbitrary,
        (news) => {
          const rendered = renderNewsListItem(news)
          
          // Category should be present and match original
          return rendered.category === news.attributes.category
        }
      ),
      { numRuns: 100 }
    )
  })

  // Additional property: ID is preserved
  it('Property 4 (additional): News ID is preserved', () => {
    fc.assert(
      fc.property(
        strapiNewsArbitrary,
        (news) => {
          const rendered = renderNewsListItem(news)
          
          return rendered.id === news.id
        }
      ),
      { numRuns: 100 }
    )
  })

  // Additional property: Slug is preserved
  it('Property 4 (additional): News slug is preserved', () => {
    fc.assert(
      fc.property(
        strapiNewsArbitrary,
        (news) => {
          const rendered = renderNewsListItem(news)
          
          return rendered.slug === news.attributes.slug
        }
      ),
      { numRuns: 100 }
    )
  })
})
