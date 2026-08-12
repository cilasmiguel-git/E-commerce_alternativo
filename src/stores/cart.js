import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  function saveToStorage() {
    localStorage.setItem('store_cart', JSON.stringify(items.value))
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('store_cart')
    if (stored) {
      try {
        items.value = JSON.parse(stored)
      } catch (e) {
        console.error('Erro ao ler o carrinho do storage', e)
      }
    }
  }

  function addItem(product) {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
    saveToStorage()
  }

  function removeItem(productId) {
    const index = items.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeItem(productId)
      } else {
        saveToStorage()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveToStorage()
  }

  return { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, loadFromStorage }
})
