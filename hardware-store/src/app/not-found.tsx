import Link from 'next/link'
import { Button } from '@/components/common'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <span className="text-8xl block mb-8">🔍</span>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-8">页面未找到</h2>
        <p className="text-gray-500 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">浏览产品</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
