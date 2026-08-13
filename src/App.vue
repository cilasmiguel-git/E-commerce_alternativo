<template>
  <div class="flex flex-col min-h-screen bg-slate-50/50 selection:bg-primary/30 selection:text-slate-900">
    <Toaster :position="toastPosition" richColors />
    <Navbar />
    
    <main class="flex-grow container mx-auto px-4 md:px-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />

    <!-- Botão Flutuante do WhatsApp Ilustrado -->
    <a 
      :href="whatsappUrl" 
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group hover:-translate-y-1.5 hover:scale-105 transition-all duration-300 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
      title="Fale conosco no WhatsApp - Colégio Alternativo Colaço"
    >
      <img 
        src="/whatsapp-help.png" 
        alt="Podemos Ajudar? WhatsApp Colégio Alternativo Colaço" 
        class="w-44 sm:w-52 md:w-60 h-auto object-contain filter drop-shadow-md group-hover:brightness-105 transition-all" 
      />
    </a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { Toaster } from 'vue-sonner'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

const toastPosition = ref('bottom-left')
const authStore = useAuthStore()
const cartStore = useCartStore()

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999'
const whatsappUrl = computed(() => {
  const text = encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre a loja do Colégio Alternativo Colaço.')
  return `https://wa.me/${whatsappNumber}?text=${text}`
})

const updatePosition = () => {
  toastPosition.value = window.innerWidth < 768 ? 'top-center' : 'bottom-left'
}

onMounted(() => {
  authStore.initAuth() // Restaura a sessão do localStorage
  cartStore.loadFromStorage() // Restaura o carrinho do localStorage
  updatePosition()
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
})
</script>

<style>
/* Transição suave entre as páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
