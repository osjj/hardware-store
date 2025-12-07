import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getNewsBySlug } from '@/services/strapi'

export const revalidate = 300

const categoryLabels: Record<string, string> = {
  company: '公司动态',
  industry: '行业资讯',
  product: '产品知识',
}

interface NewsDetailPageProps {
  params: { slug: string }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const news = await getNewsBySlug(params.slug)
  
  if (!news) {
    notFound()
  }

  const { title, content, cover, publishDate, category } = news.attributes
  const coverUrl = cover?.data?.attributes.url

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/news" className="hover:text-primary">新闻资讯</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded">
              {categoryLabels[category] || category}
            </span>
            <span className="text-sm text-gray-400">{publishDate}</span>
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </header>

        {/* Cover Image */}
        {coverUrl && (
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <article 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Back Link */}
        <div className="mt-12 pt-6 border-t">
          <Link href="/news" className="text-primary hover:underline">
            ← 返回新闻列表
          </Link>
        </div>
      </div>
    </div>
  )
}
