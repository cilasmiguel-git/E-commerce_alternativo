<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    
    <!-- Cabeçalho -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-light text-slate-800 tracking-tight">
          Meus <span class="font-semibold text-slate-900">Pedidos</span>
        </h1>
        <p class="text-slate-500 mt-1 font-light">
          Acompanhe o status e histórico de suas compras na escola.
        </p>
      </div>

      <button 
        @click="fetchOrders" 
        :disabled="loading"
        class="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
        Atualizar
      </button>
    </div>

    <!-- Estado Carregando -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <div class="h-4 bg-slate-200 rounded w-1/4"></div>
          <div class="h-6 bg-slate-200 rounded-full w-24"></div>
        </div>
        <div class="h-12 bg-slate-100 rounded-lg mb-4"></div>
        <div class="flex justify-between items-center pt-2">
          <div class="h-4 bg-slate-200 rounded w-1/6"></div>
          <div class="h-10 bg-slate-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>

    <!-- Estado de Erro -->
    <div v-else-if="error" class="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center text-rose-800">
      <AlertCircle class="w-10 h-10 text-rose-500 mx-auto mb-3" />
      <p class="font-medium text-base mb-2">{{ error }}</p>
      <button 
        @click="fetchOrders" 
        class="mt-2 px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
      >
        Tentar Novamente
      </button>
    </div>

    <!-- Sem Pedidos -->
    <div v-else-if="orders.length === 0" class="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-[0_4px_20px_-4px_rgba(6,81,237,0.03)]">
      <div class="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag class="w-10 h-10 stroke-1" />
      </div>
      <h2 class="text-xl font-medium text-slate-800 mb-2">Nenhum pedido encontrado</h2>
      <p class="text-slate-500 mb-8 font-light max-w-md mx-auto">
        Você ainda não realizou compras na nossa loja. Navegue pelo catálogo e faça seu primeiro pedido!
      </p>
      <router-link 
        to="/" 
        class="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
      >
        Ir para a Loja
      </router-link>
    </div>

    <!-- Lista de Pedidos -->
    <div v-else class="space-y-6">
      <div 
        v-for="order in orders" 
        :key="order._id"
        class="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_-3px_rgba(6,81,237,0.03)] overflow-hidden transition-all hover:border-slate-200"
      >
        <!-- Topo do Card -->
        <div class="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pedido #{{ getShortId(order._id) }}
            </span>
            <span class="text-slate-300">•</span>
            <span class="text-xs text-slate-500 font-medium">
              {{ formatDate(order.createdAt) }}
            </span>
          </div>

          <!-- Status Badge -->
          <div>
            <!-- PENDENTE -->
            <span 
              v-if="isPending(order)"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full text-xs font-semibold"
            >
              <Clock class="w-3.5 h-3.5 text-amber-500" />
              Pagamento Pendente
            </span>

            <!-- PAGO -->
            <span 
              v-else-if="isPaid(order)"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-semibold"
            >
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
              Pago
            </span>

            <!-- CANCELADO -->
            <span 
              v-else-if="isCanceled(order)"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full text-xs font-semibold"
            >
              <XCircle class="w-3.5 h-3.5 text-rose-500" />
              Cancelado
            </span>

            <!-- OUTRO -->
            <span 
              v-else
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-semibold"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- Itens do Pedido -->
        <div class="p-6">
          <div class="space-y-4 divide-y divide-slate-100">
            <div 
              v-for="(item, idx) in order.itens" 
              :key="idx" 
              class="pt-4 first:pt-0 flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img 
                    v-if="getItemImage(item)" 
                    :src="getItemImage(item)" 
                    :alt="getItemName(item)"
                    class="w-full h-full object-cover" 
                  />
                  <ShoppingBag v-else class="w-6 h-6 text-slate-300" />
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-slate-800 line-clamp-1">
                    {{ getItemName(item) }}
                  </h3>
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>Qtd: {{ item.quantidade }}</span>
                    <span v-if="item.tamanhoSelecionado" class="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                      Tam: {{ item.tamanhoSelecionado }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <span class="text-sm font-medium text-slate-900">
                  R$ {{ ((item.precoSnapshot || 0) * item.quantidade).toFixed(2) }}
                </span>
                <span v-if="item.quantidade > 1" class="block text-xs text-slate-400">
                  R$ {{ (item.precoSnapshot || 0).toFixed(2) }}/un
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Rodapé do Card -->
        <div class="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs text-slate-500 uppercase tracking-wider block font-medium">Valor Total</span>
            <span class="text-2xl font-bold text-slate-900">
              R$ {{ (order.subtotal || 0).toFixed(2) }}
            </span>
          </div>

          <!-- Ações conforme o Status -->
          <div>
            <!-- Se PENDENTE -> Botão para Pagar -->
            <a 
              v-if="isPending(order) && getPaymentLink(order)"
              :href="getPaymentLink(order)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <CreditCard class="w-4 h-4" />
              Pagar Agora (PIX / Cartão)
              <ExternalLink class="w-3.5 h-3.5" />
            </a>

            <!-- Se PAGO -->
            <div v-else-if="isPaid(order)" class="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
              <CheckCircle2 class="w-4 h-4" />
              Pagamento Confirmado
            </div>

            <!-- Se CANCELADO -->
            <div v-else-if="isCanceled(order)" class="inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-100 px-4 py-2.5 rounded-xl">
              <XCircle class="w-4 h-4" />
              Pedido Cancelado
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore, api } from '../stores/auth'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  RefreshCw, 
  CreditCard,
  AlertCircle 
} from '@lucide/vue'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(true)
const error = ref(null)

const fetchOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const tenantId = import.meta.env.VITE_TENANT_ID || '661ab827e28d23715a018479'
    const userId = authStore.user?._id || authStore.user?.id || authStore.storeProfile?.user360Id

    if (!userId) {
      error.value = 'Usuário não identificado. Por favor, faça login novamente.'
      return
    }

    const res = await api.get(`/api/store/${tenantId}/orders/${userId}`)
    
    if (res.data && res.data.orders) {
      orders.value = res.data.orders
    } else {
      orders.value = []
    }
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err)
    error.value = err.response?.data?.message || 'Não foi possível carregar seus pedidos.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

// Helpers de formatação e verificação
const getShortId = (id) => {
  if (!id) return ''
  return id.substring(id.length - 6).toUpperCase()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const isPending = (order) => {
  const st = (order.status || '').toLowerCase()
  const stPag = (order.pagamentoInfo?.statusPagamento || '').toLowerCase()
  return st.includes('pendente') || st === 'pending' || stPag === 'pending'
}

const isPaid = (order) => {
  const st = (order.status || '').toLowerCase()
  const stPag = (order.pagamentoInfo?.statusPagamento || '').toLowerCase()
  return st === 'pago' || st === 'paid' || stPag === 'paid'
}

const isCanceled = (order) => {
  const st = (order.status || '').toLowerCase()
  return st === 'cancelado' || st === 'canceled'
}

const getPaymentLink = (order) => {
  return order.pagamentoInfo?.paymentLink || null
}

const getItemName = (item) => {
  return item.nomeSnapshot || item.produtoId?.nome || 'Produto'
}

const getItemImage = (item) => {
  if (item.produtoId?.imagens && item.produtoId.imagens.length > 0) {
    return item.produtoId.imagens[0]
  }
  return null
}
</script>
