'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white"
        aria-label="Toggle menu"
      >
        ☰
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-primary shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            <Link href="/" onClick={() => setIsOpen(false)}>首页</Link>
            <Link href="/products" onClick={() => setIsOpen(false)}>产品中心</Link>
            <Link href="/news" onClick={() => setIsOpen(false)}>新闻资讯</Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>关于我们</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>联系我们</Link>
          </nav>
        </div>
      )}
    </div>
  )
}
