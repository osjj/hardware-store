'use client'

import Link from 'next/link'
import { useCartItemCount } from '@/stores/cart'

export default function CartIcon() {
  const itemCount = useCartItemCount()

  return (
    <Link href="/cart" className="relative hover:text-secondary">
      🛒
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
