import { getPage } from '@/services/strapi'

export const revalidate = 300

export default async function AboutPage() {
  const page = await getPage('about').catch(() => null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">关于我们</h1>

      {/* Company Introduction */}
      <section className="max-w-3xl mx-auto mb-12">
        {page ? (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.attributes.content }}
          />
        ) : (
          <div className="text-gray-600 space-y-4">
            <p>
              我们是一家专业的五金劳保用品供应商，致力于为企业和个人客户提供优质的五金工具和劳保用品。
            </p>
            <p>
              公司成立以来，始终坚持"品质第一、服务至上"的经营理念，与多家知名品牌建立了长期稳定的合作关系，
              确保为客户提供正品保障的产品。
            </p>
            <p>
              我们拥有完善的仓储物流体系，能够快速响应客户需求，实现高效配送。
              专业的客服团队随时为您解答疑问，提供售前咨询和售后服务。
            </p>
          </div>
        )}
      </section>

      {/* Company History */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">发展历程</h2>
        <div className="max-w-2xl mx-auto">
          <div className="relative border-l-2 border-primary pl-8 space-y-8">
            {[
              { year: '2020', event: '公司成立，开始五金劳保用品批发业务' },
              { year: '2021', event: '建立自有仓储中心，提升配送效率' },
              { year: '2022', event: '与多家知名品牌达成战略合作' },
              { year: '2023', event: '上线电商平台，服务更多客户' },
              { year: '2024', event: '持续扩大产品线，提供一站式采购服务' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-10 w-4 h-4 bg-primary rounded-full" />
                <div className="font-bold text-primary">{item.year}</div>
                <div className="text-gray-600">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-center">资质证书</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {['营业执照', '质量认证', '安全认证', '行业资质'].map((cert, index) => (
            <div
              key={index}
              className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"
            >
              <div className="text-center">
                <span className="text-4xl block mb-2">📜</span>
                <span className="text-sm">{cert}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 -mx-4 px-4 py-12">
        <h2 className="text-xl font-bold mb-8 text-center">企业价值观</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '🎯', title: '使命', desc: '为客户提供优质的五金劳保产品和服务' },
            { icon: '👁️', title: '愿景', desc: '成为行业领先的五金劳保用品供应商' },
            { icon: '💎', title: '价值观', desc: '诚信、专业、创新、共赢' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center">
              <span className="text-4xl block mb-4">{item.icon}</span>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
