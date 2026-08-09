<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="mb-10">
      <h1 class="text-3xl font-light text-slate-800 tracking-tight">Finalizar <span class="font-semibold">Pedido</span></h1>
      <p class="text-slate-500 mt-2 font-light">Preencha os dados abaixo para gerar o seu link de pagamento.</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
      <p class="text-slate-500 mb-6 font-light text-lg">Você não possui itens no carrinho para finalizar.</p>
      <router-link to="/" class="px-8 py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10">
        Voltar à Loja
      </router-link>
    </div>

    <div v-else class="grid lg:grid-cols-5 gap-10">
      <!-- Formulário de Dados -->
      <div class="lg:col-span-3">
        <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.02)]">
          <h2 class="text-lg font-medium text-slate-800 mb-6 pb-4 border-b border-slate-100">Dados do Responsável/Aluno</h2>
          
          <form @submit.prevent="submitOrder" class="space-y-6">
            <div class="space-y-4">
              <!-- Dados do Usuário (Read Only) -->
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span class="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Nome Completo</span>
                    <span class="text-slate-900 font-medium">{{ authStore.user?.firstName || 'Carregando...' }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Email</span>
                    <span class="text-slate-900 font-medium">{{ authStore.user?.email || 'Carregando...' }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">CPF</span>
                    <span class="text-slate-900 font-medium">{{ authStore.storeProfile?.dadosPessoais?.cpf || 'Não informado' }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Telefone</span>
                    <span class="text-slate-900 font-medium">{{ authStore.storeProfile?.dadosPessoais?.telefone || 'Não informado' }}</span>
                  </div>
                </div>
              </div>

              <!-- Endereço de Entrega (Read Only) -->
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div class="flex justify-between items-start mb-2">
                  <span class="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Endereço de Entrega</span>
                  <router-link to="/completar-cadastro" class="text-xs text-primary font-bold hover:underline">Editar</router-link>
                </div>
                <div class="text-slate-900 font-medium">
                  {{ authStore.storeProfile?.enderecoEntrega?.logradouro }}, {{ authStore.storeProfile?.enderecoEntrega?.numero }}
                  <span v-if="authStore.storeProfile?.enderecoEntrega?.complemento"> - {{ authStore.storeProfile.enderecoEntrega.complemento }}</span>
                </div>
                <div class="text-slate-500 text-sm mt-1">
                  {{ authStore.storeProfile?.enderecoEntrega?.bairro }} - {{ authStore.storeProfile?.enderecoEntrega?.cidade }}/{{ authStore.storeProfile?.enderecoEntrega?.estado }}
                </div>
                <div class="text-slate-500 text-sm mt-1">
                  CEP: {{ authStore.storeProfile?.enderecoEntrega?.cep }}
                </div>
              </div>
            </div>

            <div class="pt-6">
              <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full bg-primary hover:bg-primary-dark text-slate-900 font-medium py-4 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
                <span class="text-base">{{ isLoading ? 'Processando pagamento...' : 'Gerar Pagamento Seguro' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Resumo Lateral -->
      <div class="lg:col-span-2">
        <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100 sticky top-28">
          <h2 class="text-lg font-medium text-slate-800 mb-6 pb-4 border-b border-slate-200">Resumo do Pedido</h2>
          
          <div class="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-start gap-4">
              <div class="flex-grow">
                <p class="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">{{ item.name }}</p>
                <p class="text-xs text-slate-500 mt-1">Qtd: {{ item.quantity }}</p>
              </div>
              <span class="font-medium text-slate-900 whitespace-nowrap text-sm">R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="border-t border-slate-200 pt-6 flex justify-between items-end">
            <span class="text-sm font-medium text-slate-500 uppercase tracking-wide">Total a Pagar</span>
            <span class="text-3xl font-semibold text-slate-900 tracking-tight">R$ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { Loader2 } from '@lucide/vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)

const submitOrder = async () => {
  isLoading.value = true
  
  try {
    // Preparando os itens no formato que a API de Pagamentos espera
    const itensPedido = cartStore.items.map(item => ({
      nome: item.name,
      preco: item.price,
      quantidade: item.quantity
    }))

    // Substitua localhost:3001 pela URL base da sua API de Pagamentos
    const response = await fetch('http://localhost:3001/api/payments/gerar-loja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Como o login está desativado por enquanto, enviamos um ID genérico ou pegamos do authStore se existir
        userId: authStore.user?._id || '68effb2b61a39f08cda9920a', 
        descricaoPedido: 'Compra Lojinha 360',
        itens: itensPedido
      })
    })

    if (!response.ok) {
      throw new Error('Falha ao comunicar com a API de Pagamentos')
    }

    const data = await response.json()
    
    if (data.checkoutUrl) {
      // Limpa o carrinho e redireciona para a AbacatePay
      cartStore.clearCart()
      window.location.href = data.checkoutUrl
    } else {
      // Fallback caso não retorne a URL
      cartStore.clearCart()
      router.push('/success')
    }
    
  } catch (error) {
    console.error('Erro ao gerar pagamento:', error)
    alert('Ocorreu um erro ao gerar o link de pagamento. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}
</script>
