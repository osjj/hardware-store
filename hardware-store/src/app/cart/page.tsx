'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cart'
import { CartItem, CartSummary } from '@/components/cart'
import { Loading } from '@/components/common'

export default function CartPage() {
  const { items, isLoading, initCart } = useCartStore()

  useEffect(() => {
    initCart()
  }, [initCart])

  if (isLoading && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="加载购物车..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">购物车</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">购物车是空的</p>
          <Link href="/products" className="text-primary hover:underline">
            去选购商品 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  )
}
