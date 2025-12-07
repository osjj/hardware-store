'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { StrapiBanner } from '@/types'

interface BannerProps {
  banners: StrapiBanner[]
}

export default function Banner({ banners }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">暂无 Banner</p>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]
  const imageUrl = currentBanner.attributes.image?.data?.attributes.url

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      {imageUrl ? (
        <Link href={currentBanner.attributes.link || '#'}>
          <Image
            src={imageUrl}
            alt={currentBanner.attributes.title}
            fill
            className="object-cover"
            priority
          />
        </Link>
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
          <h2 className="text-white text-2xl md:text-4xl font-bold">
            {currentBanner.attributes.title}
          </h2>
        </div>
      )}
      
      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
