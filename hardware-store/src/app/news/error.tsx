'use client'

import { Button } from '@/components/common'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function NewsError({ error, reset }: ErrorProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <span className="text-6xl block mb-6">📰</span>
        <h2 className="text-xl font-bold mb-4">新闻加载失败</h2>
        <p className="text-gray-600 mb-6">
          无法加载新闻列表，请检查网络连接后重试。
        </p>
        <Button onClick={reset}>重新加载</Button>
      </div>
    </div>
  )
}
