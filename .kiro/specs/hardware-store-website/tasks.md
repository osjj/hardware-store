# Implementation Plan

- [x] 1. 项目初始化和基础配置

  - [x] 1.1 创建 Next.js 14 项目结构


    - 初始化 Next.js App Router 项目
    - 配置 TypeScript、Tailwind CSS、ESLint
    - 创建目录结构（components, services, stores, types, lib）
    - _Requirements: 9.1_
  - [x] 1.2 配置环境变量和 API 客户端


    - 创建 .env.local 配置 Strapi 和 Medusa URL
    - 配置 next.config.js 图片域名白名单
    - _Requirements: 2.1, 8.1_

- [x] 2. 类型定义和服务层

  - [x] 2.1 定义 TypeScript 类型


    - 创建 types/strapi.ts（Product, Banner, News, Category, Page, Contact）
    - 创建 types/medusa.ts（Product, Variant, Cart, Customer, Order）
    - 创建 types/combined.ts（CombinedProduct 整合类型）
    - _Requirements: 2.1, 2.4_
  - [x] 2.2 实现 Strapi 服务层


    - 创建 services/strapi.ts
    - 实现 getBanners, getProducts, getProductBySlug, getCategories
    - 实现 getNews, getNewsBySlug, getPage, submitContact
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 7.1, 7.2_

  - [x] 2.3 实现 Medusa 服务层

    - 创建 services/medusa.ts
    - 实现 getProducts, getProductById
    - 实现 createCart, getCart, addToCart, updateCartItem, removeFromCart
    - 实现 login, register, getCustomer, getOrders
    - _Requirements: 2.1, 5.1, 5.2, 6.1, 6.2_
  - [x]* 2.4 编写服务层属性测试


    - **Property 2: Category filter correctness**
    - **Property 3: News category filter correctness**
    - **Validates: Requirements 2.2, 4.3**

- [x] 3. 状态管理

  - [x] 3.1 实现购物车状态管理


    - 创建 stores/cart.ts（Zustand store）
    - 实现 addItem, updateQuantity, removeItem, clearCart
    - 实现购物车持久化（localStorage + Medusa 同步）
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 3.2 实现用户认证状态管理

    - 创建 stores/auth.ts
    - 实现 login, logout, checkAuth
    - 管理用户 session token


    - _Requirements: 6.1_
  - [x]* 3.3 编写购物车属性测试
    - **Property 5: Cart item addition consistency**
    - **Property 6: Cart display consistency**
    - **Validates: Requirements 5.1, 5.2, 5.3**


- [x] 4. 通用组件开发

  - [x] 4.1 实现布局组件

    - 创建 components/layout/Header.tsx（导航、购物车图标、用户菜单）
    - 创建 components/layout/Footer.tsx（联系信息、快速链接）
    - 创建 components/layout/MobileNav.tsx（移动端导航抽屉）
    - _Requirements: 9.1, 9.2_

  - [-] 4.2 实现通用 UI 组件

    - 创建 components/common/Button.tsx
    - 创建 components/common/Input.tsx
    - 创建 components/common/Loading.tsx

    - 创建 components/common/Toast.tsx


    - _Requirements: 7.3_

- [x] 5. 首页开发
  - [x] 5.1 实现首页组件


    - 创建 components/home/Banner.tsx（轮播图）
    - 创建 components/home/CategoryGrid.tsx（分类网格）
    - 创建 components/home/Highlights.tsx（公司优势）

    - 创建 components/home/FeaturedProducts.tsx（推荐产品）


    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 5.2 实现首页页面
    - 创建 app/page.tsx
    - 集成 Banner、CategoryGrid、Highlights、FeaturedProducts


    - 实现 SSG 静态生成
    - _Requirements: 1.1, 1.2, 1.3, 1.4_



- [x] 6. 产品模块开发
  - [x] 6.1 实现产品组件
    - 创建 components/products/ProductCard.tsx
    - 创建 components/products/ProductGrid.tsx
    - 创建 components/products/ProductFilter.tsx（分类筛选）
    - 创建 components/products/AddToCartButton.tsx
    - _Requirements: 2.1, 2.2, 5.1, 5.5_
  - [x] 6.2 实现产品列表页
    - 创建 app/products/page.tsx
    - 实现分类筛选功能

    - 实现 Strapi + Medusa 数据整合


    - _Requirements: 2.1, 2.2_
  - [x] 6.3 实现产品详情页
    - 创建 app/products/[slug]/page.tsx


    - 显示产品描述（Strapi）+ 价格库存（Medusa）
    - 实现加入购物车功能



    - _Requirements: 2.3, 2.4, 2.5, 5.1, 5.5_

  - [x]* 6.4 编写产品数据整合属性测试
    - **Property 1: Product data integration completeness**
    - **Property 7: Out of stock state correctness**
    - **Validates: Requirements 2.1, 2.4, 5.5**




- [x] 7. Checkpoint - 确保所有测试通过

  - Ensure all tests pass, ask the user if questions arise.



- [x] 8. 新闻模块开发
  - [x] 8.1 实现新闻组件
    - 创建 components/news/NewsCard.tsx
    - 创建 components/news/NewsList.tsx

    - 创建 components/news/NewsFilter.tsx
    - _Requirements: 4.1_
  - [x] 8.2 实现新闻列表页
    - 创建 app/news/page.tsx

    - 实现分类筛选

    - _Requirements: 4.1, 4.3_
  - [x] 8.3 实现新闻详情页
    - 创建 app/news/[slug]/page.tsx
    - 显示完整文章内容
    - _Requirements: 4.2_
  - [x]* 8.4 编写新闻渲染属性测试
    - **Property 4: News article rendering completeness**
    - **Validates: Requirements 4.1**

- [x] 9. 购物车模块开发
  - [x] 9.1 实现购物车组件
    - 创建 components/cart/CartItem.tsx
    - 创建 components/cart/CartSummary.tsx
    - 创建 components/cart/CartIcon.tsx（Header 中的购物车图标）
    - _Requirements: 5.2_
  - [x] 9.2 实现购物车页面
    - 创建 app/cart/page.tsx
    - 实现数量修改、删除商品
    - 实现结算跳转
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 10. 用户账户模块开发

  - [x] 10.1 实现登录注册页面

    - 创建 app/account/login/page.tsx
    - 创建 app/account/register/page.tsx
    - 实现 Medusa 认证集成


    - _Requirements: 6.1, 6.4_

  - [x] 10.2 实现账户中心页面

    - 创建 app/account/page.tsx（账户首页）
    - 创建 app/account/orders/page.tsx（订单列表）
    - 创建 app/account/orders/[id]/page.tsx（订单详情）
    - _Requirements: 6.2, 6.3_
  - [x]* 10.3 编写订单显示属性测试
    - **Property 8: Order history consistency**
    - **Property 9: Order detail completeness**
    - **Validates: Requirements 6.2, 6.3**

- [x] 11. 静态页面开发

  - [x] 11.1 实现关于我们页面



    - 创建 app/about/page.tsx
    - 显示公司介绍、历史、资质
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 11.2 实现联系我们页面


    - 创建 app/contact/page.tsx
    - 实现联系表单（带验证）
    - 创建 app/api/contact/route.ts（表单提交 API）
    - _Requirements: 7.1, 7.2, 7.3_
  - [x]* 11.3 编写表单验证属性测试


    - **Property 10: Contact form validation**
    - **Property 11: Contact form round-trip**
    - **Validates: Requirements 7.2, 7.3**

- [x] 12. ISR 和缓存配置


  - [x] 12.1 配置增量静态再生成

    - 创建 app/api/revalidate/route.ts（Webhook 触发重新验证）
    - 配置 Strapi Webhook 调用 revalidate API
    - 设置页面 revalidate 时间
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 13. 错误处理和边界


  - [x] 13.1 实现错误边界

    - 创建 app/error.tsx（全局错误页）
    - 创建 app/not-found.tsx（404 页面）
    - 创建各模块 error.tsx（产品、新闻等）
    - _Requirements: 2.5_



- [x] 14. Final Checkpoint - 确保所有测试通过
  - Ensure all tests pass, ask the user if questions arise.
