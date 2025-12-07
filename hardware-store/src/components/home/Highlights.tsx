const highlights = [
  {
    icon: '✅',
    title: '品质保障',
    description: '严选优质供应商，所有产品均通过质量检测',
  },
  {
    icon: '🚚',
    title: '快速发货',
    description: '自有仓储，下单后24小时内发货',
  },
  {
    icon: '💰',
    title: '价格实惠',
    description: '厂家直供，省去中间环节，价格更优惠',
  },
  {
    icon: '🛡️',
    title: '售后无忧',
    description: '7天无理由退换，专业客服团队服务',
  },
]

export default function Highlights() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">为什么选择我们</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
