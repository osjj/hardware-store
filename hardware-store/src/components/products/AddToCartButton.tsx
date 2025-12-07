'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cart'
import { Button } from '@/components/common'

interface AddToCartButtonProps {
  variantId: string
  inStock: boolean
  className?: string
}

export default function AddToCartButton({ variantId, inStock, className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, isLoading } = useCartStore()
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    await addItem(variantId, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!inStock) {
    return (
      <Button disabled className={className}>
        暂时缺货
      </Button>
    )
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center border rounded-md">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 hover:bg-gray-100"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-2 border-x">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2 hover:bg-gray-100"
        >
          +
        </button>
      </div>
      <Button
        onClick={handleAddToCart}
        isLoading={isLoading}
        variant={added ? 'secondary' : 'primary'}
        className="flex-1"
      >
        {added ? '已加入购物车 ✓' : '加入购物车'}
      </Button>
    </div>
  )
}
