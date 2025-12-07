'use client'

import { useEffect } from 'react'
import { Button } from '@/components/common'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <span className="text-8xl block mb-8">⚠️</span>
        <h1 className="text-2xl font-bold mb-4">出错了</h1>
        <p className="text-gray-600 mb-8">
          抱歉，页面加载时发生了错误。请稍后重试。
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>重试</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}
