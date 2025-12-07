'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { Button, Input } from '@/components/common'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  })
  const [formError, setFormError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setFormError('')
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('两次输入的密码不一致')
      return
    }
    
    if (formData.password.length < 6) {
      setFormError('密码长度至少6位')
      return
    }
    
    const success = await register({
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
    })
    
    if (success) {
      router.push('/account')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">注册</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="last_name"
              name="last_name"
              label="姓"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="姓"
            />
            <Input
              id="first_name"
              name="first_name"
              label="名"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="名"
            />
          </div>
          
          <Input
            id="email"
            name="email"
            type="email"
            label="邮箱"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="请输入邮箱"
          />
          
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="手机号（选填）"
            value={formData.phone}
            onChange={handleChange}
            placeholder="请输入手机号"
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            label="密码"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="至少6位"
          />
          
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="确认密码"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="再次输入密码"
          />
          
          {(error || formError) && (
            <p className="text-red-500 text-sm">{error || formError}</p>
          )}
          
          <Button type="submit" isLoading={isLoading} className="w-full">
            注册
          </Button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          已有账户？
          <Link href="/account/login" className="text-primary hover:underline ml-1">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
