<template>
  <div class="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Completar Cadastro</h1>
      <p class="text-slate-500 text-sm">Precisamos de alguns dados adicionais para emissão da nota fiscal e entrega do seu pedido.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      
      <!-- Dados Pessoais -->
      <section>
        <h2 class="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Dados Pessoais</h2>
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

      <!-- Endereço -->
      <section>
        <h2 class="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Endereço de Entrega</h2>
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

      <!-- Submit -->
      <button 
        type="submit" 
        :disabled="authStore.loading"
        class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-8"
      >
        <span v-if="authStore.loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        <span v-else>Salvar e Continuar para Checkout</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()
const loadingCep = ref(false)

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
  // Se por acaso já tiver dados, preenche
  if (authStore.storeProfile?.dadosPessoais) {
    profile.value.cpf = authStore.storeProfile.dadosPessoais.cpf || ''
    profile.value.telefone = authStore.storeProfile.dadosPessoais.telefone || ''
  }
  if (authStore.storeProfile?.enderecoEntrega) {
    profile.value.endereco = { ...authStore.storeProfile.enderecoEntrega }
  }
})

const handleSubmit = async () => {
  try {
    const payload = {
      dadosPessoais: {
        cpf: profile.value.cpf.replace(/\D/g, ''),
        telefone: profile.value.telefone.replace(/\D/g, '')
      },
      enderecoEntrega: profile.value.endereco,
      statusCadastro: 'completo'
    }
    
    await authStore.completeProfile(payload)
    toast.success('Cadastro concluído com sucesso!')
    router.push('/checkout')
  } catch (err) {
    toast.error('Ocorreu um erro ao salvar o perfil.')
  }
}

// Máscaras (funções puras simples para evitar libs extras)
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
</script>
