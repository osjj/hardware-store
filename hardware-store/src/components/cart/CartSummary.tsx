'use client'

import Link from 'next/link'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/common'

export default function CartSummary() {
  const { subtotal, total, itemCount } = useCartStore()

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">订单摘要</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">商品数量</span>
          <span>{itemCount} 件</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">商品小计</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">运费</span>
          <span className="text-gray-400">待计算</span>
        </div>
      </div>
      
      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>合计</span>
          <span className="text-secondary">{formatPrice(total)}</span>
        </div>
      </div>
      
      <Link href="/checkout" className="block mt-6">
        <Button variant="secondary" className="w-full" disabled={itemCount === 0}>
          去结算
        </Button>
      </Link>
      
      <Link href="/products" className="block mt-3 text-center text-sm text-primary hover:underline">
        继续购物
      </Link>
    </div>
  )
}
