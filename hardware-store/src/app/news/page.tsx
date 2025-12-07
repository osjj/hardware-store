import { Suspense } from 'react'
import { getNews } from '@/services/strapi'
import { NewsList, NewsFilter } from '@/components/news'
import { Loading } from '@/components/common'
import type { NewsCategory } from '@/types'

export const revalidate = 300

interface NewsPageProps {
  searchParams: { category?: NewsCategory; page?: string }
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const category = searchParams.category

  const { news, pagination } = await getNews({ category, page, pageSize: 9 })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新闻资讯</h1>
      
      <Suspense fallback={<Loading text="加载中..." />}>
        <NewsFilter />
      </Suspense>
      
      <NewsList news={news} />
      
      {/* Pagination */}
      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/news?${new URLSearchParams({
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
