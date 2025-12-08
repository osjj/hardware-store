'use client'

import Link from 'next/link'
import { useCartItemCount } from '@/stores/cart'
import { useIsAuthenticated } from '@/stores/auth'
import MobileNav from './MobileNav'

export default function Header() {
  const cartCount = useCartItemCount()
  const isAuthenticated = useIsAuthenticated()

  return (
    <header className="bg-primary text-white shadow-md relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          测试1测试2
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-secondary">首页</Link>
          <Link href="/products" className="hover:text-secondary">产品中心</Link>
          <Link href="/news" className="hover:text-secondary">新闻资讯</Link>
          <Link href="/about" className="hover:text-secondary">关于我们</Link>
          <Link href="/contact" className="hover:text-secondary">联系我们</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="hover:text-secondary relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link href="/account" className="hover:text-secondary">我的账户</Link>
          ) : (
            <Link href="/account/login" className="hover:text-secondary">登录</Link>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
