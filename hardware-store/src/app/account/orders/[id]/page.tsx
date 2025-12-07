'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/stores/auth'
import { getOrderById } from '@/services/medusa'
import { formatPrice } from '@/lib/utils'
import { Loading } from '@/components/common'
import type { MedusaOrder } from '@/types'

const statusLabels: Record<string, string> = {
  pending: '待处理',
  completed: '已完成',
  archived: '已归档',
  canceled: '已取消',
  requires_action: '需处理',
  not_fulfilled: '待发货',
  partially_fulfilled: '部分发货',
  fulfilled: '已发货',
  shipped: '运输中',
  not_paid: '待支付',
  awaiting: '等待中',
  captured: '已支付',
  refunded: '已退款',
}

interface OrderDetailPageProps {
  params: { id: string }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore()
  const [order, setOrder] = useState<MedusaOrder | null>(null)
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
      getOrderById(params.id)
        .then(setOrder)
        .finally(() => setIsLoading(false))
    }
  }, [authLoading, isAuthenticated, router, params.id])

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="加载订单详情..." />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">订单不存在</p>
      </div>
    )
  }

  const trackingNumbers = order.fulfillments?.flatMap((f) => f.tracking_numbers) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/account/orders" className="text-primary hover:underline mb-4 inline-block">
        ← 返回订单列表
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-6 border-b">
          <div>
            <h1 className="text-xl font-bold">订单 #{order.display_id}</h1>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString('zh-CN')}
            </p>
          </div>
          <div className="text-right">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm">
              {statusLabels[order.status] || order.status}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-gray-500">支付状态：</span>
            <span className="ml-2">{statusLabels[order.payment_status] || order.payment_status}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">发货状态：</span>
            <span className="ml-2">{statusLabels[order.fulfillment_status] || order.fulfillment_status}</span>
          </div>
        </div>

        {/* Tracking */}
        {trackingNumbers.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="font-medium mb-2">物流信息</h3>
            {trackingNumbers.map((num, i) => (
              <p key={i} className="text-sm">运单号：{num}</p>
            ))}
          </div>
        )}

        {/* Items */}
        <div className="mb-6">
          <h3 className="font-medium mb-4">商品列表</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">📦</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">商品小计</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">运费</span>
            <span>{formatPrice(order.shipping_total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">税费</span>
            <span>{formatPrice(order.tax_total)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>合计</span>
            <span className="text-secondary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
