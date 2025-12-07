'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { getOrders } from '@/services/medusa'
import { formatPrice } from '@/lib/utils'
import { Loading } from '@/components/common'
import type { MedusaOrder } from '@/types'

const statusLabels: Record<string, string> = {
  pending: '待处理',
  completed: '已完成',
  archived: '已归档',
  canceled: '已取消',
  requires_action: '需处理',
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore()
  const [orders, setOrders] = useState<MedusaOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account/login')
      return
    }

    if (isAuthenticated) {
      getOrders()
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setIsLoading(false))
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="加载订单..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的订单</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">暂无订单</p>
          <Link href="/products" className="text-primary hover:underline">
            去选购商品 →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm text-gray-500">订单号：</span>
                  <span className="font-medium">#{order.display_id}</span>
                </div>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('zh-CN')}
                </span>
                <span className="font-semibold text-secondary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
