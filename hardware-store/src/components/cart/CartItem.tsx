'use client'

import Image from 'next/image'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/utils'
import type { CartItemData } from '@/types'

interface CartItemProps {
  item: CartItemData
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCartStore()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(item.id, newQuantity)
  }

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.productName} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 truncate">{item.productName}</h3>
        {item.variantTitle && (
          <p className="text-sm text-gray-500">{item.variantTitle}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">{formatPrice(item.unitPrice)}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isLoading || item.quantity <= 1}
          className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isLoading}
          className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right w-24">
        <p className="font-medium text-secondary">{formatPrice(item.subtotal)}</p>
        <button
          onClick={() => removeItem(item.id)}
          disabled={isLoading}
          className="text-sm text-gray-400 hover:text-red-500 mt-1"
        >
          删除
        </button>
      </div>
    </div>
  )
}
