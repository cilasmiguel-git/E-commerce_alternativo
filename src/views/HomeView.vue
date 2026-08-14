<template>
  <div class="space-y-16 pb-12">
    <!-- Cabeçalho da Página -->
    <section class="pt-8 md:pt-12">
      <div class="max-w-3xl">
        <h1 class="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-4">
          Nossos <span class="font-semibold">Produtos</span>
        </h1>
        <p class="text-slate-500 font-light text-lg">
          Uniformes, materiais, acessórios e taxas com pagamento facilitado.
        </p>
      </div>
    </section>

    <!-- Seção de Produtos -->
    <section id="produtos">
      <!-- Filtros de Categorias (Opções Principais + Dinâmicas do Backend) -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div class="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Estado de Carregamento (Loading Skeleton) -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        <div v-for="i in 4" :key="i" class="bg-slate-100 animate-pulse rounded-xl h-80"></div>
      </div>

      <!-- Estado Vazio (Nenhum produto nesta categoria) -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
        <p class="text-slate-500 text-lg font-medium">Nenhum produto encontrado na categoria "{{ selectedCategory }}".</p>
        <p class="text-slate-400 text-sm mt-1">Selecione outra categoria para visualizar os produtos disponíveis.</p>
      </div>

      <!-- Grid de Produtos vindo do Backend -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
          @open-details="openProductDetails"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart'
import { toast } from 'vue-sonner'

const router = useRouter()
const products = ref([])
const isLoading = ref(true)
const selectedCategory = ref('Todos')
const cartStore = useCartStore()

const defaultCategories = ['Todos', 'Uniformes', 'Materiais', 'Acessórios', 'Outros']

// Normaliza strings para comparação (remove acentos, caixa baixa, trim)
const normalizeStr = (str) => {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Verifica se a categoria do produto corresponde à categoria selecionada
const matchesCategory = (productCategory, selectedCat) => {
  if (selectedCat === 'Todos') return true
  if (!productCategory) return selectedCat === 'Outros'

  const pCat = normalizeStr(productCategory)
  const sCat = normalizeStr(selectedCat)

  if (pCat === sCat) return true
  if (sCat.startsWith('materia') && pCat.startsWith('materia')) return true
  if (sCat.startsWith('acessori') && pCat.startsWith('acessori')) return true
  if (sCat.startsWith('uniform') && pCat.startsWith('uniform')) return true
  if (sCat.startsWith('outro') && pCat.startsWith('outro')) return true

  return false
}

// Capitaliza a primeira letra
const capitalize = (str) => {
  if (!str) return 'Outros'
  const trimmed = str.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

// Lista final de categorias (opções padrão + qualquer categoria extra vinda do banco)
const categories = computed(() => {
  const cats = [...defaultCategories]
  
  products.value.forEach(p => {
    if (p.category) {
      const matchesAnyDefault = defaultCategories.some(d => matchesCategory(p.category, d))
      if (!matchesAnyDefault && !cats.includes(p.category)) {
        cats.push(p.category)
      }
    }
  })
  
  return cats
})

// Filtra os produtos com base na categoria selecionada
const filteredProducts = computed(() => {
  return products.value.filter(p => matchesCategory(p.category, selectedCategory.value))
})

const openProductDetails = (product) => {
  router.push(`/produto/${product.id}`)
}

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const endpoint = `${apiUrl}/api/store/${tenantId}/products`
    
    const res = await fetch(endpoint)

    if (res.ok) {
      const data = await res.json()
      const fetchedProducts = Array.isArray(data) ? data : (data.products || data.produtos || [])
      
      products.value = fetchedProducts.map(p => {
        const rawCategory = p.categoria || p.category || 'Outros'
        return {
          id: p._id || p.id,
          name: p.nome || p.name,
          description: p.descricao || p.description,
          price: p.preco || p.price,
          category: capitalize(rawCategory),
          image: p.imagemPrincipal || p.imagem || p.image || null,
          imageBack: p.imagemHover || null,
          tamanhos: p.tamanhos || [],
          estoquePorTamanho: p.estoquePorTamanho || [],
          gerenciaEstoque: p.gerenciaEstoque || false,
          estoque: p.estoque || 0
        }
      })
    } else {
      products.value = []
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Utilitário para esconder a scrollbar no mobile mantendo o scroll */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>



