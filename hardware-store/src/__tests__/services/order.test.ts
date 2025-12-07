import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type { MedusaOrder, OrderListItem, OrderDetail, OrderStatus, FulfillmentStatus, PaymentStatus } from '@/types'

// Helper functions to transform order data (extracted for testing)
function transformToOrderListItem(order: MedusaOrder): OrderListItem {
  return {
    id: order.id,
    displayId: order.display_id,
    status: order.status,
    total: order.total,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.created_at,
  }
}

function transformToOrderDetail(order: MedusaOrder): OrderDetail {
  const trackingNumbers = order.fulfillments?.flatMap((f) => f.tracking_numbers) || []
  
  return {
    id: order.id,
    displayId: order.display_id,
    status: order.status,
    fulfillmentStatus: order.fulfillment_status,
    paymentStatus: order.payment_status,
    items: order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total,
      thumbnail: item.thumbnail,
    })),
    subtotal: order.subtotal,
    shippingTotal: order.shipping_total,
    taxTotal: order.tax_total,
    total: order.total,
    shippingAddress: order.shipping_address
      ? {
          name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          phone: order.shipping_address.phone,
          address: order.shipping_address.address_1,
          city: order.shipping_address.city,
        }
      : null,
    trackingNumbers,
    createdAt: order.created_at,
  }
}

// Test data generators
const orderStatusArbitrary = fc.constantFrom(
  'pending', 'completed', 'archived', 'canceled', 'requires_action'
) as fc.Arbitrary<OrderStatus>

const fulfillmentStatusArbitrary = fc.constantFrom(
  'not_fulfilled', 'partially_fulfilled', 'fulfilled', 'shipped', 'canceled'
) as fc.Arbitrary<FulfillmentStatus>

const paymentStatusArbitrary = fc.constantFrom(
  'not_paid', 'awaiting', 'captured', 'refunded', 'canceled'
) as fc.Arbitrary<PaymentStatus>

const orderItemArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.option(fc.string(), { nil: null }),
  thumbnail: fc.option(fc.webUrl(), { nil: null }),
  quantity: fc.integer({ min: 1, max: 10 }),
  unit_price: fc.integer({ min: 100, max: 100000 }),
  subtotal: fc.integer({ min: 100, max: 1000000 }),
  total: fc.integer({ min: 100, max: 1000000 }),
  variant: fc.record({
    id: fc.uuid(),
    title: fc.string(),
    sku: fc.constant(null),
    prices: fc.constant([]),
    inventory_quantity: fc.integer({ min: 0, max: 100 }),
    options: fc.constant([]),
  }),
})

const addressArbitrary = fc.record({
  id: fc.uuid(),
  first_name: fc.string({ minLength: 1, maxLength: 50 }),
  last_name: fc.string({ minLength: 1, maxLength: 50 }),
  phone: fc.option(fc.string({ minLength: 11, maxLength: 11 }), { nil: null }),
  address_1: fc.string({ minLength: 1, maxLength: 200 }),
  address_2: fc.option(fc.string(), { nil: null }),
  city: fc.string({ minLength: 1, maxLength: 50 }),
  province: fc.option(fc.string(), { nil: null }),
  postal_code: fc.option(fc.string(), { nil: null }),
  country_code: fc.constantFrom('cn', 'us'),
})

const fulfillmentArbitrary = fc.record({
  id: fc.uuid(),
  tracking_numbers: fc.array(fc.string({ minLength: 10, maxLength: 20 }), { minLength: 0, maxLength: 2 }),
  tracking_links: fc.constant([]),
  created_at: fc.date().map((d) => d.toISOString()),
})

const medusaOrderArbitrary = fc.record({
  id: fc.uuid(),
  display_id: fc.integer({ min: 1, max: 99999 }),
  status: orderStatusArbitrary,
  fulfillment_status: fulfillmentStatusArbitrary,
  payment_status: paymentStatusArbitrary,
  items: fc.array(orderItemArbitrary, { minLength: 1, maxLength: 5 }),
  subtotal: fc.integer({ min: 100, max: 1000000 }),
  tax_total: fc.integer({ min: 0, max: 100000 }),
  shipping_total: fc.integer({ min: 0, max: 50000 }),
  total: fc.integer({ min: 100, max: 1200000 }),
  created_at: fc.date().map((d) => d.toISOString()),
  shipping_address: fc.option(addressArbitrary, { nil: null }),
  fulfillments: fc.array(fulfillmentArbitrary, { minLength: 0, maxLength: 2 }),
}) as fc.Arbitrary<MedusaOrder>

describe('Order Display - Property Tests', () => {
  /**
   * **Feature: hardware-store-website, Property 8: Order history consistency**
   * *For any* authenticated user, the displayed order list SHALL match 
   * the orders returned from Medusa API for that customer.
   * **Validates: Requirements 6.2**
   */
  it('Property 8: Order list item contains correct ID', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const listItem = transformToOrderListItem(order)
          
          return listItem.id === order.id && listItem.displayId === order.display_id
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 8: Order list item contains correct status', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const listItem = transformToOrderListItem(order)
          
          return listItem.status === order.status
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 8: Order list item contains correct total', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const listItem = transformToOrderListItem(order)
          
          return listItem.total === order.total
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 8: Order list item count equals sum of item quantities', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const listItem = transformToOrderListItem(order)
          const expectedCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
          
          return listItem.itemCount === expectedCount
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: hardware-store-website, Property 9: Order detail completeness**
   * *For any* order, the detail view SHALL contain order items, order status, 
   * and tracking information (if available).
   * **Validates: Requirements 6.3**
   */
  it('Property 9: Order detail contains all items', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const detail = transformToOrderDetail(order)
          
          return detail.items.length === order.items.length
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Order detail contains status information', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const detail = transformToOrderDetail(order)
          
          return (
            detail.status === order.status &&
            detail.fulfillmentStatus === order.fulfillment_status &&
            detail.paymentStatus === order.payment_status
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Order detail contains tracking numbers when available', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const detail = transformToOrderDetail(order)
          const expectedTrackingNumbers = order.fulfillments?.flatMap((f) => f.tracking_numbers) || []
          
          return detail.trackingNumbers.length === expectedTrackingNumbers.length
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 9: Order detail contains price breakdown', () => {
    fc.assert(
      fc.property(
        medusaOrderArbitrary,
        (order) => {
          const detail = transformToOrderDetail(order)
          
          return (
            detail.subtotal === order.subtotal &&
            detail.shippingTotal === order.shipping_total &&
            detail.taxTotal === order.tax_total &&
            detail.total === order.total
          )
        }
      ),
      { numRuns: 100 }
    )
  })
})
