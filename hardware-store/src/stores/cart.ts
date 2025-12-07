'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemData, CartState } from '@/types'
import * as medusa from '@/services/medusa'

interface CartStore extends CartState {
  // Actions
  initCart: () => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => void
  syncWithMedusa: () => Promise<void>
  
  // Loading states
  isLoading: boolean
  error: string | null
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cartId: null,
      items: [],
      subtotal: 0,
      total: 0,
      itemCount: 0,
      isLoading: false,
      error: null,

      // Initialize cart
      initCart: async () => {
        const { cartId } = get()
        set({ isLoading: true, error: null })
        
        try {
          if (cartId) {
            const cart = await medusa.getCart(cartId)
            if (cart) {
              set({
                items: cart.items.map(mapCartItem),
                subtotal: cart.subtotal,
                total: cart.total,
                itemCount: medusa.calculateCartItemCount(cart),
                isLoading: false,
              })
              return
            }
          }
          
          // Create new cart if none exists
          const newCart = await medusa.createCart()
          set({
            cartId: newCart.id,
            items: [],
            subtotal: 0,
            total: 0,
            itemCount: 0,
            isLoading: false,
          })
        } catch (error) {
          set({ error: '购物车加载失败', isLoading: false })
        }
      },

      // Add item to cart
      addItem: async (variantId: string, quantity: number) => {
        const { cartId } = get()
        if (!cartId) {
          await get().initCart()
        }
        
        const currentCartId = get().cartId
        if (!currentCartId) return
        
        set({ isLoading: true, error: null })
        
        try {
          const cart = await medusa.addToCart(currentCartId, variantId, quantity)
          set({
            items: cart.items.map(mapCartItem),
            subtotal: cart.subtotal,
            total: cart.total,
            itemCount: medusa.calculateCartItemCount(cart),
            isLoading: false,
          })
        } catch (error) {
          set({ error: '添加商品失败', isLoading: false })
        }
      },

      // Update item quantity
      updateQuantity: async (itemId: string, quantity: number) => {
        const { cartId } = get()
        if (!cartId) return
        
        set({ isLoading: true, error: null })
        
        try {
          const cart = await medusa.updateCartItem(cartId, itemId, quantity)
          set({
            items: cart.items.map(mapCartItem),
            subtotal: cart.subtotal,
            total: cart.total,
            itemCount: medusa.calculateCartItemCount(cart),
            isLoading: false,
          })
        } catch (error) {
          set({ error: '更新数量失败', isLoading: false })
        }
      },

      // Remove item from cart
      removeItem: async (itemId: string) => {
        const { cartId } = get()
        if (!cartId) return
        
        set({ isLoading: true, error: null })
        
        try {
          const cart = await medusa.removeFromCart(cartId, itemId)
          set({
            items: cart.items.map(mapCartItem),
            subtotal: cart.subtotal,
            total: cart.total,
            itemCount: medusa.calculateCartItemCount(cart),
            isLoading: false,
          })
        } catch (error) {
          set({ error: '删除商品失败', isLoading: false })
        }
      },

      // Clear cart (local only)
      clearCart: () => {
        set({
          cartId: null,
          items: [],
          subtotal: 0,
          total: 0,
          itemCount: 0,
        })
      },

      // Sync with Medusa
      syncWithMedusa: async () => {
        const { cartId } = get()
        if (!cartId) return
        
        try {
          const cart = await medusa.getCart(cartId)
          if (cart) {
            set({
              items: cart.items.map(mapCartItem),
              subtotal: cart.subtotal,
              total: cart.total,
              itemCount: medusa.calculateCartItemCount(cart),
            })
          }
        } catch {
          // Silent fail for sync
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
)

// Helper function to map Medusa cart item to our format
function mapCartItem(item: {
  id: string
  variant_id: string
  title: string
  variant?: { title?: string }
  thumbnail: string | null
  quantity: number
  unit_price: number
  subtotal: number
}): CartItemData {
  return {
    id: item.id,
    variantId: item.variant_id,
    productName: item.title,
    variantTitle: item.variant?.title || '',
    thumbnail: item.thumbnail,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    subtotal: item.subtotal,
  }
}

// Selector hooks
export const useCartItemCount = () => useCartStore((state) => state.itemCount)
export const useCartTotal = () => useCartStore((state) => state.total)
export const useCartItems = () => useCartStore((state) => state.items)
