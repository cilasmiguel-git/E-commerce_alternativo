<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-light text-slate-800 tracking-tight">Meu <span class="font-semibold">Carrinho</span></h1>
    </div>

    <div v-if="cartStore.items.length === 0" class="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-12 text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full mb-6 text-slate-300">
        <ShoppingCart class="w-10 h-10 stroke-1" />
      </div>
      <h2 class="text-xl font-medium text-slate-700 mb-2">Seu carrinho está vazio</h2>
      <p class="text-slate-500 mb-8 font-light">Explore nossos produtos e adicione os itens desejados.</p>
      <router-link to="/" class="px-8 py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10">
        Voltar à Loja
      </router-link>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Lista de Itens -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="(item, idx) in cartStore.items" :key="(item.id || idx) + '-' + (item.selectedSize || 'nosize')" class="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.02)] flex flex-col sm:flex-row items-center gap-6 group">
          <div class="w-full sm:w-24 aspect-square bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
            <ImageIcon v-if="!item.image" class="w-8 h-8 text-slate-300 stroke-1" />
            <img v-else :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded-lg" />
          </div>
          
          <div class="flex-grow w-full text-center sm:text-left">
            <h3 class="font-medium text-slate-800 line-clamp-1 mb-1">
              {{ item.name }}
              <span v-if="item.selectedSize" class="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Tam: {{ item.selectedSize }}
              </span>
            </h3>
            <p class="text-sm font-semibold text-slate-500">R$ {{ item.price.toFixed(2) }}</p>
          </div>
          
          <div class="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4">
            <div class="flex items-center bg-slate-50 rounded-lg border border-slate-100 p-1">
              <button @click="cartStore.updateQuantity(item.id, item.quantity - 1, item.selectedSize)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-sm">
                <Minus class="w-4 h-4" />
              </button>
              <span class="w-10 text-center font-medium text-sm text-slate-800">{{ item.quantity }}</span>
              <button @click="cartStore.updateQuantity(item.id, item.quantity + 1, item.selectedSize)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-sm">
                <Plus class="w-4 h-4" />
              </button>
            </div>
            
            <div class="font-semibold text-slate-900 w-24 text-right hidden sm:block">
              R$ {{ (item.price * item.quantity).toFixed(2) }}
            </div>
            
            <button @click="cartStore.removeItem(item.id, item.selectedSize)" class="text-slate-400 hover:text-red-500 p-2 transition-colors opacity-100 sm:opacity-50 group-hover:opacity-100" title="Remover item">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Resumo do Pedido -->
      <div class="lg:col-span-1">
        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 sticky top-28">
          <h3 class="font-medium text-slate-800 mb-6 pb-4 border-b border-slate-200">Resumo da Compra</h3>
          
          <div class="space-y-4 mb-6 text-sm text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal ({{ cartStore.totalItems }} itens)</span>
              <span class="font-medium text-slate-800">R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="border-t border-slate-200 pt-6 flex justify-between items-end mb-8">
            <span class="text-sm font-medium text-slate-500 uppercase tracking-wide">Total</span>
            <span class="text-2xl font-semibold text-slate-900 tracking-tight">R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          
          <div class="flex flex-col gap-3">
            <router-link to="/checkout" class="w-full py-4 bg-primary text-slate-900 hover:bg-primary-dark font-medium rounded-xl transition-colors shadow-md shadow-primary/20 text-center flex justify-center items-center gap-2">
              Finalizar Pedido
              <ArrowRight class="w-4 h-4" />
            </router-link>
            <button @click="cartStore.clearCart()" class="w-full py-3 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
              Limpar Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
import { ShoppingCart, Plus, Minus, Trash2, Image as ImageIcon, ArrowRight } from '@lucide/vue'

const cartStore = useCartStore()
</script>
