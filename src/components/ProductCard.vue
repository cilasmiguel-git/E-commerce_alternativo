<template>
  <div class="bg-white rounded-xl overflow-hidden flex flex-col h-full group border border-slate-100 hover:border-slate-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_-5px_rgba(6,81,237,0.1)] transition-all duration-300">
    <div class="relative aspect-[4/3] bg-white overflow-hidden flex items-center justify-center">
      <!-- Placeholder Refinado -->
      <div v-if="!product.image" class="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100/50 group-hover:scale-105 transition-transform duration-700 ease-out">
        <ImageIcon class="w-12 h-12 mb-2 stroke-1" />
        <span class="text-xs font-medium uppercase tracking-widest text-slate-400">Sem Foto</span>
      </div>
      <template v-else>
        <img :src="product.image" :alt="product.name" class="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-700 ease-out group-hover:scale-105" :class="{'group-hover:opacity-0': product.imageBack}" />
        <img v-if="product.imageBack" :src="product.imageBack" :alt="product.name + ' - Costas'" class="absolute inset-0 w-full h-full object-contain p-4 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105" />
      </template>
      
      <!-- Categoria / Badge -->
      <div v-if="product.category" class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-600 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm z-10">
        {{ product.category }}
      </div>

      <!-- Marcador de Quantidade no Carrinho -->
      <div v-if="quantityInCart > 0" class="absolute top-3 right-3 bg-primary text-slate-900 text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-md z-10 animate-in zoom-in duration-300">
        {{ quantityInCart }}
      </div>
    </div>
    
    <div class="p-6 flex flex-col flex-grow">
      <div class="flex-grow">
        <h3 class="font-semibold text-base text-slate-800 mb-2 leading-snug group-hover:text-primary transition-colors text-balance min-h-[2.75rem]">{{ product.name }}</h3>
        <p class="text-sm text-slate-500 line-clamp-2 leading-relaxed min-h-[2.85rem]">{{ product.description }}</p>
      </div>
      
      <div class="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Preço</span>
          <span class="text-lg font-semibold text-slate-900">R$ {{ product.price.toFixed(2) }}</span>
        </div>
        
        <button 
          @click="addToCart"
          class="w-full bg-slate-50 hover:bg-primary hover:text-slate-900 text-slate-700 border border-slate-200 hover:border-primary px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart class="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Image as ImageIcon, ShoppingCart } from '@lucide/vue'
import { useCartStore } from '../stores/cart'
import { toast } from 'vue-sonner'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const quantityInCart = computed(() => {
  const item = cartStore.items.find(i => i.id === props.product.id)
  return item ? item.quantity : 0
})

const addToCart = () => {
  cartStore.addItem(props.product)
  toast.success('Adicionado ao Carrinho', {
    description: `${props.product.name} foi adicionado com sucesso.`,
    duration: 3000,
  })
}
</script>
