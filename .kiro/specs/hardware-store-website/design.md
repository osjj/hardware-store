# Design Document

## Overview

五金劳保展示官网采用 **Next.js 14** 作为前端框架，整合 **Strapi CMS** 和 **Medusa** 两套后端系统。Strapi 负责内容管理（Banner、新闻、产品描述），Medusa 负责电商交易（价格、库存、购物车、订单）。

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Next.js 前端应用                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Pages     │  │ Components  │  │   API Routes        │  │
│  │  /          │  │  Header     │  │  /api/contact       │  │
│  │  /products  │  │  Footer     │  │  /api/revalidate    │  │
│  │  /about     │  │  ProductCard│  │                     │  │
│  │  /news      │  │  Cart       │  │                     │  │
│  │  /contact   │  │  ...        │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    Services Layer                    │    │
│  │  ┌─────────────────┐    ┌─────────────────────┐     │    │
│  │  │  StrapiService  │    │   MedusaService     │     │    │
│  │  │  - getBanners() │    │  - getProducts()    │     │    │
│  │  │  - getNews()    │    │  - getCart()        │     │    │
│  │  │  - getPages()   │    │  - addToCart()      │     │    │
│  │  │  - getProducts()│    │  - checkout()       │     │    │
│  │  └────────┬────────┘    └──────────┬──────────┘     │    │
│  └───────────┼────────────────────────┼────────────────┘    │
└──────────────┼────────────────────────┼─────────────────────┘
               │                        │
               ▼                        ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│      Strapi CMS          │  │        Medusa                │
│  admin.bunnybot.top/api  │  │    api.bunnybot.top          │
│                          │  │                              │
│  Collections:            │  │  Endpoints:                  │
│  - banners               │  │  - /store/products           │
│  - products (content)    │  │  - /store/carts              │
│  - categories            │  │  - /store/customers          │
│  - news                  │  │  - /store/orders             │
│  - pages                 │  │  - /store/regions            │
│  - contacts              │  │                              │
└──────────────────────────┘  └──────────────────────────────┘
```

## Architecture

### 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | Next.js 14 (App Router) | SSR/SSG 支持，SEO 友好 |
| UI 框架 | Tailwind CSS | 快速开发响应式界面 |
| 状态管理 | Zustand | 轻量级，管理购物车等客户端状态 |
| 数据获取 | Server Components + SWR | 服务端渲染 + 客户端缓存 |
| CMS | Strapi | 内容管理 |
| 电商 | Medusa | 交易处理 |
| 部署 | Vercel / Docker | 支持 ISR 增量静态再生成 |

### 数据流设计

**内容数据流（Strapi）**
```
Strapi Admin → Strapi API → Next.js Server Components → 页面渲染
                    ↓
              Webhook → /api/revalidate → ISR 更新缓存
```

**交易数据流（Medusa）**
```
用户操作 → Client Component → MedusaService → Medusa API
                                    ↓
                              更新 Zustand Store → UI 更新
```

## Components and Interfaces

### 页面组件结构

```
src/
├── app/
│   ├── layout.tsx              # 根布局（Header, Footer）
│   ├── page.tsx                # 首页
│   ├── products/
│   │   ├── page.tsx            # 产品列表
│   │   └── [slug]/page.tsx     # 产品详情
│   ├── about/page.tsx          # 关于我们
│   ├── news/
│   │   ├── page.tsx            # 新闻列表
│   │   └── [slug]/page.tsx     # 新闻详情
│   ├── contact/page.tsx        # 联系我们
│   ├── cart/page.tsx           # 购物车
│   ├── account/
│   │   ├── page.tsx            # 账户首页
│   │   ├── orders/page.tsx     # 订单列表
│   │   └── login/page.tsx      # 登录
│   └── api/
│       ├── contact/route.ts    # 联系表单提交
│       └── revalidate/route.ts # ISR 重新验证
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── home/
│   │   ├── Banner.tsx
│   │   ├── CategoryGrid.tsx
│   │   └── Highlights.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   └── AddToCartButton.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartIcon.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Loading.tsx
├── services/
│   ├── strapi.ts               # Strapi API 封装
│   └── medusa.ts               # Medusa API 封装
├── stores/
│   └── cart.ts                 # Zustand 购物车状态
├── types/
│   ├── strapi.ts               # Strapi 数据类型
│   └── medusa.ts               # Medusa 数据类型
└── lib/
    └── utils.ts                # 工具函数
```

### 核心接口定义

```typescript
// types/strapi.ts
interface StrapiProduct {
  id: number
  attributes: {
    name: string
    slug: string
    description: string
    images: StrapiMedia[]
    category: StrapiCategory
    medusa_product_id: string  // 关联 Medusa 商品
    specs: string
    seo_title: string
    seo_description: string
  }
}

interface StrapiBanner {
  id: number
  attributes: {
    title: string
    image: StrapiMedia
    link: string
    sort: number
  }
}

interface StrapiNews {
  id: number
  attributes: {
    title: string
    slug: string
    content: string
    cover: StrapiMedia
    publishDate: string
    category: 'company' | 'industry' | 'product'
  }
}

// types/medusa.ts
interface MedusaProduct {
  id: string
  title: string
  handle: string
  variants: MedusaVariant[]
  images: MedusaImage[]
}

interface MedusaVariant {
  id: string
  title: string
  prices: MedusaPrice[]
  inventory_quantity: number
}

interface CartItem {
  id: string
  variant_id: string
  quantity: number
  unit_price: number
  title: string
  thumbnail: string
}
```

### Service 接口

```typescript
// services/strapi.ts
class StrapiService {
  async getBanners(): Promise<StrapiBanner[]>
  async getProducts(params?: ProductQueryParams): Promise<StrapiProduct[]>
  async getProductBySlug(slug: string): Promise<StrapiProduct>
  async getCategories(): Promise<StrapiCategory[]>
  async getNews(params?: NewsQueryParams): Promise<StrapiNews[]>
  async getNewsBySlug(slug: string): Promise<StrapiNews>
  async getPage(slug: string): Promise<StrapiPage>
  async submitContact(data: ContactForm): Promise<void>
}

// services/medusa.ts
class MedusaService {
  async getProducts(): Promise<MedusaProduct[]>
  async getProductById(id: string): Promise<MedusaProduct>
  async createCart(): Promise<Cart>
  async getCart(cartId: string): Promise<Cart>
  async addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart>
  async updateCartItem(cartId: string, itemId: string, quantity: number): Promise<Cart>
  async removeFromCart(cartId: string, itemId: string): Promise<Cart>
  async login(email: string, password: string): Promise<Customer>
  async getOrders(customerId: string): Promise<Order[]>
}
```

## Data Models

### Strapi Collections 设计

**products**
| 字段 | 类型 | 说明 |
|------|------|------|
| name | Text | 产品名称 |
| slug | UID | URL 标识 |
| description | Rich Text | 产品描述 |
| images | Media (multiple) | 产品图片 |
| category | Relation | 关联分类 |
| medusa_product_id | Text | Medusa 商品 ID |
| specs | JSON | 规格参数 |
| seo_title | Text | SEO 标题 |
| seo_description | Text | SEO 描述 |
| featured | Boolean | 是否推荐 |

**categories**
| 字段 | 类型 | 说明 |
|------|------|------|
| name | Text | 分类名称 |
| slug | UID | URL 标识 |
| icon | Media | 分类图标 |
| parent | Relation (self) | 父分类 |
| sort | Number | 排序 |

**banners**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | Text | 标题 |
| image | Media | Banner 图片 |
| link | Text | 跳转链接 |
| sort | Number | 排序 |
| active | Boolean | 是否启用 |

**news**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | Text | 标题 |
| slug | UID | URL 标识 |
| content | Rich Text | 内容 |
| cover | Media | 封面图 |
| publishDate | Date | 发布日期 |
| category | Enum | 分类（company/industry/product） |

**pages**
| 字段 | 类型 | 说明 |
|------|------|------|
| title | Text | 页面标题 |
| slug | UID | URL 标识 |
| content | Rich Text | 页面内容 |
| seo_title | Text | SEO 标题 |
| seo_description | Text | SEO 描述 |

**contacts**
| 字段 | 类型 | 说明 |
|------|------|------|
| name | Text | 姓名 |
| phone | Text | 电话 |
| email | Email | 邮箱 |
| company | Text | 公司 |
| message | Text | 留言内容 |
| read | Boolean | 是否已读 |

### 用户数据归属

| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| 用户注册/登录 | **Medusa** | 电商用户体系，支持订单、购物车关联 |
| 用户基本信息 | **Medusa** | email, password, name, phone |
| 收货地址 | **Medusa** | 支持多地址管理 |
| 订单数据 | **Medusa** | 订单、支付、物流 |
| 购物车 | **Medusa** | 服务端购物车，支持跨设备同步 |
| 网站内容 | **Strapi** | Banner、新闻、产品描述等 |
| 联系留言 | **Strapi** | 访客咨询，无需登录 |

**用户认证流程：**
```
用户注册/登录 → Medusa /store/customers API
                    ↓
              返回 JWT Token
                    ↓
              存储到 Cookie/LocalStorage
                    ↓
              后续请求携带 Token → Medusa 验证
```

**Medusa 用户相关 API：**
- `POST /store/customers` - 用户注册
- `POST /store/auth` - 用户登录
- `GET /store/auth` - 获取当前用户
- `POST /store/customers/me/addresses` - 添加收货地址
- `GET /store/customers/me/orders` - 获取订单历史

### 产品数据整合策略

```typescript
// 整合 Strapi 内容 + Medusa 交易数据
interface CombinedProduct {
  // From Strapi
  name: string
  slug: string
  description: string
  images: string[]
  category: Category
  specs: Record<string, string>
  
  // From Medusa
  medusaId: string
  price: number
  comparePrice?: number
  inStock: boolean
  stockQuantity: number
  variants: Variant[]
}

async function getCombinedProduct(slug: string): Promise<CombinedProduct> {
  const strapiProduct = await strapi.getProductBySlug(slug)
  const medusaProduct = await medusa.getProductById(
    strapiProduct.attributes.medusa_product_id
  )
  
  return {
    name: strapiProduct.attributes.name,
    slug: strapiProduct.attributes.slug,
    description: strapiProduct.attributes.description,
    images: strapiProduct.attributes.images.map(img => img.url),
    category: strapiProduct.attributes.category,
    specs: strapiProduct.attributes.specs,
    medusaId: medusaProduct.id,
    price: medusaProduct.variants[0].prices[0].amount,
    inStock: medusaProduct.variants[0].inventory_quantity > 0,
    stockQuantity: medusaProduct.variants[0].inventory_quantity,
    variants: medusaProduct.variants,
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Product data integration completeness
*For any* product fetched from the system, the combined data SHALL contain name, images, description (from Strapi) AND price, stock quantity (from Medusa) when both APIs are available.
**Validates: Requirements 2.1, 2.4**

### Property 2: Category filter correctness
*For any* category filter applied to products, all returned products SHALL have a category field matching the filter value.
**Validates: Requirements 2.2**

### Property 3: News category filter correctness
*For any* category filter applied to news articles, all returned articles SHALL have a category field matching the filter value.
**Validates: Requirements 4.3**

### Property 4: News article rendering completeness
*For any* news article, the rendered list item SHALL contain title, publishDate, and summary (first N characters of content).
**Validates: Requirements 4.1**

### Property 5: Cart item addition consistency
*For any* add-to-cart operation with quantity N, the cart item count SHALL increase by N, and the cart total SHALL equal the sum of (item price × quantity) for all items.
**Validates: Requirements 5.1, 5.3**

### Property 6: Cart display consistency
*For any* cart state, the displayed items SHALL match the Medusa cart data exactly (same items, quantities, and calculated subtotals).
**Validates: Requirements 5.2**

### Property 7: Out of stock state correctness
*For any* product variant with inventory_quantity = 0, the system SHALL return inStock = false and the UI SHALL disable purchase actions.
**Validates: Requirements 5.5**

### Property 8: Order history consistency
*For any* authenticated user, the displayed order list SHALL match the orders returned from Medusa API for that customer.
**Validates: Requirements 6.2**

### Property 9: Order detail completeness
*For any* order, the detail view SHALL contain order items, order status, and tracking information (if available).
**Validates: Requirements 6.3**

### Property 10: Contact form validation
*For any* contact form submission with missing required fields (name, phone, message), the system SHALL reject the submission and return validation errors without saving to Strapi.
**Validates: Requirements 7.3**

### Property 11: Contact form round-trip
*For any* valid contact form submission, the data saved to Strapi SHALL match the submitted form data exactly.
**Validates: Requirements 7.2**

## Error Handling

### API 错误处理策略

| 场景 | 处理方式 |
|------|---------|
| Strapi API 超时 | 显示缓存内容，后台重试 |
| Medusa API 超时 | 显示"价格加载中"，客户端重试 |
| Strapi 返回 404 | 显示 404 页面 |
| Medusa 商品不存在 | 隐藏价格，显示"暂无报价" |
| 购物车操作失败 | Toast 提示错误，保留本地状态 |
| 登录失败 | 显示错误信息，允许重试 |
| 表单提交失败 | 显示错误，保留用户输入 |

### 错误边界设计

```typescript
// 页面级错误边界
// app/products/error.tsx
export default function ProductsError({ error, reset }) {
  return (
    <div className="error-container">
      <h2>产品加载失败</h2>
      <p>{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )
}

// 组件级错误处理
function ProductPrice({ medusaId }: { medusaId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/medusa/products/${medusaId}`,
    fetcher
  )
  
  if (isLoading) return <PriceSkeleton />
  if (error) return <span className="text-gray-400">暂无报价</span>
  return <span className="text-xl font-bold">¥{data.price}</span>
}
```

## Testing Strategy

### 测试框架选型

| 类型 | 工具 | 用途 |
|------|------|------|
| 单元测试 | Vitest | 服务层、工具函数测试 |
| 属性测试 | fast-check | 验证正确性属性 |
| 组件测试 | React Testing Library | UI 组件测试 |
| E2E 测试 | Playwright | 端到端流程测试 |

### 单元测试覆盖

- **Services**: Strapi/Medusa API 封装函数
- **Utils**: 数据转换、格式化函数
- **Stores**: Zustand 状态管理逻辑

### 属性测试策略

使用 **fast-check** 库进行属性测试，每个属性测试运行至少 100 次迭代。

```typescript
// 示例：Property 2 - Category filter correctness
import fc from 'fast-check'

// **Feature: hardware-store-website, Property 2: Category filter correctness**
test('category filter returns only matching products', () => {
  fc.assert(
    fc.property(
      fc.array(productArbitrary),  // 随机产品列表
      fc.string(),                  // 随机分类
      (products, category) => {
        const filtered = filterByCategory(products, category)
        return filtered.every(p => p.category === category)
      }
    ),
    { numRuns: 100 }
  )
})
```

### 测试数据生成器

```typescript
// 产品数据生成器
const productArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  category: fc.constantFrom('劳保用品', '五金工具', '安全设备'),
  medusaId: fc.uuid(),
  price: fc.integer({ min: 100, max: 100000 }),
  stock: fc.integer({ min: 0, max: 1000 }),
})

// 购物车项生成器
const cartItemArbitrary = fc.record({
  variantId: fc.uuid(),
  quantity: fc.integer({ min: 1, max: 99 }),
  unitPrice: fc.integer({ min: 100, max: 100000 }),
})

// 联系表单生成器
const contactFormArbitrary = fc.record({
  name: fc.string({ minLength: 0, maxLength: 50 }),
  phone: fc.string({ minLength: 0, maxLength: 20 }),
  email: fc.emailAddress(),
  message: fc.string({ minLength: 0, maxLength: 500 }),
})
```

### 集成测试

- 测试 Strapi + Medusa 数据整合逻辑
- 测试购物车完整流程
- 测试用户认证流程

### E2E 测试场景

1. 首页加载并显示 Banner
2. 产品列表筛选和分页
3. 产品详情页加载
4. 添加商品到购物车
5. 完成结账流程
6. 用户登录和订单查看
