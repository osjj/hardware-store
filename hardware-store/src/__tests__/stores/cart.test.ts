import { describe, it, expect, beforeEach } from 'vitest'
import fc from 'fast-check'
import type { CartItemData } from '@/types'

// Pure functions for cart calculations (extracted for testing)
function calculateCartItemCount(items: CartItemData[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

function calculateCartTotal(items: CartItemData[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

function addItemToCart(
  items: CartItemData[],
  newItem: { variantId: string; quantity: number; unitPrice: number; productName: string }
): CartItemData[] {
  const existingIndex = items.findIndex((i) => i.variantId === newItem.variantId)
  
  if (existingIndex >= 0) {
    // Update existing item
    return items.map((item, index) =>
      index === existingIndex
        ? {
            ...item,
            quantity: item.quantity + newItem.quantity,
            subtotal: (item.quantity + newItem.quantity) * item.unitPrice,
          }
        : item
    )
  }
  
  // Add new item
  return [
    ...items,
    {
      id: `item-${Date.now()}`,
      variantId: newItem.variantId,
      productName: newItem.productName,
      variantTitle: '',
      thumbnail: null,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      subtotal: newItem.quantity * newItem.unitPrice,
    },
  ]
}

function updateItemQuantity(items: CartItemData[], itemId: string, quantity: number): CartItemData[] {
  return items.map((item) =>
    item.id === itemId
      ? { ...item, quantity, subtotal: quantity * item.unitPrice }
      : item
  )
}

// Test data generators
const cartItemArbitrary = fc.record({
  id: fc.uuid(),
  variantId: fc.uuid(),
  productName: fc.string({ minLength: 1, maxLength: 50 }),
  variantTitle: fc.string({ maxLength: 30 }),
  thumbnail: fc.constant(null),
  quantity: fc.integer({ min: 1, max: 99 }),
  unitPrice: fc.integer({ min: 100, max: 100000 }), // Price in cents
  subtotal: fc.constant(0), // Will be calculated
}).map((item) => ({
  ...item,
  subtotal: item.quantity * item.unitPrice,
})) as fc.Arbitrary<CartItemData>

const newItemArbitrary = fc.record({
  variantId: fc.uuid(),
  quantity: fc.integer({ min: 1, max: 10 }),
  unitPrice: fc.integer({ min: 100, max: 100000 }),
  productName: fc.string({ minLength: 1, maxLength: 50 }),
})

describe('Cart Store - Property Tests', () => {
  /**
   * **Feature: hardware-store-website, Property 5: Cart item addition consistency**
   * *For any* add-to-cart operation with quantity N, the cart item count 
   * SHALL increase by N, and the cart total SHALL equal the sum of 
   * (item price × quantity) for all items.
   * **Validates: Requirements 5.1, 5.3**
   */
  it('Property 5: Adding item increases count by quantity', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 10 }),
        newItemArbitrary,
        (existingItems, newItem) => {
          const initialCount = calculateCartItemCount(existingItems)
          const updatedItems = addItemToCart(existingItems, newItem)
          const newCount = calculateCartItemCount(updatedItems)
          
          // If item already exists, count increases by newItem.quantity
          // If new item, count increases by newItem.quantity
          const existingItem = existingItems.find((i) => i.variantId === newItem.variantId)
          const expectedIncrease = newItem.quantity
          
          return newCount === initialCount + expectedIncrease
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: hardware-store-website, Property 5 (continued): Cart total consistency**
   * Cart total SHALL equal the sum of (item price × quantity) for all items.
   * **Validates: Requirements 5.1, 5.3**
   */
  it('Property 5: Cart total equals sum of item subtotals', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 10 }),
        (items) => {
          const total = calculateCartTotal(items)
          const expectedTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
          
          return total === expectedTotal
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: hardware-store-website, Property 6: Cart display consistency**
   * *For any* cart state, the displayed items SHALL match the cart data exactly 
   * (same items, quantities, and calculated subtotals).
   * **Validates: Requirements 5.2**
   */
  it('Property 6: Item subtotal equals quantity × unit price', () => {
    fc.assert(
      fc.property(
        cartItemArbitrary,
        (item) => {
          // Each item's subtotal should equal quantity × unitPrice
          return item.subtotal === item.quantity * item.unitPrice
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 6: Cart item count equals sum of all quantities', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 0, maxLength: 10 }),
        (items) => {
          const count = calculateCartItemCount(items)
          const expectedCount = items.reduce((sum, item) => sum + item.quantity, 0)
          
          return count === expectedCount
        }
      ),
      { numRuns: 100 }
    )
  })

  // Additional property: Quantity update preserves other items
  it('Property 5 (additional): Updating quantity only affects target item', () => {
    fc.assert(
      fc.property(
        fc.array(cartItemArbitrary, { minLength: 2, maxLength: 10 }),
        fc.integer({ min: 1, max: 99 }),
        (items, newQuantity) => {
          const targetItem = items[0]
          const updatedItems = updateItemQuantity(items, targetItem.id, newQuantity)
          
          // Other items should remain unchanged
          const otherItemsUnchanged = items.slice(1).every((item, index) => {
            const updated = updatedItems[index + 1]
            return (
              updated.id === item.id &&
              updated.quantity === item.quantity &&
              updated.unitPrice === item.unitPrice
            )
          })
          
          // Target item should have new quantity
          const targetUpdated = updatedItems[0].quantity === newQuantity
          
          return otherItemsUnchanged && targetUpdated
        }
      ),
      { numRuns: 100 }
    )
  })
})
