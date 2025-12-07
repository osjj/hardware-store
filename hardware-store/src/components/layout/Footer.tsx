import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">关于我们</h3>
            <p className="text-gray-400">专业五金工具与劳保用品供应商，品质保障，快速发货。</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products" className="hover:text-white">产品中心</Link></li>
              <li><Link href="/news" className="hover:text-white">新闻资讯</Link></li>
              <li><Link href="/about" className="hover:text-white">关于我们</Link></li>
              <li><Link href="/contact" className="hover:text-white">联系我们</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">联系方式</h3>
            <ul className="space-y-2 text-gray-400">
              <li>电话：400-XXX-XXXX</li>
              <li>邮箱：contact@example.com</li>
              <li>地址：XX省XX市XX区</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>© 2024 五金劳保. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
