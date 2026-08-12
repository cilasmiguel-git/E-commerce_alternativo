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

    <!-- Botão Flutuante do WhatsApp Ajustado -->
    <a 
      href="https://wa.me/5599999999999" 
      target="_blank"
      class="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 drop-shadow-2xl"
      title="Fale conosco no WhatsApp"
    >
      <img src="/whatsapp-help.png" alt="Podemos Ajudar? WhatsApp" class="w-36 md:w-44 h-auto" />
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { Toaster } from 'vue-sonner'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'

const toastPosition = ref('bottom-left')
const authStore = useAuthStore()
const cartStore = useCartStore()

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
