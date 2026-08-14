<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
          <h2 class="text-lg font-medium text-slate-800 mb-6 pb-4 border-b border-slate-100">
            {{ isEditing ? 'Completar Cadastro' : 'Dados do Responsável/Aluno' }}
          </h2>
          
          <form @submit.prevent="isEditing ? saveProfileAndContinue() : submitOrder()" class="space-y-6">
            
            <!-- ====== MODO EDIÇÃO / CADASTRO INCOMPLETO ====== -->
            <div v-if="isEditing" class="space-y-6">
              <section>
                <h3 class="text-sm font-semibold text-slate-800 mb-4">Dados Pessoais</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                    <input 
                      v-model="profile.cpf" 
                      type="text" 
                      required
                      maxlength="14"
                      placeholder="000.000.000-00"
                      @input="maskCpf"
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                    <input 
                      v-model="profile.telefone" 
                      type="text" 
                      required
                      maxlength="15"
                      placeholder="(00) 00000-0000"
                      @input="maskPhone"
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-sm font-semibold text-slate-800 mb-4">Endereço de Entrega</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                    <input 
                      v-model="profile.endereco.cep" 
                      type="text" 
                      required
                      maxlength="9"
                      placeholder="00000-000"
                      @input="maskCep"
                      @blur="fetchAddress"
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                    <span v-if="loadingCep" class="text-xs text-primary mt-1 block">Buscando...</span>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Rua / Logradouro</label>
                    <input 
                      v-model="profile.endereco.logradouro" 
                      type="text" 
                      required
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Número</label>
                    <input 
                      v-model="profile.endereco.numero" 
                      type="text" 
                      required
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Complemento</label>
                    <input 
                      v-model="profile.endereco.complemento" 
                      type="text" 
                      placeholder="Apto 123, Bloco B"
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                    <input 
                      v-model="profile.endereco.bairro" 
                      type="text" 
                      required
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                  <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                    <input 
                      v-model="profile.endereco.cidade" 
                      type="text" 
                      required
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    >
                  </div>
                  <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                    <input 
                      v-model="profile.endereco.estado" 
                      type="text" 
                      required
                      maxlength="2"
                      placeholder="UF"
                      class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all uppercase"
                    >
                  </div>
                </div>
              </section>
            </div>

            <!-- ====== MODO READ-ONLY (DADOS PREENCHIDOS) ====== -->
            <div v-else class="space-y-4">
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

              <div class="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div class="flex justify-between items-start mb-2">
                  <span class="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Endereço de Entrega</span>
                  <button type="button" @click="editProfile" class="text-xs text-primary font-bold hover:underline cursor-pointer">Editar</button>
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
                :disabled="isLoading || authStore.loading"
                class="w-full bg-primary hover:bg-primary-dark text-slate-900 font-medium py-4 px-4 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isLoading || authStore.loading" class="w-5 h-5 animate-spin" />
                <span class="text-base" v-if="isEditing">
                  {{ (isLoading || authStore.loading) ? 'Salvando...' : 'Salvar e Continuar para Checkout' }}
                </span>
                <span class="text-base" v-else>
                  {{ isLoading ? 'Processando pagamento...' : 'Gerar Pagamento Seguro' }}
                </span>
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
            <div v-for="(item, idx) in cartStore.items" :key="(item.id || idx) + '-' + (item.selectedSize || 'nosize')" class="flex justify-between items-start gap-4">
              <div class="flex-grow">
                <p class="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
                  {{ item.name }}
                  <span v-if="item.selectedSize" class="ml-1.5 inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    Tam: {{ item.selectedSize }}
                  </span>
                </p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore, api } from '../stores/auth'
import { Loader2 } from '@lucide/vue'
import { toast } from 'vue-sonner'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const loadingCep = ref(false)
const isEditing = ref(false)

const profile = ref({
  cpf: '',
  telefone: '',
  endereco: {
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  }
})

onMounted(() => {
  // Se o cadastro estiver incompleto, abre direto no modo edição
  if (!authStore.storeProfile || authStore.storeProfile.statusCadastro !== 'completo') {
    isEditing.value = true
  }
  
  // Preenche dados existentes se houver
  if (authStore.storeProfile?.dadosPessoais) {
    profile.value.cpf = authStore.storeProfile.dadosPessoais.cpf || ''
    profile.value.telefone = authStore.storeProfile.dadosPessoais.telefone || ''
  }
  if (authStore.storeProfile?.enderecoEntrega) {
    profile.value.endereco = { ...authStore.storeProfile.enderecoEntrega }
  }
})

const editProfile = () => {
  isEditing.value = true
}

// ==== Máscaras e ViaCEP ====
const maskCpf = (e) => {
  let v = e.target.value.replace(/\D/g, "")
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  profile.value.cpf = v
}

const maskPhone = (e) => {
  let v = e.target.value.replace(/\D/g, "")
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2")
  v = v.replace(/(\d)(\d{4})$/, "$1-$2")
  profile.value.telefone = v
}

const maskCep = (e) => {
  let v = e.target.value.replace(/\D/g, "")
  if (v.length > 8) v = v.slice(0, 8)
  v = v.replace(/^(\d{5})(\d)/, "$1-$2")
  profile.value.endereco.cep = v
}

const fetchAddress = async () => {
  const cep = profile.value.endereco.cep.replace(/\D/g, '')
  if (cep.length === 8) {
    loadingCep.value = true
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        profile.value.endereco.logradouro = data.logradouro
        profile.value.endereco.bairro = data.bairro
        profile.value.endereco.cidade = data.localidade
        profile.value.endereco.estado = data.uf
      }
    } catch (e) {
      console.error(e)
    } finally {
      loadingCep.value = false
    }
  }
}

const isValidCPF = (cpf) => {
  const clean = String(cpf).replace(/\D/g, '')
  if (clean.length !== 11) return false
  if (/^(\d)\1{10}$/.test(clean)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean.charAt(i)) * (10 - i)
  }
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(clean.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean.charAt(i)) * (11 - i)
  }
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(clean.charAt(10))) return false

  return true
}

// ==== Ações ====

const saveProfileAndContinue = async () => {
  const cleanCpf = profile.value.cpf.replace(/\D/g, '')
  if (!isValidCPF(cleanCpf)) {
    alert('O CPF informado não é válido. Por favor, digite um CPF válido.')
    return
  }

  const cleanPhone = profile.value.telefone.replace(/\D/g, '')
  if (cleanPhone.length < 10) {
    alert('Por favor, informe um número de telefone com DDD válido.')
    return
  }

  try {
    const payload = {
      dadosPessoais: {
        cpf: cleanCpf,
        telefone: cleanPhone
      },
      enderecoEntrega: profile.value.endereco,
      statusCadastro: 'completo'
    }
    
    await authStore.completeProfile(payload)
    isEditing.value = false // Muda para read-only e permite gerar o link
  } catch (err) {
    console.error('Erro ao salvar o perfil.', err)
    alert('Ocorreu um erro ao salvar seus dados. Tente novamente.')
  }
}

const submitOrder = async () => {
  if (isEditing.value) {
    // Caso a pessoa tenha burlado, garante que vai salvar
    await saveProfileAndContinue()
  }
  
  if (authStore.storeProfile?.statusCadastro !== 'completo') {
    alert("Por favor, preencha todos os dados antes de continuar.")
    return
  }

  isLoading.value = true
  
  try {
    // Preparando os itens no formato que o nosso Backend espera
    const itensPedido = cartStore.items.map(item => ({
      produtoId: item.id || item._id, // Depende de como está no carrinho
      quantidade: item.quantity,
      tamanhoSelecionado: item.selectedSize || item.tamanhoSelecionado || item.size || null
    }))

    const tenantId = import.meta.env.VITE_TENANT_ID || 'ID_DO_COLACO_AQUI'
    
    const userName = (
      `${authStore.user?.firstName || ''} ${authStore.user?.lastName || ''}`.trim() ||
      authStore.user?.name ||
      authStore.user?.nome ||
      authStore.user?.email?.split('@')[0] ||
      'Cliente'
    )

    const userEmail = authStore.user?.email || ''
    const userTaxId = (authStore.storeProfile?.dadosPessoais?.cpf || profile.value.cpf || '').replace(/\D/g, '')
    const userCellphone = (authStore.storeProfile?.dadosPessoais?.telefone || profile.value.telefone || '').replace(/\D/g, '')

    const customerData = {
      name: userName,
      email: userEmail,
      taxId: userTaxId,
      cellphone: userCellphone
    }

    // Chama o NOSSO backend, que fará a ponte com a AbacatePay
    const response = await api.post('/api/store/checkout', {
      tenantId: tenantId,
      userStoreId: authStore.user?._id, // ID do usuário logado
      customer: customerData,
      itens: itensPedido
    })

    const data = response.data
    
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
    const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Ocorreu um erro ao gerar o link de pagamento. Tente novamente.'
    toast.error('Erro ao Finalizar Pedido', {
      description: errorMsg,
      duration: 5000
    })
    alert(errorMsg)
  } finally {
    isLoading.value = false
  }
}
</script>
