import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (REVALIDATE_SECRET && token !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    
    // Strapi webhook payload structure
    const { model, entry } = body
    
    // Revalidate based on content type
    switch (model) {
      case 'banner':
        revalidatePath('/')
        break
      case 'product':
        revalidatePath('/')
        revalidatePath('/products')
        if (entry?.slug) {
          revalidatePath(`/products/${entry.slug}`)
        }
        break
      case 'category':
        revalidatePath('/')
        revalidatePath('/products')
        break
      case 'news':
        revalidatePath('/news')
        if (entry?.slug) {
          revalidatePath(`/news/${entry.slug}`)
        }
        break
      case 'page':
        if (entry?.slug) {
          revalidatePath(`/${entry.slug}`)
        }
        break
      default:
        // Revalidate all pages for unknown content types
        revalidatePath('/')
        revalidatePath('/products')
        revalidatePath('/news')
        revalidatePath('/about')
    }

    return NextResponse.json({ 
      revalidated: true, 
      model,
      timestamp: Date.now() 
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}

// Also support GET for manual revalidation
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const path = searchParams.get('path')

  if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, path })
  }

  // Revalidate all main paths
  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/news')
  revalidatePath('/about')

  return NextResponse.json({ 
    revalidated: true, 
    paths: ['/', '/products', '/news', '/about'] 
  })
}
