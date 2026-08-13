<template>
  <nav class="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-50 transition-all duration-300 shadow-sm">
    <div class="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
      
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="relative w-12 h-12 rounded-full overflow-hidden border border-slate-100 group-hover:shadow-md transition-shadow">
          <img src="/logo.png" alt="Logo Colégio Alternativo Colaço" class="w-full h-full object-cover p-1" />
        </div>
        <span class="font-medium text-lg tracking-tight hidden lg:block text-slate-800">Colégio Alternativo Colaço</span>
      </router-link>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-5">
        <router-link to="/" class="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Início</router-link>
        
        <router-link 
          to="/tabela-tamanhos" 
          class="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
        >
          <Ruler class="w-4 h-4 text-amber-500" />
          <span>Guia de Tamanhos</span>
        </router-link>

        <router-link 
          v-if="authStore.isAuthenticated" 
          to="/orders" 
          class="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
        >
          <ShoppingBag class="w-4 h-4 text-slate-500" />
          <span>Meus Pedidos</span>
        </router-link>

        <router-link 
          v-if="authStore.isAuthenticated" 
          to="/profile" 
          class="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-100 transition-colors"
          title="Ver Meu Perfil"
        >
          <User class="w-4 h-4 text-primary" />
          <span>Olá, {{ authStore.user?.firstName || 'Usuário' }}</span>
        </router-link>

        <router-link to="/cart" class="relative flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          <ShoppingCart class="w-5 h-5 text-slate-700" />
          <span class="text-sm font-medium text-slate-700">Carrinho</span>
          <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-1 bg-primary text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
            {{ cartStore.totalItems }}
          </span>
        </router-link>
      </div>

      <!-- Mobile Toggle -->
      <button class="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none" @click="isMenuOpen = !isMenuOpen">
        <Menu v-if="!isMenuOpen" class="w-6 h-6" />
        <X v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Nav Dropdown -->
    <div v-if="isMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 z-40">
      <router-link 
        v-if="authStore.isAuthenticated" 
        @click="isMenuOpen = false"
        to="/profile" 
        class="flex items-center gap-2 text-sm font-medium text-slate-700 pb-2 border-b border-slate-50 hover:text-slate-900"
      >
        <User class="w-5 h-5 text-primary" />
        <span>Olá, {{ authStore.user?.firstName || 'Usuário' }} (Meu Perfil)</span>
      </router-link>
      <router-link @click="isMenuOpen = false" to="/" class="text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-50">Início</router-link>
      <router-link 
        @click="isMenuOpen = false" 
        to="/tabela-tamanhos" 
        class="flex items-center gap-2 text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-50"
      >
        <Ruler class="w-5 h-5 text-amber-500" />
        <span>Guia de Tamanhos</span>
      </router-link>
      <router-link 
        v-if="authStore.isAuthenticated" 
        @click="isMenuOpen = false" 
        to="/orders" 
        class="flex items-center gap-2 text-base font-medium text-slate-600 hover:text-slate-900 py-2 border-b border-slate-50"
      >
        <ShoppingBag class="w-5 h-5 text-slate-500" />
        <span>Meus Pedidos</span>
      </router-link>
      <router-link @click="isMenuOpen = false" to="/cart" class="flex items-center justify-between text-base font-medium text-slate-600 hover:text-slate-900 py-2">
        <div class="flex items-center gap-2">
          <ShoppingCart class="w-5 h-5" />
          <span>Carrinho</span>
        </div>
        <span v-if="cartStore.totalItems > 0" class="bg-primary text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
          {{ cartStore.totalItems }} itens
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { ShoppingCart, ShoppingBag, Menu, X, User, Ruler } from '@lucide/vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const isMenuOpen = ref(false)
</script>
