# Requirements Document

## Introduction

本项目是一个五金劳保展示官网，整合 Strapi CMS（内容管理）和 Medusa（电商交易）两套后端系统。网站面向企业客户和个人用户，提供五金工具、劳保用品的产品展示、品牌宣传和在线购买功能。

## Glossary

- **System**: 五金劳保展示官网前端应用
- **Strapi**: 内容管理系统，地址 https://admin.bunnybot.top/api/，负责管理网站内容（Banner、新闻、产品描述等）
- **Medusa**: 电商后端系统，地址 https://api.bunnybot.top/，负责商品交易（价格、库存、购物车、订单）
- **Product**: 产品，包含展示信息（来自 Strapi）和交易信息（来自 Medusa）
- **Category**: 产品分类，如劳保用品、五金工具等
- **Cart**: 购物车，存储用户待购买的商品
- **User**: 网站访客或注册用户

## Requirements

### Requirement 1

**User Story:** As a 网站访客, I want to 浏览首页内容, so that 我能快速了解公司和主要产品。

#### Acceptance Criteria

1. WHEN a user visits the homepage THEN the System SHALL display banner images fetched from Strapi within 2 seconds
2. WHEN the homepage loads THEN the System SHALL display featured product categories with images and names
3. WHEN the homepage loads THEN the System SHALL display company highlights section with at least 3 advantage items
4. WHEN a user clicks a banner link THEN the System SHALL navigate to the corresponding target page

### Requirement 2

**User Story:** As a 网站访客, I want to 浏览产品列表和详情, so that 我能了解产品信息并决定是否购买。

#### Acceptance Criteria

1. WHEN a user visits the products page THEN the System SHALL display products with images, names, and prices from both Strapi and Medusa
2. WHEN a user selects a category filter THEN the System SHALL display only products belonging to that category
3. WHEN a user clicks a product card THEN the System SHALL navigate to the product detail page
4. WHEN the product detail page loads THEN the System SHALL display product description from Strapi and real-time price and stock from Medusa
5. WHILE Medusa API is unavailable THEN the System SHALL display cached price data with a staleness indicator

### Requirement 3

**User Story:** As a 网站访客, I want to 了解公司信息, so that 我能判断公司的可信度和专业性。

#### Acceptance Criteria

1. WHEN a user visits the about page THEN the System SHALL display company introduction content from Strapi
2. WHEN the about page loads THEN the System SHALL display company history timeline if available
3. WHEN the about page loads THEN the System SHALL display certification images in a gallery format

### Requirement 4

**User Story:** As a 网站访客, I want to 阅读新闻资讯, so that 我能了解行业动态和公司最新消息。

#### Acceptance Criteria

1. WHEN a user visits the news page THEN the System SHALL display news articles list with title, date, and summary
2. WHEN a user clicks a news article THEN the System SHALL navigate to the full article page
3. WHEN a user selects a news category filter THEN the System SHALL display only articles of that category

### Requirement 5

**User Story:** As a 注册用户, I want to 将产品加入购物车并下单, so that 我能完成购买流程。

#### Acceptance Criteria

1. WHEN a user clicks add to cart button THEN the System SHALL add the product to Medusa cart and update cart icon count
2. WHEN a user views the cart page THEN the System SHALL display all cart items with quantities and subtotals from Medusa
3. WHEN a user modifies cart item quantity THEN the System SHALL update the quantity in Medusa and recalculate totals
4. WHEN a user proceeds to checkout THEN the System SHALL redirect to Medusa checkout flow
5. IF a product is out of stock THEN the System SHALL disable the add to cart button and display out of stock message

### Requirement 6

**User Story:** As a 注册用户, I want to 管理我的账户, so that 我能查看订单历史和管理个人信息。

#### Acceptance Criteria

1. WHEN a user logs in with valid credentials THEN the System SHALL authenticate via Medusa and store session token
2. WHEN a user visits the account page THEN the System SHALL display order history from Medusa
3. WHEN a user clicks an order THEN the System SHALL display order details including items, status, and tracking info
4. IF login credentials are invalid THEN the System SHALL display an error message and allow retry

### Requirement 7

**User Story:** As a 网站访客, I want to 联系公司, so that 我能咨询产品或提交合作意向。

#### Acceptance Criteria

1. WHEN a user visits the contact page THEN the System SHALL display company contact information from Strapi
2. WHEN a user submits the contact form with valid data THEN the System SHALL save the message to Strapi and display success confirmation
3. IF a user submits the contact form with invalid data THEN the System SHALL display validation errors without submitting

### Requirement 8

**User Story:** As a 网站管理员, I want to 通过 CMS 管理网站内容, so that 我能灵活更新网站信息而无需修改代码。

#### Acceptance Criteria

1. WHEN an admin updates content in Strapi THEN the System SHALL reflect changes on the website within 5 minutes
2. WHEN an admin adds a new product in Strapi with medusa_product_id THEN the System SHALL display the product with Medusa pricing
3. WHEN an admin publishes a news article THEN the System SHALL display it on the news page automatically

### Requirement 9

**User Story:** As a 网站访客, I want to 在移动设备上正常浏览网站, so that 我能随时随地访问网站。

#### Acceptance Criteria

1. WHEN a user accesses the website on mobile device THEN the System SHALL display responsive layout adapted to screen size
2. WHEN a user navigates on mobile THEN the System SHALL provide a mobile-friendly navigation menu
3. WHEN a user views products on mobile THEN the System SHALL display product cards in single or double column layout
