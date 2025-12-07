import Image from 'next/image'
import Link from 'next/link'
import type { StrapiNews } from '@/types'
import { truncateText } from '@/lib/utils'

interface NewsCardProps {
  news: StrapiNews
}

const categoryLabels: Record<string, string> = {
  company: '公司动态',
  industry: '行业资讯',
  product: '产品知识',
}

export default function NewsCard({ news }: NewsCardProps) {
  const { title, slug, content, cover, publishDate, category } = news.attributes
  const coverUrl = cover?.data?.attributes.url
  const summary = truncateText(content.replace(/<[^>]*>/g, ''), 100)

  return (
    <Link
      href={`/news/${slug}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="relative h-48 bg-gray-100">
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {categoryLabels[category] || category}
          </span>
          <span className="text-xs text-gray-400">{publishDate}</span>
        </div>
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{summary}</p>
      </div>
    </Link>
  )
}
