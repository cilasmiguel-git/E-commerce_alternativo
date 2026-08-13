<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    
    <!-- Cabeçalho -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-light text-slate-800 tracking-tight">
          Meu <span class="font-semibold text-slate-900">Perfil</span>
        </h1>
        <p class="text-slate-500 mt-1 font-light">
          Gerencie seus dados pessoais, fiscais e endereço de entrega.
        </p>
      </div>

      <!-- Botão de Sair -->
      <button 
        @click="handleLogout"
        class="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 rounded-xl text-xs font-semibold transition-all shadow-sm"
      >
        <LogOut class="w-3.5 h-3.5" />
        Sair da Conta
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- Card da Conta / Resumo -->
      <div class="md:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-3px_rgba(6,81,237,0.03)] text-center">
          <div class="w-20 h-20 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200/60 shadow-inner">
            <User class="w-10 h-10 stroke-1 text-slate-600" />
          </div>
          
          <h2 class="text-lg font-semibold text-slate-900">
            {{ userName }}
          </h2>
          <p class="text-xs text-slate-500 mb-4">{{ authStore.user?.email }}</p>

          <div class="pt-4 border-t border-slate-100 flex justify-center items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-500" />
            <span class="text-xs font-medium text-slate-600">Conta Autenticada</span>
          </div>
        </div>

        <!-- Card de Atalho para Pedidos -->
        <div class="bg-slate-900 p-6 rounded-2xl text-white shadow-md shadow-slate-900/10">
          <div class="flex items-center gap-3 mb-3">
            <ShoppingBag class="w-5 h-5 text-amber-400" />
            <h3 class="font-semibold text-sm">Acompanhar Pedidos</h3>
          </div>
          <p class="text-xs text-slate-300 mb-4 font-light leading-relaxed">
            Veja o histórico de compras, pendências e links de pagamento ativos.
          </p>
          <router-link 
            to="/orders" 
            class="block text-center w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Ir para Meus Pedidos
          </router-link>
        </div>
      </div>

      <!-- Formulário de Edição -->
      <div class="md:col-span-2">
        <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_2px_12px_-3px_rgba(6,81,237,0.03)]">
          <form @submit.prevent="saveProfile" class="space-y-6">
            
            <!-- Seção 1: Dados Pessoais & Fiscais -->
            <div>
              <h2 class="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <UserCheck class="w-4 h-4 text-slate-500" />
                Dados Pessoais e Fiscais
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">CPF (obrigatório para notas/pagamentos)</label>
                  <input 
                    v-model="profile.cpf" 
                    type="text" 
                    required
                    maxlength="14"
                    placeholder="000.000.000-00"
                    @input="maskCpf"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input 
                    v-model="profile.telefone" 
                    type="text" 
                    required
                    maxlength="15"
                    placeholder="(00) 00000-0000"
                    @input="maskPhone"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Seção 2: Endereço -->
            <div>
              <h2 class="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin class="w-4 h-4 text-slate-500" />
                Endereço de Entrega / Cadastro
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="md:col-span-1">
                  <label class="block text-xs font-medium text-slate-700 mb-1">CEP</label>
                  <input 
                    v-model="profile.endereco.cep" 
                    type="text" 
                    required
                    maxlength="9"
                    placeholder="00000-000"
                    @input="maskCep"
                    @blur="fetchAddress"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                  <span v-if="loadingCep" class="text-xs text-slate-500 mt-1 block">Buscando CEP...</span>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-slate-700 mb-1">Rua / Logradouro</label>
                  <input 
                    v-model="profile.endereco.logradouro" 
                    type="text" 
                    required
                    placeholder="Av. Principal, Rua Exemplo..."
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="md:col-span-1">
                  <label class="block text-xs font-medium text-slate-700 mb-1">Número</label>
                  <input 
                    v-model="profile.endereco.numero" 
                    type="text" 
                    required
                    placeholder="123"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-slate-700 mb-1">Complemento (Opcional)</label>
                  <input 
                    v-model="profile.endereco.complemento" 
                    type="text" 
                    placeholder="Apto 101, Bloco B"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Bairro</label>
                  <input 
                    v-model="profile.endereco.bairro" 
                    type="text" 
                    required
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Cidade</label>
                  <input 
                    v-model="profile.endereco.cidade" 
                    type="text" 
                    required
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-700 mb-1">Estado (UF)</label>
                  <input 
                    v-model="profile.endereco.estado" 
                    type="text" 
                    required
                    maxlength="2"
                    placeholder="UF"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Botão Salvar -->
            <div class="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                :disabled="saving"
                class="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                <span>{{ saving ? 'Salvando...' : 'Salvar Alterações' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue-sonner'
import { 
  User, 
  UserCheck, 
  MapPin, 
  ShoppingBag, 
  ShieldCheck, 
  LogOut, 
  Loader2 
} from '@lucide/vue'

const authStore = useAuthStore()
const router = useRouter()

const saving = ref(false)
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

const userName = computed(() => {
  const first = authStore.user?.firstName || ''
  const last = authStore.user?.lastName || ''
  const full = `${first} ${last}`.trim()
  return full || authStore.user?.name || authStore.user?.nome || 'Usuário'
})

onMounted(() => {
  // Preenche dados existentes se houver
  if (authStore.storeProfile?.dadosPessoais) {
    profile.value.cpf = formatCpfString(authStore.storeProfile.dadosPessoais.cpf || '')
    profile.value.telefone = formatPhoneString(authStore.storeProfile.dadosPessoais.telefone || '')
  }
  if (authStore.storeProfile?.enderecoEntrega) {
    profile.value.endereco = { ...authStore.storeProfile.enderecoEntrega }
  }
})

// Máscaras e Formatações
const maskCpf = (e) => {
  profile.value.cpf = formatCpfString(e.target.value)
}

const formatCpfString = (val) => {
  let v = String(val).replace(/\D/g, "")
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  return v
}

const maskPhone = (e) => {
  profile.value.telefone = formatPhoneString(e.target.value)
}

const formatPhoneString = (val) => {
  let v = String(val).replace(/\D/g, "")
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2")
  v = v.replace(/(\d)(\d{4})$/, "$1-$2")
  return v
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
      console.error('Erro ao buscar CEP:', e)
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

const saveProfile = async () => {
  const cleanCpf = profile.value.cpf.replace(/\D/g, '')
  if (!isValidCPF(cleanCpf)) {
    toast.error('CPF Inválido', { description: 'Por favor, informe um CPF válido.' })
    return
  }

  const cleanPhone = profile.value.telefone.replace(/\D/g, '')
  if (cleanPhone.length < 10) {
    toast.error('Telefone Inválido', { description: 'Por favor, informe um telefone com DDD válido.' })
    return
  }

  saving.value = true
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
    toast.success('Perfil Atualizado!', { description: 'Seus dados foram salvos com sucesso.' })
  } catch (err) {
    console.error(err)
    toast.error('Erro ao Salvar', { description: err.message || 'Não foi possível salvar seu perfil.' })
  } finally {
    saving.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  toast.info('Você saiu da sua conta.')
  router.push('/')
}
</script>
