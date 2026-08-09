<template>
  <div class="space-y-16 pb-12">
    <!-- Cabeçalho da Página -->
    <section class="pt-8 md:pt-12">
      <div class="max-w-3xl">
        <h1 class="text-3xl md:text-4xl font-light text-slate-800 tracking-tight mb-4">
          Nossos <span class="font-semibold">Produtos</span>
        </h1>
        <p class="text-slate-500 font-light text-lg">
          Uniformes, materiais e taxas com pagamento facilitado.
        </p>
      </div>
    </section>

    <!-- Seção de Produtos -->
    <section id="produtos">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div class="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button class="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-medium whitespace-nowrap shadow-md">Todos</button>
          <button class="px-5 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap transition-colors">Uniformes</button>
          <button class="px-5 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap transition-colors">Taxas</button>
          <button class="px-5 py-2 bg-white text-slate-600 border border-slate-200 rounded-full text-sm font-medium hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap transition-colors">Materiais</button>
        </div>
      </div>

      <!-- Grid responsivo ajustado para maior respiro -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        <ProductCard 
          v-for="product in combinedProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const apiProducts = ref([])

const mockProducts = ref([
  {
    id: 1,
    name: 'Camisa Uniforme Padrão (Infanto Juvenil)',
    description: 'Camisa de uniforme em malha fria antitranspirante. Máximo conforto para o dia a dia escolar.',
    price: 65.00,
    category: 'Uniformes',
    image: '/uniformes/manga-curta/frente.jpg',
    imageBack: '/uniformes/manga-curta/costas.jpg'
  },
  {
    id: 2,
    name: 'Blusa de Manga Longa (Infanto Juvenil)',
    description: 'Blusa de manga longa com tecido térmico e punhos confortáveis para dias mais frios.',
    price: 85.00,
    category: 'Uniformes',
    image: '/uniformes/manga-longa/frente.jpg',
    imageBack: '/uniformes/manga-longa/costas.jpg'
  },
  {
    id: 3,
    name: 'Taxa de Material Didático',
    description: 'Acesso completo à plataforma digital e apostilas impressas para o semestre vigente.',
    price: 150.00,
    category: 'Taxas',
    image: null
  },
  {
    id: 4,
    name: 'Short Padrão (Infantojuvenil)',
    description: 'Short oficial para aulas e atividades esportivas. Tecido leve e de secagem rápida.',
    price: 65.00,
    category: 'Uniformes',
    image: '/uniformes/short-infantojuvenil/frente.jpg',
    imageBack: '/uniformes/short-infantojuvenil/costas.jpg'
  },
  {
    id: 5,
    name: 'Camisa Uniforme Padrão (Infantil)',
    description: 'Camisa de manga curta ajustada para o público infantil. Confortável e de alta durabilidade.',
    price: 55.00,
    category: 'Uniformes',
    image: '/uniformes/manga-curta-infantil/frente.jpg',
    imageBack: '/uniformes/manga-curta-infantil/costas.jpg'
  },
  {
    id: 6,
    name: 'Short Saia Padrão (Infantojuvenil)',
    description: 'Short saia oficial do colégio. Modelagem confortável para atividades diárias com excelente mobilidade.',
    price: 75.00,
    category: 'Uniformes',
    image: '/uniformes/short-saia-infantojuvenil/frente.jpg',
    imageBack: '/uniformes/short-saia-infantojuvenil/costas.jpg'
  }
])

const combinedProducts = ref([...mockProducts.value])

const fetchProducts = async () => {
  try {
    const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    console.log('🔄 Buscando produtos do banco...')
    console.log(`📡 URL da API: ${apiUrl}`)
    console.log(`🏢 Tenant ID: ${tenantId}`)
    
    // Busca os produtos na nova rota pública recém-criada no backend
    const endpoint = `${apiUrl}/api/store/${tenantId}/products`
    console.log(`🔗 Endpoint chamado: ${endpoint}`)
    
    const res = await fetch(endpoint)

    if (res.ok) {
      const data = await res.json()
      console.log('✅ Resposta da API:', data)
      
      // O backend pode retornar direto o array ou dentro de um objeto (ex: data.produtos ou data.products)
      const fetchedProducts = Array.isArray(data) ? data : (data.products || data.produtos || [])
      console.log(`📦 Produtos encontrados no banco: ${fetchedProducts.length}`, fetchedProducts)
      
      // Formata os produtos do banco para combinar com o padrão do frontend
      const formattedProducts = fetchedProducts.map(p => ({
        id: p._id,
        name: p.nome || p.name,
        description: p.descricao || p.description,
        price: p.preco || p.price,
        category: p.categoria || p.category || 'Outros',
        image: p.imagem || p.image || null,
        imageBack: null
      }))
      
      // Combina os produtos vindos do banco com os mockProducts
      combinedProducts.value = [...formattedProducts, ...mockProducts.value]
      console.log('🛒 Produtos combinados (Banco + Mock):', combinedProducts.value)
    } else {
      console.warn('❌ Erro na resposta da API. Status:', res.status)
      const errorText = await res.text()
      console.warn('📝 Detalhes do erro:', errorText)
    }
  } catch (error) {
    console.error('❌ Erro de rede ou ao buscar produtos:', error)
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
