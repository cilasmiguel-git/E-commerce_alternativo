<template>
  <Teleport to="body">
    <transition name="story-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md sm:p-4">
        
        <!-- Área clicável para fechar -->
        <div class="absolute inset-0 z-0" @click="close"></div>
        
        <!-- Conteúdo do Modal (Estilo Story) -->
        <div 
          class="relative w-full h-full sm:h-[85vh] sm:max-w-[400px] sm:rounded-[2rem] sm:border sm:border-slate-800 overflow-hidden bg-slate-900 shadow-2xl z-10 flex flex-col transform transition-transform duration-300 story-content"
          @click.stop
        >
          <!-- Botão de Fechar Superior -->
          <div class="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent">
            <!-- Barra de progresso (estética de Story) -->
            <div class="absolute top-2 left-4 right-4 flex gap-1 z-30">
              <div class="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                <div class="h-full bg-white rounded-full animate-progress origin-left"></div>
              </div>
            </div>
            
            <span class="text-white/80 text-xs font-semibold uppercase tracking-widest mt-4 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
              {{ product?.category || 'Detalhes' }}
            </span>
            <button @click="close" class="mt-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm focus:outline-none">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Imagem Imersiva -->
          <div class="relative flex-grow flex items-center justify-center bg-slate-950/50 overflow-hidden">
            <template v-if="product?.image">
              <!-- Imagem com zoom lento (efeito Ken Burns) -->
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="absolute inset-0 w-full h-full object-cover sm:object-contain opacity-90 animate-slow-zoom"
              />
            </template>
            <div v-else class="text-slate-500 flex flex-col items-center justify-center">
              <Image class="w-16 h-16 mb-2 opacity-50" />
              <span class="text-sm">Sem foto</span>
            </div>
          </div>

          <!-- Área de Informações (Base / Estilo Legenda) -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-24 pb-6 px-6 z-20">
            <h2 class="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">
              {{ product?.name }}
            </h2>
            
            <p class="text-white/80 text-sm mb-4 line-clamp-3 leading-relaxed">
              {{ product?.description || 'Nenhuma descrição fornecida para este item.' }}
            </p>
            
            <!-- Seletor de Tamanhos -->
            <div v-if="availableSizes.length > 0" class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/90">
                  Tamanho: <span v-if="selectedSize" class="text-amber-400 font-bold ml-1">{{ selectedSize }}</span>
                </span>
                <span v-if="showError" class="text-xs font-semibold text-rose-400 animate-pulse">
                  Selecione um tamanho!
                </span>
              </div>
              <div class="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
                <button
                  v-for="item in availableSizes"
                  :key="item.tamanho"
                  type="button"
                  :disabled="!item.disponivel"
                  @click="selectSize(item)"
                  :class="[
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm',
                    !item.disponivel 
                      ? 'bg-black/30 border-white/10 text-white/30 cursor-not-allowed line-through'
                      : selectedSize === item.tamanho
                        ? 'bg-amber-400 text-slate-950 border-amber-400 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                        : 'bg-black/40 text-white border-white/20 hover:border-amber-400/60 hover:bg-black/60'
                  ]"
                >
                  {{ item.tamanho }}
                  <span v-if="product?.gerenciaEstoque && !item.disponivel" class="text-[9px] font-normal text-rose-400 ml-1">(Esgotado)</span>
                  <span v-else-if="product?.gerenciaEstoque && item.disponivel && item.estoque <= 3" class="text-[9px] font-normal text-amber-300 ml-0.5">
                    ({{ item.estoque }})
                  </span>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                R$ {{ product?.price?.toFixed(2) }}
              </span>

              <router-link 
                to="/tabela-tamanhos" 
                target="_blank"
                @click="close"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20 backdrop-blur-sm transition-all"
              >
                <Ruler class="w-3.5 h-3.5" />
                <span>Guia de Tamanhos</span>
              </router-link>
            </div>

            <!-- Botões de Ação -->
            <button 
              @click="handleAddToCart"
              :disabled="isAllOutOfStock"
              :class="[
                'w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 transform',
                isAllOutOfStock 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700'
                  : 'bg-primary hover:bg-primary-dark text-slate-900 shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:-translate-y-1'
              ]"
            >
              <ShoppingCart class="w-6 h-6" />
              <span class="text-lg">{{ isAllOutOfStock ? 'Produto Esgotado' : 'Adicionar à Sacola' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { X, ShoppingCart, Image, Ruler } from '@lucide/vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const selectedSize = ref(null)
const showError = ref(false)

const availableSizes = computed(() => {
  if (!props.product) return []

  if (props.product.estoquePorTamanho && props.product.estoquePorTamanho.length > 0) {
    return props.product.estoquePorTamanho.map(item => ({
      tamanho: item.tamanho,
      estoque: item.estoque,
      disponivel: !props.product.gerenciaEstoque || item.estoque > 0
    }))
  }

  if (props.product.tamanhos && props.product.tamanhos.length > 0) {
    return props.product.tamanhos.map(tam => ({
      tamanho: tam,
      estoque: props.product.estoque || 0,
      disponivel: !props.product.gerenciaEstoque || (props.product.estoque > 0)
    }))
  }

  return []
})

const isAllOutOfStock = computed(() => {
  if (!props.product || !props.product.gerenciaEstoque) return false;
  if (availableSizes.value.length > 0) {
    return availableSizes.value.every(item => !item.disponivel);
  }
  return (props.product.estoque || 0) <= 0;
})

const selectSize = (item) => {
  if (!item.disponivel) return
  selectedSize.value = item.tamanho
  showError.value = false
}

const close = () => {
  selectedSize.value = null
  showError.value = false
  emit('close')
}

const handleAddToCart = () => {
  if (availableSizes.value.length > 0 && !selectedSize.value) {
    showError.value = true
    return
  }
  emit('add-to-cart', props.product, selectedSize.value)
}

// Reseta o tamanho selecionado ao abrir/trocar o produto
watch(() => [props.isOpen, props.product], () => {
  selectedSize.value = null
  showError.value = false
})

// Fechar com a tecla ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden' // Impede o scroll de fundo
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Animação do Backdrop */
.story-fade-enter-active,
.story-fade-leave-active {
  transition: opacity 0.3s ease;
}

.story-fade-enter-from,
.story-fade-leave-to {
  opacity: 0;
}

/* Animação do Conteúdo deslizando de baixo */
.story-fade-enter-active .story-content {
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.story-fade-leave-active .story-content {
  transition: transform 0.3s ease-in-out;
}

.story-fade-enter-from .story-content,
.story-fade-leave-to .story-content {
  transform: translateY(100%);
}

/* Efeito Ken Burns (Zoom Lento) */
@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}

.animate-slow-zoom {
  animation: slowZoom 15s ease-out forwards;
}

/* Barra de progresso falsa (estética) */
@keyframes progressFill {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

.animate-progress {
  animation: progressFill 15s linear forwards;
}
</style>
