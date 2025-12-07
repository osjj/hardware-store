'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/common'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ submit: data.error || '提交失败' })
        }
        return
      }

      setIsSuccess(true)
      setFormData({ name: '', phone: '', email: '', company: '', message: '' })
    } catch {
      setErrors({ submit: '网络错误，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">联系我们</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-6">联系方式</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">📞</span>
              <div>
                <h3 className="font-medium">电话</h3>
                <p className="text-gray-600">400-XXX-XXXX</p>
                <p className="text-gray-600">工作时间：周一至周六 9:00-18:00</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">📧</span>
              <div>
                <h3 className="font-medium">邮箱</h3>
                <p className="text-gray-600">contact@example.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">📍</span>
              <div>
                <h3 className="font-medium">地址</h3>
                <p className="text-gray-600">XX省XX市XX区XX路XX号</p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">地图位置</span>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-semibold mb-6">在线留言</h2>
          
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <span className="text-4xl block mb-4">✅</span>
              <h3 className="font-semibold text-green-800 mb-2">提交成功！</h3>
              <p className="text-green-600">我们会尽快与您联系</p>
              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                className="mt-4"
              >
                继续留言
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                name="name"
                label="姓名 *"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="请输入您的姓名"
              />
              
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="电话 *"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="请输入您的手机号"
              />
              
              <Input
                id="email"
                name="email"
                type="email"
                label="邮箱"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="请输入您的邮箱（选填）"
              />
              
              <Input
                id="company"
                name="company"
                label="公司"
                value={formData.company}
                onChange={handleChange}
                placeholder="请输入您的公司名称（选填）"
              />
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  留言内容 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入您的留言内容"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm">{errors.submit}</p>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full">
                提交留言
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
