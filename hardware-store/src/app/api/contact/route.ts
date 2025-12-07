import { NextRequest, NextResponse } from 'next/server'
import { submitContact } from '@/services/strapi'
import type { ContactFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validation
    const errors: Record<string, string> = {}
    
    if (!body.name || body.name.trim().length === 0) {
      errors.name = '请输入姓名'
    }
    
    if (!body.phone || body.phone.trim().length === 0) {
      errors.phone = '请输入电话'
    } else if (!/^1[3-9]\d{9}$/.test(body.phone)) {
      errors.phone = '请输入有效的手机号'
    }
    
    if (!body.message || body.message.trim().length === 0) {
      errors.message = '请输入留言内容'
    }
    
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.email = '请输入有效的邮箱地址'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // Submit to Strapi
    await submitContact({
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || '',
      company: body.company?.trim(),
      message: body.message.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    )
  }
}
