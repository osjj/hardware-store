'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { Button, Loading } from '@/components/common'

export default function AccountPage() {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/account/login')
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading || !customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading text="加载中..." />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">我的账户</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="font-semibold">
                {customer.last_name}{customer.first_name}
              </h2>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              退出登录
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/account/orders"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">📦</span>
              <h3 className="font-semibold">我的订单</h3>
              <p className="text-sm text-gray-500">查看订单历史和物流状态</p>
            </Link>
            
            <Link
              href="/cart"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">🛒</span>
              <h3 className="font-semibold">购物车</h3>
              <p className="text-sm text-gray-500">查看购物车中的商品</p>
            </Link>
            
            <Link
              href="/products"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">🔍</span>
              <h3 className="font-semibold">浏览商品</h3>
              <p className="text-sm text-gray-500">发现更多优质产品</p>
            </Link>
            
            <Link
              href="/contact"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-2 block">💬</span>
              <h3 className="font-semibold">联系客服</h3>
              <p className="text-sm text-gray-500">有问题？联系我们</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
