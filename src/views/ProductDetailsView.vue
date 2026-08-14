<template>
  <div class="max-w-6xl mx-auto py-3 sm:py-6 px-2.5 sm:px-6 lg:px-8">
    
    <!-- Botão de Voltar / Breadcrumb -->
    <div class="mb-4 sm:mb-6">
      <button 
        @click="goBack" 
        class="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Voltar aos Produtos</span>
      </button>
    </div>

    <!-- Estado de Carregamento (Loading Skeleton) -->
    <div v-if="loading" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-8 md:p-12 shadow-sm grid md:grid-cols-2 gap-6 sm:gap-10 animate-pulse">
      <div class="aspect-square bg-slate-100 rounded-xl sm:rounded-2xl w-full"></div>
      <div class="space-y-4 sm:space-y-6 flex flex-col justify-center">
        <div class="h-4 bg-slate-200 rounded w-1/4"></div>
        <div class="h-7 sm:h-8 bg-slate-200 rounded w-3/4"></div>
        <div class="h-5 sm:h-6 bg-slate-200 rounded w-1/3"></div>
        <div class="h-16 sm:h-20 bg-slate-100 rounded-xl w-full"></div>
        <div class="h-12 bg-slate-200 rounded-xl w-full"></div>
      </div>
    </div>

    <!-- Estado Produto Não Encontrado -->
    <div v-else-if="!product" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-6 sm:p-12 text-center shadow-sm max-w-lg mx-auto my-8 sm:my-12">
      <div class="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
        <PackageX class="w-7 h-7 sm:w-8 sm:h-8 stroke-1" />
      </div>
      <h2 class="text-lg sm:text-xl font-bold text-slate-800 mb-2">Produto não encontrado</h2>
      <p class="text-slate-500 text-xs sm:text-sm mb-6">O item que você procura não está disponível ou foi removido.</p>
      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-slate-900 text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-md"
      >
        Ver Todos os Produtos
      </router-link>
    </div>

    <!-- Conteúdo Principal do Produto -->
    <div v-else class="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.04)] overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-8 md:p-10 lg:p-12">
        
        <!-- Galeria de Imagens -->
        <div class="flex flex-col gap-3 sm:gap-4">
          <!-- Imagem Principal -->
          <div class="relative aspect-square max-h-[380px] sm:max-h-none mx-auto w-full bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center group">
            <template v-if="activeImage">
              <img 
                :src="activeImage" 
                :alt="product.name" 
                class="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </template>
            <div v-else class="flex flex-col items-center justify-center text-slate-300">
              <ImageIcon class="w-12 h-12 sm:w-16 sm:h-16 stroke-1 mb-2" />
              <span class="text-xs uppercase tracking-wider font-medium text-slate-400">Sem Foto</span>
            </div>

            <!-- Badge de Esgotado / Categoria -->
            <div v-if="isAllOutOfStock" class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-rose-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-md z-10">
              Esgotado
            </div>
            <div v-else-if="product.category" class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md text-slate-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 shadow-sm z-10">
              {{ product.category }}
            </div>
          </div>

          <!-- Miniaturas (se houver imagem secundária / hover) -->
          <div v-if="imagesList.length > 1" class="flex gap-2.5 overflow-x-auto pb-1">
            <button
              v-for="(img, idx) in imagesList"
              :key="idx"
              @click="activeImage = img"
              :class="[
                'w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all p-1',
                activeImage === img ? 'border-primary shadow-sm scale-95' : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              ]"
            >
              <img :src="img" :alt="`${product.name} - Imagem ${idx + 1}`" class="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        <!-- Detalhes e Ações de Compra -->
        <div class="flex flex-col justify-between">
          <div class="space-y-4 sm:space-y-6">
            
            <!-- Título e Preço -->
            <div>
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 leading-snug sm:leading-tight mb-2 sm:mb-3">
                {{ product.name }}
              </h1>
              <div class="flex items-baseline flex-wrap gap-2.5 sm:gap-3">
                <span class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  R$ {{ product.price ? product.price.toFixed(2) : '0.00' }}
                </span>
                <span v-if="product.gerenciaEstoque && !isAllOutOfStock" class="text-[11px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-100">
                  Em estoque
                </span>
              </div>
            </div>

            <!-- Descrição -->
            <div class="border-t border-b border-slate-100 py-3 sm:py-4">
              <h3 class="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-2">Descrição</h3>
              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {{ product.description || 'Nenhuma descrição detalhada fornecida para este item.' }}
              </p>
            </div>

            <!-- Seletor de Tamanhos -->
            <div v-if="availableSizes.length > 0" class="space-y-2.5 sm:space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <label class="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span>Tamanho:</span>
                  <span v-if="selectedSize" class="text-amber-700 font-bold px-2 py-0.5 rounded bg-amber-50 border border-amber-200/60 text-xs">
                    {{ selectedSize }}
                  </span>
                </label>

                <router-link 
                  to="/tabela-tamanhos" 
                  target="_blank"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  <Ruler class="w-3.5 h-3.5" />
                  <span>Guia de Tamanhos</span>
                </router-link>
              </div>

              <!-- Botões de Tamanho -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in availableSizes"
                  :key="item.tamanho"
                  type="button"
                  :disabled="!item.disponivel"
                  @click="selectSize(item)"
                  :class="[
                    'px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5',
                    !item.disponivel 
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                      : selectedSize === item.tamanho
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md scale-105 ring-2 ring-amber-400/40'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-slate-50'
                  ]"
                >
                  <span>{{ item.tamanho }}</span>
                  <span v-if="product.gerenciaEstoque && !item.disponivel" class="text-[10px] font-normal text-rose-500">(Esgotado)</span>
                  <span v-else-if="product.gerenciaEstoque && item.disponivel && item.estoque <= 3" class="text-[10px] font-normal text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    {{ item.estoque }} rest.
                  </span>
                </button>
              </div>

              <p v-if="showSizeError" class="text-xs font-medium text-rose-600 animate-bounce pt-1">
                Por favor, escolha um tamanho antes de adicionar ao carrinho.
              </p>
            </div>

            <!-- Seletor de Quantidade -->
            <div class="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              <label class="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">Quantidade</label>
              <div class="flex items-center flex-wrap gap-3 sm:gap-4">
                <div class="inline-flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                  <button 
                    @click="quantity > 1 ? quantity-- : null"
                    :disabled="quantity <= 1 || isAllOutOfStock"
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors shadow-sm disabled:opacity-40"
                  >
                    <Minus class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span class="w-10 sm:w-12 text-center font-bold text-xs sm:text-sm text-slate-800">{{ quantity }}</span>
                  <button 
                    @click="increaseQuantity"
                    :disabled="isAllOutOfStock || (maxStockLimit !== null && quantity >= maxStockLimit)"
                    class="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors shadow-sm disabled:opacity-40"
                  >
                    <Plus class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <span v-if="maxStockLimit !== null && maxStockLimit < Infinity" class="text-xs text-slate-500 font-medium">
                  Máximo em estoque: {{ maxStockLimit }}
                </span>
              </div>
            </div>

            <!-- Botões de Ação Principais -->
            <div class="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-3 sm:pt-4">
              <button 
                @click="addToCart"
                :disabled="isAllOutOfStock"
                :class="[
                  'w-full sm:flex-1 font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm shadow-md',
                  isAllOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                    : 'bg-primary hover:bg-primary-dark text-slate-900 shadow-amber-400/20 hover:shadow-lg hover:-translate-y-0.5'
                ]"
              >
                <ShoppingCart class="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{{ isAllOutOfStock ? 'Produto Esgotado' : 'Adicionar ao Carrinho' }}</span>
              </button>

              <button 
                @click="buyNow"
                :disabled="isAllOutOfStock"
                :class="[
                  'w-full sm:flex-1 font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm border',
                  isAllOutOfStock
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 hover:shadow-lg hover:-translate-y-0.5'
                ]"
              >
                <Zap class="w-4 h-4 sm:w-5 sm:h-5 fill-current text-amber-400" />
                <span>Comprar Agora</span>
              </button>
            </div>
          </div>

          <!-- Cards Informativos de Confiança -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100">
            <div class="bg-slate-50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 border border-slate-100">
              <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Building2 class="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800">Retirada na Escola</h4>
                <p class="text-[10px] sm:text-[11px] text-slate-500">Retire diretamente na secretaria</p>
              </div>
            </div>

            <div class="bg-slate-50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl flex items-center gap-3 border border-slate-100">
              <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <ShieldCheck class="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-800">Pagamento Seguro</h4>
                <p class="text-[10px] sm:text-[11px] text-slate-500">PIX ou Cartão em até 12x</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  ShoppingCart, 
  Zap, 
  Image as ImageIcon, 
  Ruler, 
  Minus, 
  Plus, 
  PackageX,
  Building2,
  ShieldCheck
} from '@lucide/vue'
import { useCartStore } from '../stores/cart'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const selectedSize = ref(null)
const quantity = ref(1)
const showSizeError = ref(false)
const activeImage = ref(null)

const normalizeCategory = (cat) => {
  if (!cat) return 'Outros'
  const trimmed = cat.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

const imagesList = computed(() => {
  if (!product.value) return []
  const list = []
  if (product.value.image) list.push(product.value.image)
  if (product.value.imageBack && !list.includes(product.value.imageBack)) {
    list.push(product.value.imageBack)
  }
  return list
})

const availableSizes = computed(() => {
  if (!product.value) return []

  if (product.value.estoquePorTamanho && product.value.estoquePorTamanho.length > 0) {
    return product.value.estoquePorTamanho.map(item => ({
      tamanho: item.tamanho,
      estoque: item.estoque,
      disponivel: !product.value.gerenciaEstoque || item.estoque > 0
    }))
  }

  if (product.value.tamanhos && product.value.tamanhos.length > 0) {
    return product.value.tamanhos.map(tam => ({
      tamanho: tam,
      estoque: product.value.estoque || 0,
      disponivel: !product.value.gerenciaEstoque || (product.value.estoque > 0)
    }))
  }

  return []
})

const isAllOutOfStock = computed(() => {
  if (!product.value || !product.value.gerenciaEstoque) return false
  if (availableSizes.value.length > 0) {
    return availableSizes.value.every(item => !item.disponivel)
  }
  return (product.value.estoque || 0) <= 0
})

const maxStockLimit = computed(() => {
  if (!product.value || !product.value.gerenciaEstoque) return Infinity
  if (availableSizes.value.length > 0) {
    if (!selectedSize.value) return null
    const found = availableSizes.value.find(s => s.tamanho === selectedSize.value)
    return found ? found.estoque : 0
  }
  return product.value.estoque !== undefined ? product.value.estoque : Infinity
})

const selectSize = (item) => {
  if (!item.disponivel) return
  selectedSize.value = item.tamanho
  showSizeError.value = false
  if (quantity.value > item.estoque && product.value.gerenciaEstoque) {
    quantity.value = Math.max(1, item.estoque)
  }
}

const increaseQuantity = () => {
  if (maxStockLimit.value !== null && quantity.value >= maxStockLimit.value) {
    toast.error('Limite Atingido', {
      description: `Quantidade máxima disponível em estoque: ${maxStockLimit.value}`,
      duration: 3000
    })
    return
  }
  quantity.value++
}

const goBack = () => {
  router.push('/')
}

const addToCart = () => {
  if (availableSizes.value.length > 0 && !selectedSize.value) {
    showSizeError.value = true
    return
  }

  let addedCount = 0
  let lastResult = null

  for (let i = 0; i < quantity.value; i++) {
    const res = cartStore.addItem(product.value, selectedSize.value)
    if (res && res.success) {
      addedCount++
    } else {
      lastResult = res
      break
    }
  }

  if (addedCount > 0) {
    const sizeMsg = selectedSize.value ? ` (Tam: ${selectedSize.value})` : ''
    toast.success('Adicionado ao Carrinho', {
      description: `${addedCount}x ${product.value.name}${sizeMsg} adicionado(s) com sucesso.`,
      duration: 3000
    })
  }

  if (lastResult && lastResult.reason === 'out_of_stock') {
    toast.error('Estoque Insuficiente', {
      description: `Você já possui o limite em estoque (${lastResult.maxStock} un.) no carrinho.`,
      duration: 4000
    })
  }
}

const buyNow = () => {
  if (availableSizes.value.length > 0 && !selectedSize.value) {
    showSizeError.value = true
    return
  }
  addToCart()
  router.push('/checkout')
}

const fetchProductDetails = async () => {
  loading.value = true
  try {
    const productId = route.params.id
    const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    // Tenta buscar o produto direto por ID no backend
    const res = await fetch(`${apiUrl}/api/store/${tenantId}/products/${productId}`)

    if (res.ok) {
      const data = await res.json()
      const p = data.product || data.produto || data
      product.value = {
        id: p._id || p.id,
        name: p.nome || p.name,
        description: p.descricao || p.description,
        price: p.preco || p.price,
        category: normalizeCategory(p.categoria || p.category),
        image: p.imagemPrincipal || p.imagem || p.image || null,
        imageBack: p.imagemHover || null,
        tamanhos: p.tamanhos || [],
        estoquePorTamanho: p.estoquePorTamanho || [],
        gerenciaEstoque: p.gerenciaEstoque || false,
        estoque: p.estoque || 0
      }
    } else {
      // Fallback: se o endpoint individual falhar, busca lista completa e filtra
      const listRes = await fetch(`${apiUrl}/api/store/${tenantId}/products`)
      if (listRes.ok) {
        const listData = await listRes.json()
        const allProducts = Array.isArray(listData) ? listData : (listData.products || listData.produtos || [])
        const p = allProducts.find(item => (item._id || item.id) === productId)
        if (p) {
          product.value = {
            id: p._id || p.id,
            name: p.nome || p.name,
            description: p.descricao || p.description,
            price: p.preco || p.price,
            category: normalizeCategory(p.categoria || p.category),
            image: p.imagemPrincipal || p.imagem || p.image || null,
            imageBack: p.imagemHover || null,
            tamanhos: p.tamanhos || [],
            estoquePorTamanho: p.estoquePorTamanho || [],
            gerenciaEstoque: p.gerenciaEstoque || false,
            estoque: p.estoque || 0
          }
        }
      }
    }
  } catch (err) {
    console.error('Erro ao buscar detalhes do produto:', err)
  } finally {
    loading.value = false
    if (product.value && imagesList.value.length > 0) {
      activeImage.value = imagesList.value[0]
    }
  }
}

onMounted(() => {
  fetchProductDetails()
})

watch(() => route.params.id, () => {
  fetchProductDetails()
})
</script>
